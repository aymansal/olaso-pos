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

const PAGE_SIZE = 6;
const UNCATEGORIZED_ID = 'uncategorized';

function productInCategory(product: ManagedProduct, categoryId: string) {
  if (categoryId === 'all') return true;
  if (categoryId === UNCATEGORIZED_ID) return !product.categoryId;
  return product.categoryId === categoryId;
}

export function ProductsScreen() {
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [selectedProductId, setSelectedProductId] = useState<string>();
  const [search, setSearch] = useState('');
  const [availability, setAvailability] =
    useState<AvailabilityFilter>('all');
  const [sort, setSort] = useState<ProductSort>('updated');
  const [page, setPage] = useState(0);
  const [categoryEditor, setCategoryEditor] =
    useState<'new' | ManagedCategory>();
  const [productEditor, setProductEditor] = useState<'new'>();
  const management = useProductManagement(selectedProductId);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    const next = management.products.filter(
      (product) =>
        productInCategory(product, selectedCategoryId) &&
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

  const filterKey = `${availability}\u0000${search}\u0000${selectedCategoryId}\u0000${sort}`;
  const previousFilters = useRef(filterKey);
  useEffect(() => {
    if (previousFilters.current === filterKey) return;
    previousFilters.current = filterKey;
    setPage(0);
  }, [filterKey]);

  useEffect(() => {
    if (management.isLoading || management.error || selectedProductId) return;
    setSelectedProductId(visibleProducts[0]?.id);
  }, [
    management.error,
    management.isLoading,
    selectedProductId,
    visibleProducts,
  ]);

  const pageCount = management.isLoading
    ? 0
    : Math.max(1, Math.ceil(visibleProducts.length / PAGE_SIZE));
  const safePage = pageCount === 0 ? 0 : Math.min(page, pageCount - 1);
  const pageProducts = visibleProducts.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE,
  );

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
    setSelectedCategoryId(input.categoryId || UNCATEGORIZED_ID);
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
        uncategorizedCount={management.products.filter((product) => !product.categoryId).length}
        totalProducts={management.products.length}
        products={pageProducts}
        selectedCategoryId={selectedCategoryId}
        selectedProductId={selectedProductId}
        search={search}
        availability={availability}
        sort={sort}
        isLoading={management.isLoading}
        error={management.error}
        page={safePage}
        pageCount={pageCount}
        totalItems={visibleProducts.length}
        onSearchChange={setSearch}
        onAvailabilityChange={setAvailability}
        onSortChange={setSort}
        onSelectCategory={(categoryId) => {
          setSelectedCategoryId(categoryId);
          const first = management.products.find((product) =>
            productInCategory(product, categoryId),
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
        onPageChange={setPage}
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
