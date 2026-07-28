import { useEffect, useMemo, useRef, useState } from 'react';
import { useProductManagement } from '../../data/useProductManagement';
import { Header } from '../pos/components/Header/Header';
import type { NavigationPage } from '../pos/components/TopNavigation/TopNavigation';
import { CategoryDialog } from './components/CategoryDialog/CategoryDialog';
import { ProductCatalogPanel } from './components/ProductCatalogPanel/ProductCatalogPanel';
import { ProductEditorPanel } from './components/ProductEditorPanel/ProductEditorPanel';
import type {
  ManagedCategory,
  ManagedModifierGroup,
  ManagedProduct,
  ProductSaveInput,
} from './productManagementTypes';
import styles from './ProductsScreen.module.css';

interface ProductsScreenProps {
  onNavigate?: (page: NavigationPage) => void;
  onOpenSettings?: () => void;
}

type AvailabilityFilter = 'all' | ManagedProduct['status'];
type ProductSort = 'updated' | 'name' | 'price';

export function ProductsScreen({
  onNavigate,
  onOpenSettings,
}: ProductsScreenProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [selectedProductId, setSelectedProductId] = useState<string>();
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState('');
  const [availability, setAvailability] =
    useState<AvailabilityFilter>('all');
  const [sort, setSort] = useState<ProductSort>('updated');
  const [categoryEditor, setCategoryEditor] =
    useState<'new' | ManagedCategory>();
  const initialized = useRef(false);
  const management = useProductManagement(
    creating ? undefined : selectedProductId,
  );

  useEffect(() => {
    if (initialized.current || management.isLoading || management.error) return;
    const preferredCategory =
      management.categories.find(
        (category) => category.key === 'matcha-tea',
      ) ?? management.categories.find((category) => category.status === 'active');
    const preferredProduct = management.products.find(
      (product) => product.categoryId === preferredCategory?.id,
    );
    setSelectedCategoryId(preferredCategory?.id ?? 'all');
    setSelectedProductId(preferredProduct?.id ?? management.products[0]?.id);
    initialized.current = true;
  }, [
    management.categories,
    management.error,
    management.isLoading,
    management.products,
  ]);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    const next = management.products.filter(
      (product) =>
        (selectedCategoryId === 'all' ||
          product.categoryId === selectedCategoryId) &&
        (availability === 'all' || product.status === availability) &&
        (!normalizedSearch ||
          product.name.toLocaleLowerCase().includes(normalizedSearch) ||
          product.key.toLocaleLowerCase().includes(normalizedSearch)),
    );
    return [...next].sort((left, right) => {
      if (sort === 'name') return left.name.localeCompare(right.name);
      if (sort === 'price') {
        return left.basePriceCentimes - right.basePriceCentimes;
      }
      return right.updatedAt - left.updatedAt;
    });
  }, [
    availability,
    management.products,
    search,
    selectedCategoryId,
    sort,
  ]);

  const selectedProduct = management.products.find(
    (product) => product.id === selectedProductId,
  );
  const selectedCategory = management.categories.find(
    (category) => category.id === selectedCategoryId,
  );
  const now = new Date();

  async function saveCategory(name: string) {
    const result = await management.saveCategory(
      categoryEditor === 'new'
        ? {
            name,
            sortOrder:
              Math.max(
                0,
                ...management.categories.map((item) => item.sortOrder),
              ) + 10,
          }
        : {
            id: categoryEditor?.id,
            name,
            sortOrder: categoryEditor?.sortOrder ?? 0,
            expectedRevision: categoryEditor?.revision,
          },
    );
    setSelectedCategoryId(result.id);
    if (categoryEditor === 'new') setSelectedProductId(undefined);
  }

  async function setCategoryArchived() {
    if (!selectedCategory) return;
    try {
      await management.setCategoryArchived(
        selectedCategory.id,
        selectedCategory.status !== 'archived',
        selectedCategory.revision,
      );
    } catch (caught) {
      window.alert(
        caught instanceof Error ? caught.message : 'Category status failed.',
      );
    }
  }

  async function saveProduct(input: ProductSaveInput) {
    const result = await management.saveProduct(input);
    setCreating(false);
    setSelectedProductId(result.id);
    setSelectedCategoryId(input.categoryId);
  }

  async function setProductStatus(
    product: ManagedProduct,
    status: ManagedProduct['status'],
  ) {
    await management.setProductStatus(product.id, status, product.revision);
  }

  async function saveModifierGroup(group: ManagedModifierGroup) {
    await management.saveModifierGroup(group);
  }

  return (
    <main className={styles.screen} aria-label="Olaso products">
      <Header
        activePage="Products"
        brand="olaso"
        onOpenSettings={onOpenSettings}
        dateLabel={new Intl.DateTimeFormat('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        }).format(now)}
        dateTime={now.toISOString().slice(0, 10)}
        onNavigate={onNavigate}
      />
      <ProductCatalogPanel
        categories={management.categories}
        products={visibleProducts}
        selectedCategoryId={selectedCategoryId}
        selectedProductId={selectedProductId}
        search={search}
        availability={availability}
        sort={sort}
        isLoading={management.isLoading}
        error={management.error}
        onSearchChange={setSearch}
        onAvailabilityChange={setAvailability}
        onSortChange={setSort}
        onSelectCategory={(categoryId) => {
          setCreating(false);
          setSelectedCategoryId(categoryId);
          const first = management.products.find(
            (product) =>
              categoryId === 'all' || product.categoryId === categoryId,
          );
          setSelectedProductId(first?.id);
        }}
        onSelectProduct={(productId) => {
          setCreating(false);
          setSelectedProductId(productId);
        }}
        onAddCategory={() => setCategoryEditor('new')}
        onRenameCategory={() =>
          selectedCategory && setCategoryEditor(selectedCategory)
        }
        onSetCategoryArchived={setCategoryArchived}
        onAddProduct={() => {
          setCreating(true);
          setSelectedProductId(undefined);
        }}
      />
      <ProductEditorPanel
        product={selectedProduct}
        creating={creating}
        defaultCategoryId={
          selectedCategory?.status === 'active' ? selectedCategory.id : undefined
        }
        nextSortOrder={
          Math.max(0, ...management.products.map((item) => item.sortOrder)) + 10
        }
        categories={management.categories}
        modifierGroups={management.modifierGroups}
        ingredients={management.ingredients}
        recipeData={management.recipeData}
        isRecipeLoading={management.isRecipeLoading}
        onSave={saveProduct}
        onSetStatus={setProductStatus}
        onSaveModifierGroup={saveModifierGroup}
        onSetModifierGroupArchived={async (group, archived) => {
          if (!group.id || group.revision === undefined) return;
          await management.setModifierGroupArchived(
            group.id,
            archived,
            group.revision,
          );
        }}
        onSaveRecipe={async (product, items) => {
          await management.saveRecipeVersion(product, items);
        }}
      />
      {categoryEditor ? (
        <CategoryDialog
          category={categoryEditor === 'new' ? undefined : categoryEditor}
          onClose={() => setCategoryEditor(undefined)}
          onSave={saveCategory}
        />
      ) : null}
    </main>
  );
}
