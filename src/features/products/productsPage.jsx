import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
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
  SearchInput,
  Select,
  Stack,
  useToast,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { PageHeader } from "../../components/pageHeader";
import { ConfirmButton } from "../../components/confirmButton";
import { ProductFormModal } from "./components/productFormModal";
import { formatCurrency } from "../../utils/format";
import { CATEGORY_OPTIONS, PRODUCTS, STOCK_STATUS } from "./data/mock";
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

// Per-category accent colors for the product icon tile.
const CATEGORY_COLORS = {
  Electronics: "#2563eb",
  Audio: "#8b5cf6",
  Accessories: "#0ea5e9",
  Home: "#f59e0b",
};

export function ProductsPage() {
  useDocumentTitle("Products");
  const toast = useToast();

  const [products, setProducts] = useState(PRODUCTS);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery = !q || product.name.toLowerCase().includes(q);
      const matchesCategory =
        category === "all" || product.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    toast.success("Product removed");
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
    if (editingProduct) {
      // Overwrite the existing product that shares the same id.
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id ? { ...product, ...data } : product,
        ),
      );
      toast.success("Product updated");
    } else {
      // Append a new row to the product list.
      const newProduct = { ...data, id: Date.now() };
      setProducts((prev) => [newProduct, ...prev]);
      toast.success("Product added");
    }
    setCategory("all");
    setFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title="Products"
          subtitle="Manage your product catalog"
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
        <Stack direction="row" spacing={8} wrap className="list-toolbar">
          <SearchInput
            placeholder="Search products…"
            clearable
            value={query}
            onChange={setQuery}
          />
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={CATEGORY_OPTIONS}
          />
        </Stack>
      </GridItem>

      {filtered.length > 0 ? (
        <Grid container fluid>
          {filtered.map((product) => {
            const Icon = ICONS[product.icon] ?? IconPackage;
            const stock = STOCK_STATUS[product.status] ?? STOCK_STATUS.in_stock;
            const color = CATEGORY_COLORS[product.category] ?? "#2563eb";
            return (
              <GridItem
                key={product.id}
                xs={12}
                sm={6}
                lg={4}
                spacing={2}
                className="mb-2">
                <Card className="h-100 product-card card-lift">
                  <Stack direction="row" spacing={14}>
                    <div
                      className="product-card__icon"
                      style={{ backgroundColor: `${color}1a`, color }}>
                      <Icon size={24} />
                    </div>
                    <div style={{ flex: "1 1 auto", minWidth: 0 }}>
                      <h4 className="product-card__name">{product.name}</h4>
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
                          onConfirm={() => handleDelete(product.id)}
                        />
                      </Stack>
                    </div>
                  </Stack>
                </Card>
              </GridItem>
            );
          })}
        </Grid>
      ) : (
        <GridItem xs={12} spacing={2}>
          <EmptyState
            icon={<IconPackage size={28} />}
            title="No products found"
            description="Try a different search term or category filter."
          />
        </GridItem>
      )}

      <ProductFormModal
        open={formOpen}
        product={editingProduct}
        onClose={() => {
          setFormOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSave}
      />
    </Grid>
  );
}
