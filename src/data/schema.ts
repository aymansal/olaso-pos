export const LOCAL_DATABASE_NAME = 'olaso_pos';

export const localMigrations = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        sort_order INTEGER NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('active', 'archived')),
        revision INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY NOT NULL,
        category_id TEXT NOT NULL REFERENCES categories(id),
        name TEXT NOT NULL,
        receipt_name TEXT NOT NULL,
        price_centimes INTEGER NOT NULL CHECK (price_centimes >= 0),
        status TEXT NOT NULL CHECK (
          status IN ('active', 'unavailable', 'archived')
        ),
        image_asset_key TEXT,
        sort_order INTEGER NOT NULL,
        current_recipe_version_id TEXT,
        revision INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS modifier_groups (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        minimum_selections INTEGER NOT NULL CHECK (minimum_selections >= 0),
        maximum_selections INTEGER NOT NULL CHECK (
          maximum_selections >= minimum_selections
        ),
        status TEXT NOT NULL CHECK (status IN ('active', 'archived')),
        revision INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS modifier_options (
        id TEXT PRIMARY KEY NOT NULL,
        modifier_group_id TEXT NOT NULL REFERENCES modifier_groups(id),
        name TEXT NOT NULL,
        price_delta_centimes INTEGER NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('active', 'archived')),
        sort_order INTEGER NOT NULL,
        revision INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS product_modifier_groups (
        product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        modifier_group_id TEXT NOT NULL
          REFERENCES modifier_groups(id) ON DELETE CASCADE,
        sort_order INTEGER NOT NULL,
        PRIMARY KEY (product_id, modifier_group_id)
      )`,
      `CREATE TABLE IF NOT EXISTS recipe_versions (
        id TEXT PRIMARY KEY NOT NULL,
        product_id TEXT NOT NULL REFERENCES products(id),
        version INTEGER NOT NULL CHECK (version > 0),
        is_active INTEGER NOT NULL CHECK (is_active IN (0, 1)),
        created_at INTEGER NOT NULL,
        UNIQUE (product_id, version)
      )`,
      `CREATE TABLE IF NOT EXISTS ingredients (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        base_unit TEXT NOT NULL CHECK (
          base_unit IN ('millilitre', 'gram', 'milligram', 'piece')
        ),
        current_stock_quantity INTEGER NOT NULL CHECK (
          current_stock_quantity >= 0
        ),
        low_stock_threshold INTEGER NOT NULL CHECK (
          low_stock_threshold >= 0
        ),
        status TEXT NOT NULL CHECK (status IN ('active', 'archived')),
        revision INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS recipe_items (
        recipe_version_id TEXT NOT NULL
          REFERENCES recipe_versions(id) ON DELETE CASCADE,
        ingredient_id TEXT NOT NULL REFERENCES ingredients(id),
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        PRIMARY KEY (recipe_version_id, ingredient_id)
      )`,
      `CREATE TABLE IF NOT EXISTS sales (
        local_sale_id TEXT PRIMARY KEY NOT NULL,
        device_id TEXT NOT NULL,
        cloud_sale_id TEXT,
        receipt_number TEXT NOT NULL,
        status TEXT NOT NULL CHECK (
          status IN ('completed', 'cancelled', 'refunded')
        ),
        service_type TEXT NOT NULL CHECK (
          service_type IN ('dine-in', 'take-away', 'order-online')
        ),
        customer_name TEXT,
        table_label TEXT,
        subtotal_centimes INTEGER NOT NULL CHECK (subtotal_centimes >= 0),
        tax_centimes INTEGER NOT NULL CHECK (tax_centimes >= 0),
        total_centimes INTEGER NOT NULL CHECK (total_centimes >= 0),
        currency TEXT NOT NULL,
        business_date TEXT NOT NULL,
        receipt_snapshot_json TEXT NOT NULL,
        sync_state TEXT NOT NULL CHECK (
          sync_state IN ('pending', 'synced', 'failed')
        ),
        created_at INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS sale_items (
        id TEXT PRIMARY KEY NOT NULL,
        local_sale_id TEXT NOT NULL
          REFERENCES sales(local_sale_id) ON DELETE CASCADE,
        product_id TEXT,
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        product_name_snapshot TEXT NOT NULL,
        unit_price_centimes INTEGER NOT NULL CHECK (
          unit_price_centimes >= 0
        ),
        modifier_snapshot_json TEXT NOT NULL DEFAULT '[]',
        recipe_snapshot_json TEXT NOT NULL DEFAULT '[]',
        line_total_centimes INTEGER NOT NULL CHECK (
          line_total_centimes >= 0
        )
      )`,
      `CREATE TABLE IF NOT EXISTS stock_movements (
        id TEXT PRIMARY KEY NOT NULL,
        ingredient_id TEXT NOT NULL REFERENCES ingredients(id),
        local_sale_id TEXT REFERENCES sales(local_sale_id),
        quantity_delta INTEGER NOT NULL CHECK (quantity_delta <> 0),
        movement_type TEXT NOT NULL,
        reason TEXT NOT NULL,
        actor_label TEXT,
        business_date TEXT NOT NULL,
        created_at INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS outbox (
        operation_id TEXT PRIMARY KEY NOT NULL,
        device_id TEXT NOT NULL,
        operation_type TEXT NOT NULL,
        local_record_id TEXT NOT NULL,
        state TEXT NOT NULL CHECK (state IN ('pending', 'failed')),
        attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
        last_error TEXT,
        created_at INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS device_settings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      )`,
      `CREATE INDEX IF NOT EXISTS products_by_category
        ON products(category_id, status, sort_order)`,
      `CREATE INDEX IF NOT EXISTS modifier_options_by_group
        ON modifier_options(modifier_group_id, status, sort_order)`,
      `CREATE INDEX IF NOT EXISTS recipe_versions_by_product
        ON recipe_versions(product_id, is_active, version)`,
      `CREATE INDEX IF NOT EXISTS recipe_items_by_ingredient
        ON recipe_items(ingredient_id)`,
      `CREATE INDEX IF NOT EXISTS sales_by_business_date
        ON sales(business_date, created_at DESC)`,
      `CREATE INDEX IF NOT EXISTS stock_movements_by_ingredient
        ON stock_movements(ingredient_id, created_at DESC)`,
    ],
  },
  {
    toVersion: 2,
    statements: [
      `ALTER TABLE outbox
        ADD COLUMN available_at INTEGER NOT NULL DEFAULT 0`,
      `CREATE INDEX IF NOT EXISTS outbox_by_availability
        ON outbox(available_at, created_at)`,
      `CREATE TABLE IF NOT EXISTS sync_state (
        id INTEGER PRIMARY KEY NOT NULL CHECK (id = 1),
        last_cursor TEXT,
        last_success_at INTEGER,
        last_error TEXT
      )`,
      `INSERT OR IGNORE INTO sync_state (id) VALUES (1)`,
    ],
  },
  {
    toVersion: 3,
    statements: [
      `ALTER TABLE categories
        ADD COLUMN key TEXT NOT NULL DEFAULT ''`,
      `UPDATE categories SET key = id WHERE key = ''`,
      `ALTER TABLE modifier_options
        ADD COLUMN ingredient_effects_json TEXT NOT NULL DEFAULT '[]'`,
      `ALTER TABLE ingredients
        ADD COLUMN local_stock_delta INTEGER NOT NULL DEFAULT 0`,
    ],
  },
  {
    toVersion: 4,
    statements: [
      `CREATE INDEX IF NOT EXISTS sales_by_created_at
        ON sales(created_at DESC, local_sale_id DESC)`,
      `CREATE INDEX IF NOT EXISTS outbox_by_local_record
        ON outbox(operation_type, local_record_id)`,
    ],
  },
  {
    toVersion: 5,
    statements: [
      `ALTER TABLE sales
        ADD COLUMN print_state TEXT NOT NULL DEFAULT 'pending'
        CHECK (print_state IN ('pending', 'printed', 'failed'))`,
      `ALTER TABLE sales
        ADD COLUMN print_attempt_count INTEGER NOT NULL DEFAULT 0
        CHECK (print_attempt_count >= 0)`,
      `ALTER TABLE sales
        ADD COLUMN last_print_attempt_at INTEGER`,
      `ALTER TABLE sales
        ADD COLUMN last_print_error_code TEXT`,
      `ALTER TABLE sales
        ADD COLUMN last_print_error_message TEXT`,
      `ALTER TABLE sales
        ADD COLUMN last_print_bytes_written INTEGER
        CHECK (last_print_bytes_written >= 0)`,
      `ALTER TABLE sales
        ADD COLUMN last_print_total_ms INTEGER
        CHECK (last_print_total_ms >= 0)`,
    ],
  },
  {
    toVersion: 6,
    statements: [
      `ALTER TABLE ingredients
        ADD COLUMN inventory_value_centimes INTEGER
        CHECK (inventory_value_centimes >= 0)`,
      `ALTER TABLE ingredients
        ADD COLUMN cost_status TEXT NOT NULL DEFAULT 'incomplete'
        CHECK (cost_status IN ('complete', 'incomplete'))`,
      `ALTER TABLE ingredients
        ADD COLUMN valuation_revision INTEGER NOT NULL DEFAULT 0
        CHECK (valuation_revision >= 0)`,
      `ALTER TABLE sales
        ADD COLUMN ingredient_cost_centimes INTEGER
        CHECK (ingredient_cost_centimes >= 0)`,
      `ALTER TABLE sales
        ADD COLUMN cost_status TEXT NOT NULL DEFAULT 'incomplete'
        CHECK (cost_status IN ('complete', 'incomplete'))`,
      `ALTER TABLE sale_items
        ADD COLUMN ingredient_cost_centimes INTEGER
        CHECK (ingredient_cost_centimes >= 0)`,
      `ALTER TABLE sale_items
        ADD COLUMN cost_status TEXT NOT NULL DEFAULT 'incomplete'
        CHECK (cost_status IN ('complete', 'incomplete'))`,
      `ALTER TABLE stock_movements
        ADD COLUMN cost_delta_centimes INTEGER`,
      `ALTER TABLE stock_movements
        ADD COLUMN inventory_value_after_centimes INTEGER
        CHECK (inventory_value_after_centimes >= 0)`,
      `ALTER TABLE stock_movements
        ADD COLUMN valuation_revision INTEGER
        CHECK (valuation_revision >= 0)`,
      `CREATE TABLE IF NOT EXISTS inventory_purchases (
        id TEXT PRIMARY KEY NOT NULL,
        ingredient_id TEXT NOT NULL REFERENCES ingredients(id),
        stock_movement_id TEXT NOT NULL REFERENCES stock_movements(id),
        package_label TEXT NOT NULL,
        package_count INTEGER NOT NULL CHECK (package_count > 0),
        quantity_per_package INTEGER NOT NULL CHECK (quantity_per_package > 0),
        total_quantity INTEGER NOT NULL CHECK (total_quantity > 0),
        package_price_centimes INTEGER NOT NULL CHECK (package_price_centimes >= 0),
        total_cost_centimes INTEGER NOT NULL CHECK (total_cost_centimes >= 0),
        received_at INTEGER NOT NULL,
        business_date TEXT NOT NULL,
        supplier_label TEXT,
        note TEXT,
        correction_of_purchase_id TEXT REFERENCES inventory_purchases(id),
        revision INTEGER NOT NULL CHECK (revision > 0),
        client_mutation_id TEXT NOT NULL UNIQUE
      )`,
      `CREATE TABLE IF NOT EXISTS staff_profiles (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'worker')),
        status TEXT NOT NULL CHECK (status IN ('active', 'archived')),
        revision INTEGER NOT NULL CHECK (revision > 0),
        updated_at INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS compensation_periods (
        id TEXT PRIMARY KEY NOT NULL,
        staff_profile_id TEXT NOT NULL REFERENCES staff_profiles(id),
        monthly_amount_centimes INTEGER NOT NULL CHECK (monthly_amount_centimes >= 0),
        effective_start_month TEXT NOT NULL,
        effective_end_month TEXT,
        revision INTEGER NOT NULL CHECK (revision > 0),
        created_at INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS operating_expenses (
        id TEXT PRIMARY KEY NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        amount_centimes INTEGER NOT NULL CHECK (amount_centimes >= 0),
        recurrence TEXT NOT NULL CHECK (recurrence IN ('one-time', 'monthly')),
        effective_date TEXT,
        effective_start_month TEXT,
        effective_end_month TEXT,
        status TEXT NOT NULL CHECK (status IN ('active', 'archived')),
        revision INTEGER NOT NULL CHECK (revision > 0),
        created_at INTEGER NOT NULL
      )`,
      `CREATE INDEX IF NOT EXISTS inventory_purchases_by_ingredient_date
        ON inventory_purchases(ingredient_id, received_at DESC)`,
      `CREATE INDEX IF NOT EXISTS inventory_purchases_by_business_date
        ON inventory_purchases(business_date, received_at DESC)`,
      `CREATE INDEX IF NOT EXISTS compensation_periods_by_staff_month
        ON compensation_periods(staff_profile_id, effective_start_month)`,
      `CREATE INDEX IF NOT EXISTS operating_expenses_by_start_month
        ON operating_expenses(effective_start_month, status)`,
    ],
  },
  {
    toVersion: 7,
    statements: [
      `ALTER TABLE inventory_purchases
        ADD COLUMN transaction_type TEXT NOT NULL DEFAULT 'received'
        CHECK (transaction_type IN ('received', 'reversal'))`,
      `CREATE INDEX IF NOT EXISTS inventory_purchases_by_correction
        ON inventory_purchases(correction_of_purchase_id, received_at DESC)`,
    ],
  },
  {
    toVersion: 8,
    statements: [
      `ALTER TABLE ingredients
        ADD COLUMN local_inventory_value_delta INTEGER NOT NULL DEFAULT 0`,
    ],
  },
  {
    toVersion: 9,
    statements: [
      `ALTER TABLE staff_profiles
        ADD COLUMN identity_revision INTEGER NOT NULL DEFAULT 0`,
      `CREATE INDEX IF NOT EXISTS staff_profiles_by_status
        ON staff_profiles(status, updated_at DESC)`,
    ],
  },
  {
    toVersion: 10,
    statements: [
      `ALTER TABLE compensation_periods RENAME TO compensation_periods_legacy`,
      `ALTER TABLE staff_profiles RENAME TO staff_profiles_legacy`,
      `CREATE TABLE staff_profiles (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'cashier')),
        status TEXT NOT NULL CHECK (status IN ('active', 'archived')),
        revision INTEGER NOT NULL CHECK (revision > 0),
        updated_at INTEGER NOT NULL,
        identity_revision INTEGER NOT NULL DEFAULT 0
      )`,
      `INSERT INTO staff_profiles
        SELECT id, name, CASE role WHEN 'worker' THEN 'cashier' ELSE role END,
          status, revision, updated_at, identity_revision
        FROM staff_profiles_legacy`,
      `CREATE TABLE compensation_periods (
        id TEXT PRIMARY KEY NOT NULL,
        staff_profile_id TEXT NOT NULL REFERENCES staff_profiles(id),
        monthly_amount_centimes INTEGER NOT NULL CHECK (monthly_amount_centimes >= 0),
        effective_start_month TEXT NOT NULL,
        effective_end_month TEXT,
        revision INTEGER NOT NULL CHECK (revision > 0),
        created_at INTEGER NOT NULL
      )`,
      `INSERT INTO compensation_periods SELECT * FROM compensation_periods_legacy`,
      `DROP TABLE compensation_periods_legacy`,
      `DROP TABLE staff_profiles_legacy`,
      `CREATE INDEX staff_profiles_by_status
        ON staff_profiles(status, updated_at DESC)`,
      `CREATE INDEX compensation_periods_by_staff_month
        ON compensation_periods(staff_profile_id, effective_start_month)`,
    ],
  },
  {
    toVersion: 11,
    statements: [
      `CREATE TABLE receipt_counters (
        period TEXT PRIMARY KEY NOT NULL,
        next_number INTEGER NOT NULL CHECK (next_number BETWEEN 1 AND 10000)
      )`,
    ],
  },
  {
    toVersion: 12,
    statements: [
      `CREATE TABLE sale_corrections (
        local_correction_id TEXT PRIMARY KEY NOT NULL,
        original_local_sale_id TEXT NOT NULL UNIQUE
          REFERENCES sales(local_sale_id),
        cloud_correction_id TEXT,
        device_id TEXT NOT NULL,
        reason TEXT NOT NULL,
        actor_name TEXT NOT NULL,
        business_date TEXT NOT NULL,
        corrected_at INTEGER NOT NULL,
        sync_state TEXT NOT NULL CHECK (sync_state IN ('pending', 'synced', 'failed'))
      )`,
      `CREATE INDEX sale_corrections_by_sync
        ON sale_corrections(sync_state, corrected_at)`,
    ],
  },
  {
    toVersion: 13,
    statements: [
      `ALTER TABLE outbox
        ADD COLUMN depends_on_operation_id TEXT`,
      `CREATE INDEX outbox_by_dependency
        ON outbox(depends_on_operation_id, state, available_at)`,
      `CREATE TABLE management_operations (
        operation_id TEXT PRIMARY KEY NOT NULL,
        device_id TEXT NOT NULL,
        operation_type TEXT NOT NULL,
        local_record_id TEXT NOT NULL,
        depends_on_operation_id TEXT,
        required_permission TEXT NOT NULL CHECK (
          required_permission IN (
            'products', 'stock', 'expenses', 'compensation', 'staff'
          )
        ),
        actor_profile_id TEXT NOT NULL,
        actor_name TEXT NOT NULL,
        actor_role TEXT NOT NULL CHECK (
          actor_role IN ('owner', 'manager', 'cashier')
        ),
        expected_revision INTEGER CHECK (expected_revision > 0),
        payload_json TEXT NOT NULL CHECK (
          length(payload_json) BETWEEN 2 AND 65536
        ),
        cloud_record_id TEXT,
        created_at INTEGER NOT NULL CHECK (created_at >= 0),
        acknowledged_at INTEGER CHECK (acknowledged_at >= 0)
      )`,
      `CREATE INDEX management_operations_by_record
        ON management_operations(operation_type, local_record_id, created_at)`,
      `CREATE INDEX management_operations_by_acknowledgement
        ON management_operations(acknowledged_at, created_at)`,
    ],
  },
  {
    toVersion: 14,
    statements: [
      `ALTER TABLE modifier_options
        ADD COLUMN key TEXT NOT NULL DEFAULT ''`,
      `UPDATE modifier_options SET key = id WHERE key = ''`,
      `CREATE TABLE local_cloud_mappings (
        record_type TEXT NOT NULL,
        local_record_id TEXT NOT NULL,
        cloud_record_id TEXT NOT NULL,
        acknowledged_at INTEGER NOT NULL CHECK (acknowledged_at >= 0),
        PRIMARY KEY (record_type, local_record_id),
        UNIQUE (record_type, cloud_record_id)
      )`,
      `CREATE INDEX local_cloud_mappings_by_cloud
        ON local_cloud_mappings(record_type, cloud_record_id)`,
    ],
  },
  {
    toVersion: 15,
    statements: [
      `ALTER TABLE products
        ADD COLUMN key TEXT NOT NULL DEFAULT ''`,
      `UPDATE products SET key = id WHERE key = ''`,
      `ALTER TABLE modifier_groups
        ADD COLUMN key TEXT NOT NULL DEFAULT ''`,
      `UPDATE modifier_groups SET key = id WHERE key = ''`,
      `ALTER TABLE modifier_groups
        ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0`,
    ],
  },
  {
    toVersion: 16,
    statements: [
      `ALTER TABLE ingredients
        ADD COLUMN key TEXT NOT NULL DEFAULT ''`,
      `UPDATE ingredients SET key = id WHERE key = ''`,
      `ALTER TABLE stock_movements
        ADD COLUMN client_mutation_id TEXT`,
      `CREATE UNIQUE INDEX stock_movements_by_client_mutation
        ON stock_movements(ingredient_id, client_mutation_id)
        WHERE client_mutation_id IS NOT NULL`,
      `ALTER TABLE inventory_purchases
        ADD COLUMN actor_label TEXT`,
      `ALTER TABLE compensation_periods
        ADD COLUMN updated_by TEXT`,
      `ALTER TABLE compensation_periods
        ADD COLUMN client_mutation_id TEXT`,
      `CREATE UNIQUE INDEX compensation_periods_by_client_mutation
        ON compensation_periods(client_mutation_id)
        WHERE client_mutation_id IS NOT NULL`,
      `ALTER TABLE operating_expenses
        ADD COLUMN transaction_type TEXT NOT NULL DEFAULT 'recorded'
        CHECK (transaction_type IN ('recorded', 'reversal'))`,
      `ALTER TABLE operating_expenses
        ADD COLUMN correction_of_expense_id TEXT
        REFERENCES operating_expenses(id)`,
      `ALTER TABLE operating_expenses
        ADD COLUMN updated_by TEXT`,
      `ALTER TABLE operating_expenses
        ADD COLUMN client_mutation_id TEXT`,
      `CREATE UNIQUE INDEX operating_expenses_by_client_mutation
        ON operating_expenses(client_mutation_id)
        WHERE client_mutation_id IS NOT NULL`,
      `CREATE INDEX operating_expenses_by_status_created_at
        ON operating_expenses(status, created_at DESC)`,
      `CREATE INDEX operating_expenses_by_correction
        ON operating_expenses(correction_of_expense_id, created_at DESC)`,
    ],
  },
  {
    toVersion: 17,
    statements: [
      `ALTER TABLE categories
        ADD COLUMN artwork_key TEXT NOT NULL DEFAULT 'neutral'`,
      `UPDATE categories SET artwork_key = CASE key
        WHEN 'coffee' THEN 'coffee'
        WHEN 'matcha-tea' THEN 'tea'
        WHEN 'cold-sweet' THEN 'cold-drinks'
        WHEN 'bakery-savoury' THEN 'bakery'
        ELSE 'neutral'
      END`,
    ],
  },
  {
    toVersion: 18,
    statements: [
      `ALTER TABLE sales ADD COLUMN actor_profile_id TEXT`,
      `ALTER TABLE sale_corrections ADD COLUMN actor_profile_id TEXT`,
    ],
  },
  {
    toVersion: 19,
    statements: [
      `ALTER TABLE sale_items
        ADD COLUMN category_id_snapshot TEXT NOT NULL DEFAULT ''`,
      `ALTER TABLE sale_items
        ADD COLUMN category_name_snapshot TEXT NOT NULL DEFAULT ''`,
      `UPDATE sale_items
       SET category_id_snapshot = COALESCE((
         SELECT product.category_id FROM products product
         WHERE product.id = sale_items.product_id
       ), ''),
       category_name_snapshot = COALESCE((
         SELECT category.name FROM products product
         JOIN categories category ON category.id = product.category_id
         WHERE product.id = sale_items.product_id
       ), '')`,
      `CREATE TABLE delete_19_recipe_items AS
       SELECT item.recipe_version_id, item.ingredient_id, item.quantity,
         COALESCE(ingredient.name, '') AS ingredient_name_snapshot,
         COALESCE(ingredient.base_unit, '') AS ingredient_base_unit_snapshot
       FROM recipe_items item
       LEFT JOIN ingredients ingredient ON ingredient.id = item.ingredient_id`,
      `DROP TABLE recipe_items`,
      `CREATE TABLE delete_19_recipe_versions (
        id TEXT PRIMARY KEY NOT NULL,
        product_id TEXT NOT NULL,
        product_name_snapshot TEXT NOT NULL DEFAULT '',
        version INTEGER NOT NULL CHECK (version > 0),
        is_active INTEGER NOT NULL CHECK (is_active IN (0, 1)),
        created_at INTEGER NOT NULL,
        UNIQUE (product_id, version)
      )`,
      `INSERT INTO delete_19_recipe_versions
        (id, product_id, product_name_snapshot, version, is_active, created_at)
       SELECT version.id, version.product_id, COALESCE(product.name, ''),
         version.version, version.is_active, version.created_at
       FROM recipe_versions version
       LEFT JOIN products product ON product.id = version.product_id`,
      `DROP TABLE recipe_versions`,
      `ALTER TABLE delete_19_recipe_versions RENAME TO recipe_versions`,
      `CREATE INDEX recipe_versions_by_product
        ON recipe_versions(product_id, is_active, version)`,
      `CREATE TABLE recipe_items (
        recipe_version_id TEXT NOT NULL
          REFERENCES recipe_versions(id) ON DELETE CASCADE,
        ingredient_id TEXT NOT NULL,
        ingredient_name_snapshot TEXT NOT NULL DEFAULT '',
        ingredient_base_unit_snapshot TEXT NOT NULL DEFAULT '',
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        PRIMARY KEY (recipe_version_id, ingredient_id)
      )`,
      `INSERT INTO recipe_items
        (recipe_version_id, ingredient_id, ingredient_name_snapshot,
         ingredient_base_unit_snapshot, quantity)
       SELECT recipe_version_id, ingredient_id, ingredient_name_snapshot,
         ingredient_base_unit_snapshot, quantity
       FROM delete_19_recipe_items`,
      `DROP TABLE delete_19_recipe_items`,
      `CREATE INDEX recipe_items_by_ingredient ON recipe_items(ingredient_id)`,
      `CREATE TABLE delete_19_product_links AS
        SELECT product_id, modifier_group_id, sort_order
        FROM product_modifier_groups`,
      `DELETE FROM product_modifier_groups`,
      `CREATE TABLE delete_19_products (
        id TEXT PRIMARY KEY NOT NULL,
        category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
        name TEXT NOT NULL,
        receipt_name TEXT NOT NULL,
        price_centimes INTEGER NOT NULL CHECK (price_centimes >= 0),
        status TEXT NOT NULL CHECK (
          status IN ('active', 'unavailable', 'archived')
        ),
        image_asset_key TEXT,
        sort_order INTEGER NOT NULL,
        current_recipe_version_id TEXT,
        revision INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        key TEXT NOT NULL DEFAULT ''
      )`,
      `INSERT INTO delete_19_products
        (id, category_id, name, receipt_name, price_centimes, status,
         image_asset_key, sort_order, current_recipe_version_id, revision,
         updated_at, key)
       SELECT id, category_id, name, receipt_name, price_centimes, status,
         image_asset_key, sort_order, current_recipe_version_id, revision,
         updated_at, key
       FROM products`,
      `DROP TABLE products`,
      `ALTER TABLE delete_19_products RENAME TO products`,
      `CREATE INDEX products_by_category
        ON products(category_id, status, sort_order)`,
      `INSERT INTO product_modifier_groups
        (product_id, modifier_group_id, sort_order)
       SELECT product_id, modifier_group_id, sort_order
       FROM delete_19_product_links`,
      `DROP TABLE delete_19_product_links`,
      `CREATE TABLE delete_19_inventory_purchases AS
       SELECT purchase.*,
         COALESCE(ingredient.name, '') AS ingredient_name_snapshot,
         COALESCE(ingredient.base_unit, '') AS ingredient_base_unit_snapshot
       FROM inventory_purchases purchase
       LEFT JOIN ingredients ingredient ON ingredient.id = purchase.ingredient_id`,
      `DROP TABLE inventory_purchases`,
      `CREATE TABLE delete_19_stock_movements (
        id TEXT PRIMARY KEY NOT NULL,
        ingredient_id TEXT NOT NULL,
        ingredient_name_snapshot TEXT NOT NULL DEFAULT '',
        ingredient_base_unit_snapshot TEXT NOT NULL DEFAULT '',
        local_sale_id TEXT REFERENCES sales(local_sale_id),
        quantity_delta INTEGER NOT NULL CHECK (quantity_delta <> 0),
        movement_type TEXT NOT NULL,
        reason TEXT NOT NULL,
        actor_label TEXT,
        business_date TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        cost_delta_centimes INTEGER,
        inventory_value_after_centimes INTEGER
          CHECK (inventory_value_after_centimes >= 0),
        valuation_revision INTEGER CHECK (valuation_revision >= 0),
        client_mutation_id TEXT
      )`,
      `INSERT INTO delete_19_stock_movements
        (id, ingredient_id, ingredient_name_snapshot,
         ingredient_base_unit_snapshot, local_sale_id, quantity_delta,
         movement_type, reason, actor_label, business_date, created_at,
         cost_delta_centimes, inventory_value_after_centimes,
         valuation_revision, client_mutation_id)
       SELECT movement.id, movement.ingredient_id,
         COALESCE(ingredient.name, ''), COALESCE(ingredient.base_unit, ''),
         movement.local_sale_id, movement.quantity_delta,
         movement.movement_type, movement.reason, movement.actor_label,
         movement.business_date, movement.created_at,
         movement.cost_delta_centimes, movement.inventory_value_after_centimes,
         movement.valuation_revision, movement.client_mutation_id
       FROM stock_movements movement
       LEFT JOIN ingredients ingredient ON ingredient.id = movement.ingredient_id`,
      `DROP TABLE stock_movements`,
      `ALTER TABLE delete_19_stock_movements RENAME TO stock_movements`,
      `CREATE INDEX stock_movements_by_ingredient
        ON stock_movements(ingredient_id, created_at DESC)`,
      `CREATE UNIQUE INDEX stock_movements_by_client_mutation
        ON stock_movements(ingredient_id, client_mutation_id)
        WHERE client_mutation_id IS NOT NULL`,
      `CREATE TABLE inventory_purchases (
        id TEXT PRIMARY KEY NOT NULL,
        ingredient_id TEXT NOT NULL,
        ingredient_name_snapshot TEXT NOT NULL DEFAULT '',
        ingredient_base_unit_snapshot TEXT NOT NULL DEFAULT '',
        stock_movement_id TEXT NOT NULL REFERENCES stock_movements(id),
        package_label TEXT NOT NULL,
        package_count INTEGER NOT NULL CHECK (package_count > 0),
        quantity_per_package INTEGER NOT NULL CHECK (quantity_per_package > 0),
        total_quantity INTEGER NOT NULL CHECK (total_quantity > 0),
        package_price_centimes INTEGER NOT NULL CHECK (package_price_centimes >= 0),
        total_cost_centimes INTEGER NOT NULL CHECK (total_cost_centimes >= 0),
        received_at INTEGER NOT NULL,
        business_date TEXT NOT NULL,
        supplier_label TEXT,
        note TEXT,
        correction_of_purchase_id TEXT REFERENCES inventory_purchases(id),
        revision INTEGER NOT NULL CHECK (revision > 0),
        client_mutation_id TEXT NOT NULL UNIQUE,
        transaction_type TEXT NOT NULL DEFAULT 'received'
          CHECK (transaction_type IN ('received', 'reversal')),
        actor_label TEXT
      )`,
      `INSERT INTO inventory_purchases
        (id, ingredient_id, ingredient_name_snapshot,
         ingredient_base_unit_snapshot, stock_movement_id, package_label,
         package_count, quantity_per_package, total_quantity,
         package_price_centimes, total_cost_centimes, received_at,
         business_date, supplier_label, note, correction_of_purchase_id,
         revision, client_mutation_id, transaction_type, actor_label)
       SELECT purchase.id, purchase.ingredient_id,
         purchase.ingredient_name_snapshot,
         purchase.ingredient_base_unit_snapshot,
         purchase.stock_movement_id, purchase.package_label,
         purchase.package_count, purchase.quantity_per_package,
         purchase.total_quantity, purchase.package_price_centimes,
         purchase.total_cost_centimes, purchase.received_at,
         purchase.business_date, purchase.supplier_label, purchase.note,
         purchase.correction_of_purchase_id, purchase.revision,
         purchase.client_mutation_id, purchase.transaction_type,
         purchase.actor_label
       FROM delete_19_inventory_purchases purchase`,
      `DROP TABLE delete_19_inventory_purchases`,
      `CREATE INDEX inventory_purchases_by_ingredient_date
        ON inventory_purchases(ingredient_id, received_at DESC)`,
      `CREATE INDEX inventory_purchases_by_business_date
        ON inventory_purchases(business_date, received_at DESC)`,
      `CREATE INDEX inventory_purchases_by_correction
        ON inventory_purchases(correction_of_purchase_id, received_at DESC)`,
      `CREATE TABLE delete_19_compensation_periods (
        id TEXT PRIMARY KEY NOT NULL,
        staff_profile_id TEXT NOT NULL,
        staff_name_snapshot TEXT NOT NULL DEFAULT '',
        staff_role_snapshot TEXT NOT NULL DEFAULT '',
        monthly_amount_centimes INTEGER NOT NULL
          CHECK (monthly_amount_centimes >= 0),
        effective_start_month TEXT NOT NULL,
        effective_end_month TEXT,
        revision INTEGER NOT NULL CHECK (revision > 0),
        created_at INTEGER NOT NULL,
        updated_by TEXT,
        client_mutation_id TEXT
      )`,
      `INSERT INTO delete_19_compensation_periods
        (id, staff_profile_id, staff_name_snapshot, staff_role_snapshot,
         monthly_amount_centimes, effective_start_month, effective_end_month,
         revision, created_at, updated_by, client_mutation_id)
       SELECT period.id, period.staff_profile_id, COALESCE(staff.name, ''),
         COALESCE(staff.role, ''), period.monthly_amount_centimes,
         period.effective_start_month, period.effective_end_month,
         period.revision, period.created_at, period.updated_by,
         period.client_mutation_id
       FROM compensation_periods period
       LEFT JOIN staff_profiles staff ON staff.id = period.staff_profile_id`,
      `DROP TABLE compensation_periods`,
      `ALTER TABLE delete_19_compensation_periods RENAME TO compensation_periods`,
      `CREATE INDEX compensation_periods_by_staff_month
        ON compensation_periods(staff_profile_id, effective_start_month)`,
      `CREATE UNIQUE INDEX compensation_periods_by_client_mutation
        ON compensation_periods(client_mutation_id)
        WHERE client_mutation_id IS NOT NULL`,
    ],
  },
] as const;

export const LOCAL_SCHEMA_VERSION =
  localMigrations[localMigrations.length - 1].toVersion;
