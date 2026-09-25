import { useMemo, useState } from 'react';
import { useProductManagement } from '../../data/useProductManagement';
import { useT } from '../../lib/locale';
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

type AvailabilityFilter = 'all' | 'active' | 'unavailable';
type ProductSort = 'updated' | 'name' | 'price';

const PAGE_SIZE = 7;
const UNCATEGORIZED_ID = 'uncategorized';

function productInCategory(product: ManagedProduct, categoryId: string) {
  if (categoryId === 'all') return true;
  if (categoryId === UNCATEGORIZED_ID) return !product.categoryId;
  return product.categoryId === categoryId;
}

/**
 * The product the list highlight and the editor must agree on for one displayed page.
 *
 * A real category change always lands on the destination page's first row, even when the
 * previously selected product also appears in that destination, because the raw
 * management.products order must never decide what is highlighted. Within an unchanged category
 * the current selection is kept while it is on the displayed page, otherwise the page's first
 * row is taken; an empty page returns undefined so the editor shows its existing empty state.
 */
export function resolvePageSelection(
  pageProducts: ManagedProduct[],
  selectedProductId?: string,
  categoryChanged = false,
) {
  if (categoryChanged) return pageProducts[0]?.id;
  return pageProducts.some((product) => product.id === selectedProductId)
    ? selectedProductId
    : pageProducts[0]?.id;
}

export function ProductsScreen() {
  const t = useT();
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

  // Category, search, availability and sort changes return to the first page. This reset and
  // the selection correction below are adjusted during render (React's documented
  // "storing information from previous renders" pattern) rather than in an Effect, because an
  // Effect commits and paints one frame with the stale page and an off-page selection first.
  const filterKey = `${availability}\u0000${search}\u0000${selectedCategoryId}\u0000${sort}`;
  const [appliedFilterKey, setAppliedFilterKey] = useState(filterKey);
  const filtersChanged = appliedFilterKey !== filterKey;
  if (filtersChanged) {
    setAppliedFilterKey(filterKey);
    setPage(0);
  }

  // A real category change (a sidebar click, or a programmatic move after create or delete) is
  // tracked separately from the other filters so the selection rule below can restart from the
  // destination's first row instead of carrying the previous category's selection across.
  const [appliedCategoryId, setAppliedCategoryId] = useState(selectedCategoryId);
  const categoryChanged = appliedCategoryId !== selectedCategoryId;
  if (categoryChanged) setAppliedCategoryId(selectedCategoryId);

  const pageCount = management.isLoading
    ? 0
    : Math.max(1, Math.ceil(visibleProducts.length / PAGE_SIZE));
  const requestedPage = filtersChanged ? 0 : page;
  const safePage = pageCount === 0 ? 0 : Math.min(requestedPage, pageCount - 1);
  const pageProducts = visibleProducts.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE,
  );

  // Keep the highlighted row, the selection and the editor synchronized. A category change
  // starts from the destination page's first row; every other filter or page change retains the
  // selection while it stays on the displayed page. See resolvePageSelection above.
  const pageSelection = resolvePageSelection(
    pageProducts,
    selectedProductId,
    categoryChanged,
  );
  if (
    !management.isLoading &&
    !management.error &&
    pageSelection !== selectedProductId
  ) {
    setSelectedProductId(pageSelection);
  }

  const visibleCategories = useMemo(
    () => management.categories,
    [management.categories],
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

  async function saveProduct(input: ProductSaveInput) {
    const result = await management.saveProduct(input);
    const destination = input.categoryId || UNCATEGORIZED_ID;
    setSelectedProductId(result.id);
    setSelectedCategoryId(destination);
    // A save deliberately selects the product it just wrote, so moving it to another category
    // must not be treated as a navigation to that category's first row.
    setAppliedCategoryId(destination);
  }

  return (
    <main className={styles.screen} data-products-palette aria-label={t('Atelika products')}>
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
        onSelectCategory={setSelectedCategoryId}
        onSelectProduct={setSelectedProductId}
        onAddCategory={() => setCategoryEditor('new')}
        onRenameCategory={() =>
          selectedCategory && setCategoryEditor(selectedCategory)
        }
        onDeleteCategory={async () => {
          if (!selectedCategory || !window.confirm(
            t('Delete {name}? Its products will remain uncategorized.', {
              name: selectedCategory.name,
            }),
          )) return;
          try {
            await management.deleteCategory(selectedCategory);
            setSelectedCategoryId('all');
          } catch (caught) {
            window.alert(caught instanceof Error
              ? t(caught.message)
              : t('Category could not be deleted.'));
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
