import { useEffect, useMemo, useRef, useState } from 'react';
import { useProductManagement } from '../../data/useProductManagement';
import { CategoryDialog } from './components/CategoryDialog/CategoryDialog';
import { ProductCatalogPanel } from './components/ProductCatalogPanel/ProductCatalogPanel';
import { ProductDialog } from './components/ProductDialog/ProductDialog';
import { ProductEditorPanel } from './components/ProductEditorPanel/ProductEditorPanel';
import type {
  ManagedCategory,
  ManagedProduct,
  ProductSaveInput,
} from './productManagementTypes';
import styles from './ProductsScreen.module.css';

type AvailabilityFilter = 'all' | ManagedProduct['status'];
type ProductSort = 'updated' | 'name' | 'price';

export function ProductsScreen() {
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [selectedProductId, setSelectedProductId] = useState<string>();
  const [search, setSearch] = useState('');
  const [availability, setAvailability] =
    useState<AvailabilityFilter>('all');
  const [sort, setSort] = useState<ProductSort>('updated');
  const [categoryEditor, setCategoryEditor] =
    useState<'new' | ManagedCategory>();
  const [productEditor, setProductEditor] = useState<'new'>();
  const initialized = useRef(false);
  const management = useProductManagement(selectedProductId);

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
        (availability === 'all'
          ? product.status !== 'archived'
          : product.status === availability) &&
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
  const visibleCategories = useMemo(
    () => availability === 'archived'
      ? management.categories
      : management.categories.filter(
          (category) => category.status !== 'archived',
        ),
    [availability, management.categories],
  );

  const selectedProduct = management.products.find(
    (product) => product.id === selectedProductId,
  );
  const selectedCategory = management.categories.find(
    (category) => category.id === selectedCategoryId,
  );
  async function saveCategory(name: string, artworkKey: string) {
    const result = await management.saveCategory(
      categoryEditor === 'new'
        ? {
            name,
            artworkKey,
            sortOrder:
              Math.max(
                0,
                ...management.categories.map((item) => item.sortOrder),
              ) + 10,
          }
        : {
            id: categoryEditor?.id,
            name,
            artworkKey,
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
    setSelectedProductId(result.id);
    setSelectedCategoryId(input.categoryId || 'all');
  }

  async function setProductStatus(
    product: ManagedProduct,
    status: ManagedProduct['status'],
  ) {
    await management.setProductStatus(product.id, status, product.revision);
  }

  return (
    <main className={styles.screen} aria-label="Olaso products">
      <ProductCatalogPanel
        categories={visibleCategories}
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
          setSelectedCategoryId(categoryId);
          const first = management.products.find(
            (product) =>
              categoryId === 'all' || product.categoryId === categoryId,
          );
          setSelectedProductId(first?.id);
        }}
        onSelectProduct={setSelectedProductId}
        onAddCategory={() => setCategoryEditor('new')}
        onRenameCategory={() =>
          selectedCategory && setCategoryEditor(selectedCategory)
        }
        onSetCategoryArchived={setCategoryArchived}
        onDeleteCategory={async () => {
          if (!selectedCategory || !window.confirm(
            `Delete ${selectedCategory.name}? Its products will remain uncategorized.`,
          )) return;
          try {
            await management.deleteCategory(selectedCategory);
            setSelectedCategoryId('all');
          } catch (caught) {
            window.alert(caught instanceof Error
              ? caught.message
              : 'Category could not be deleted.');
          }
        }}
        onAddProduct={() => setProductEditor('new')}
      />
      <ProductEditorPanel
        product={selectedProduct}
        defaultCategoryId={
          selectedCategory?.status === 'active' ? selectedCategory.id : undefined
        }
        nextSortOrder={
          Math.max(0, ...management.products.map((item) => item.sortOrder)) + 10
        }
        categories={management.categories}
        ingredients={management.ingredients}
        productSizes={management.productSizes}
        choiceSections={management.choiceSections}
        products={management.products}
        recipeData={management.recipeData}
        productCost={management.productCost}
        isRecipeLoading={management.isRecipeLoading}
        onSave={saveProduct}
        onSetStatus={setProductStatus}
        onDelete={async (product) => {
          await management.deleteProduct(product);
          setSelectedProductId(undefined);
        }}
        onSaveRecipe={async (product, items, sizeQuantities) => {
          await management.saveRecipeVersion(product, items, sizeQuantities);
        }}
        onSaveSize={management.saveProductSize}
        onDeleteSize={management.deleteProductSize}
        onSaveChoiceSection={management.saveChoiceSection}
        onDeleteChoiceSection={management.deleteChoiceSection}
        onCopyChoiceSections={management.copyChoiceSections}
      />
      {productEditor ? (
        <ProductDialog
          categories={management.categories}
          defaultCategoryId={
            selectedCategory?.status === 'active' ? selectedCategory.id : undefined
          }
          nextSortOrder={
            Math.max(0, ...management.products.map((item) => item.sortOrder)) + 10
          }
          onClose={() => setProductEditor(undefined)}
          onSave={saveProduct}
        />
      ) : null}
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
