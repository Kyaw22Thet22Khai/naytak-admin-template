import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Grid,
  GridItem,
  IconEye,
  IconPlus,
  IconShoppingCart,
  Pagination,
  SearchInput,
  Select,
  Stack,
  Table,
  TableBody,
  TableHead,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { PageHeader } from "../../components/pageHeader";
import { OrderDetailModal } from "./components/orderDetailModal";
import { formatCurrency, formatDate, capitalize } from "../../utils/format";
import { ORDERS, STATUS_COLORS, STATUS_OPTIONS } from "./data/mock";

const PAGE_SIZE = 8;

export function OrdersPage() {
  useDocumentTitle("Orders");

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ORDERS.filter((order) => {
      const matchesQuery =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q);
      const matchesStatus = status === "all" || order.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleOrders = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title="Orders"
          subtitle="Track and manage customer orders"
          actions={
            <Button size="sm" leftIcon={<IconPlus size={16} />}>
              New order
            </Button>
          }
        />
      </GridItem>

      <GridItem xs={12} spacing={2}>
        <Card
          title="All orders"
          subtitle={`${filtered.length} order${filtered.length === 1 ? "" : "s"}`}>
          <Stack direction="row" spacing={8} wrap className="mb-3 list-toolbar">
            <SearchInput
              placeholder="Search order ID or customer…"
              clearable
              value={query}
              onChange={setQuery}
            />
            <Select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              options={STATUS_OPTIONS}
            />
          </Stack>

          {visibleOrders.length > 0 ? (
            <div className="table-scroll">
              <Table>
                <TableHead color="primary">
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </TableHead>
                <TableBody>
                  {visibleOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>
                        <div>{order.customer}</div>
                        <div className="list-meta">{order.email}</div>
                      </td>
                      <td>{formatDate(order.date)}</td>
                      <td>{order.items}</td>
                      <td>{formatCurrency(order.total)}</td>
                      <td>
                        <Badge
                          color={STATUS_COLORS[order.status] ?? "secondary"}>
                          {capitalize(order.status)}
                        </Badge>
                      </td>
                      <td>
                        <Stack direction="row" spacing={4} justify="flex-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            leftIcon={<IconEye size={16} />}
                            onClick={() => setSelectedOrder(order)}>
                            Details
                          </Button>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={<IconShoppingCart size={28} />}
              title="No orders found"
              description="Try a different search term or status filter."
            />
          )}

          {pageCount > 1 && (
            <div className="list-pagination">
              <Pagination
                currentPage={currentPage}
                totalPages={pageCount}
                onPageChange={setPage}
              />
            </div>
          )}
        </Card>
      </GridItem>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </Grid>
  );
}
