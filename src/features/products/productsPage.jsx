import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Grid,
  GridItem,
  IconBattery,
  IconCamera,
  IconEdit,
  IconHeadphones,
  IconKeyboard,
  IconLaptop,
  IconPackage,
  IconPlus,
  IconSmartphone,
  IconSpeaker,
  IconTablet,
  IconTv,
  IconZap,
  Select,
  Stack,
  useToast,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useListState } from "../../hooks/useListState";
import { useCollection } from "../../app/dataContext";
import { PageHeader } from "../../components/pageHeader";
import { ConfirmButton } from "../../components/confirmButton";
import { ListToolbar } from "../../components/listToolbar";
import {
  ListEmptyState,
  ListPagination,
  listTitle,
} from "../../components/listResults";
import { UndoBar, useUndoable } from "../../components/undoBar";
import { ProductFormModal } from "./components/productFormModal";
import { formatCurrency } from "../../utils/format";
import { withNote } from "../../components/titleNote";
import { CATEGORY_OPTIONS, STOCK_STATUS } from "./data/mock";
import "./products.css";

const ICONS = {
  laptop: IconLaptop,
  headphones: IconHeadphones,
  smartphone: IconSmartphone,
  tv: IconTv,
  speaker: IconSpeaker,
  tablet: IconTablet,
  camera: IconCamera,
  keyboard: IconKeyboard,
  battery: IconBattery,
  zap: IconZap,
};

/**
 * Per-category accent for the product icon tile. Mapped to the theme's own
 * palette variables so the tiles follow the brand colour and the dark theme
 * instead of being frozen to a hardcoded hex.
 */
const CATEGORY_ACCENTS = {
  Electronics: "var(--naytak-primary, #2563eb)",
  Audio: "var(--naytak-accent-violet)",
  Accessories: "var(--naytak-info)",
  Home: "var(--naytak-warning)",
};

/** Sort options presented to the user, mapped onto record fields. */
const SORT_OPTIONS = [
  { label: "Name (A–Z)", value: "name:asc" },
  { label: "Name (Z–A)", value: "name:desc" },
  { label: "Price (low to high)", value: "price:asc" },
  { label: "Price (high to low)", value: "price:desc" },
  { label: "Stock (low to high)", value: "stock:asc" },
  { label: "Stock (high to low)", value: "stock:desc" },
];

/** Stable list config — useListState memoizes on these identities. */
const SEARCH_KEYS = ["name", "category"];
const FILTERS = { category: (product, value) => product.category === value };

export function ProductsPage() {
  useDocumentTitle("Products");
  const toast = useToast();
  const products = useCollection("products");
  const undo = useUndoable();

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const list = useListState({
    items: products.items,
    searchKeys: SEARCH_KEYS,
    filters: FILTERS,
    defaultSort: "name",
    pageSize: 9,
  });

  const handleDelete = (product) => {
    const index = products.items.findIndex((item) => item.id === product.id);
    products.remove(product.id);
    undo.offer(`“${product.name}” deleted`, () =>
      products.restore(product, index),
    );
  };

  const openAdd = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleSave = (data) => {
    let saved;
    if (editingProduct) {
      products.update(editingProduct.id, data);
      saved = { ...editingProduct, ...data };
      toast.success("Product updated");
    } else {
      saved = products.add(data);
      toast.success("Product added");
    }
    // Bring the saved record into view — otherwise the active sort and
    // filters can leave it on a page the user is not looking at.
    list.revealItem(saved);
    setFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title={withNote("Products", "Manage your product catalog")}
          actions={
            <Button
              size="sm"
              leftIcon={<IconPlus size={16} />}
              onClick={openAdd}>
              Add product
            </Button>
          }
        />
      </GridItem>

      <GridItem xs={12} spacing={2} className="mb-3">
        <Card title={listTitle("All products", list)}>
          <ListToolbar
            list={list}
            searchPlaceholder="Search products…"
            filters={[
              {
                name: "category",
                label: "Category",
                options: CATEGORY_OPTIONS,
              },
            ]}>
            {/* A card grid has no column headers to click, so sorting gets
                its own control here. */}
            <Select
              aria-label="Sort products"
              options={SORT_OPTIONS}
              value={`${list.sortKey}:${list.sortDir}`}
              onChange={(event) => {
                const [field, direction] = event.target.value.split(":");
                list.setSort(field, direction);
              }}
            />
          </ListToolbar>
        </Card>
      </GridItem>

      {list.visible.length > 0 ? (
        <>
          <Grid container fluid>
            {list.visible.map((product) => {
              const Icon = ICONS[product.icon] ?? IconPackage;
              const stock =
                STOCK_STATUS[product.status] ?? STOCK_STATUS.in_stock;
              const accent =
                CATEGORY_ACCENTS[product.category] ??
                "var(--naytak-primary, #2563eb)";
              return (
                <GridItem
                  key={product.id}
                  xs={12}
                  sm={6}
                  lg={4}
                  spacing={2}
                  className="mb-2">
                  <Card className="h-100 product-card">
                    <Stack direction="row" spacing={14}>
                      <div
                        className="product-card__icon"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
                          color: accent,
                        }}>
                        <Icon size={24} />
                      </div>
                      <div className="product-card__body">
                        <h3 className="product-card__name">{product.name}</h3>
                        <div className="product-card__category">
                          {product.category}
                        </div>
                        <div className="product-card__price">
                          {formatCurrency(product.price)}
                        </div>
                        <Stack direction="row" spacing={8} align="center">
                          <Badge color={stock.color}>{stock.label}</Badge>
                          <span className="product-card__stock">
                            {product.stock} units
                          </span>
                        </Stack>
                        <Stack
                          direction="row"
                          spacing={4}
                          className="product-card__footer">
                          <Button
                            size="sm"
                            variant="ghost"
                            leftIcon={<IconEdit size={16} />}
                            onClick={() => openEdit(product)}>
                            Edit
                          </Button>
                          <ConfirmButton
                            size="sm"
                            label="Delete"
                            title="Delete product?"
                            message={`"${product.name}" will be removed from the catalog.`}
                            onConfirm={() => handleDelete(product)}
                          />
                        </Stack>
                      </div>
                    </Stack>
                  </Card>
                </GridItem>
              );
            })}
          </Grid>

          <GridItem xs={12} spacing={2}>
            <ListPagination list={list} noun="product" />
          </GridItem>
        </>
      ) : (
        <GridItem xs={12} spacing={2}>
          <ListEmptyState
            list={list}
            noun="product"
            icon={<IconPackage size={28} />}
            onCreate={openAdd}
            createLabel="Add product"
          />
        </GridItem>
      )}

      {/* Rendered only while open so the form starts clean each time. */}
      {formOpen && (
        <ProductFormModal
          open
          product={editingProduct}
          onClose={() => {
            setFormOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSave}
        />
      )}

      <UndoBar undo={undo} />
    </Grid>
  );
}
