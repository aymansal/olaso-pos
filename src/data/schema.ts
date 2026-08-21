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
] as const;

export const LOCAL_SCHEMA_VERSION =
  localMigrations[localMigrations.length - 1].toVersion;
