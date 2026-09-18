import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Grid,
  GridItem,
  IconEye,
  IconPlus,
  IconShoppingCart,
  Stack,
  Table,
  TableBody,
  TableHead,
  useToast,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useListState } from "../../hooks/useListState";
import { useCollection } from "../../app/dataContext";
import { PageHeader } from "../../components/pageHeader";
import { ListToolbar, SortableTh } from "../../components/listToolbar";
import {
  ListEmptyState,
  ListPagination,
  listTitle,
} from "../../components/listResults";
import { OrderDetailModal } from "./components/orderDetailModal";
import { OrderFormModal } from "./components/orderFormModal";
import { formatCurrency, formatDate, capitalize } from "../../utils/format";
import { withNote } from "../../components/titleNote";
import { STATUS_COLORS, STATUS_OPTIONS } from "./data/mock";

/** Stable list config — useListState memoizes on these identities. */
const SEARCH_KEYS = ["id", "customer", "email"];
const FILTERS = { status: (order, value) => order.status === value };

export function OrdersPage() {
  useDocumentTitle("Orders");
  const toast = useToast();
  const orders = useCollection("orders");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const list = useListState({
    items: orders.items,
    searchKeys: SEARCH_KEYS,
    filters: FILTERS,
    defaultSort: "date",
    pageSize: 8,
  });

  const handleCreate = (data) => {
    const created = orders.add(data);
    list.revealItem(created);
    setFormOpen(false);
    toast.success(`Order ${created.id} created`);
  };

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title={withNote("Orders", "Track and manage customer orders")}
          actions={
            <Button
              size="sm"
              leftIcon={<IconPlus size={16} />}
              onClick={() => setFormOpen(true)}>
              New order
            </Button>
          }
        />
      </GridItem>

      <GridItem xs={12} spacing={2}>
        <Card title={listTitle("All orders", list)}>
          <div className="mb-3">
            <ListToolbar
              list={list}
              searchPlaceholder="Search order ID or customer…"
              filters={[
                { name: "status", label: "Status", options: STATUS_OPTIONS },
              ]}
            />
          </div>

          {list.visible.length > 0 ? (
            <div className="table-scroll">
              <Table>
                <TableHead color="primary">
                  <tr>
                    <SortableTh list={list} field="id">
                      Order
                    </SortableTh>
                    <SortableTh list={list} field="customer">
                      Customer
                    </SortableTh>
                    <SortableTh list={list} field="date">
                      Date
                    </SortableTh>
                    <SortableTh list={list} field="items">
                      Items
                    </SortableTh>
                    <SortableTh list={list} field="total">
                      Total
                    </SortableTh>
                    <SortableTh list={list} field="status">
                      Status
                    </SortableTh>
                    <th scope="col" style={{ textAlign: "right" }}>
                      Actions
                    </th>
                  </tr>
                </TableHead>
                <TableBody>
                  {list.visible.map((order) => (
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
            <ListEmptyState
              list={list}
              noun="order"
              icon={<IconShoppingCart size={28} />}
              onCreate={() => setFormOpen(true)}
              createLabel="New order"
            />
          )}

          <ListPagination list={list} noun="order" />
        </Card>
      </GridItem>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {formOpen && (
        <OrderFormModal
          open
          onClose={() => setFormOpen(false)}
          onSave={handleCreate}
        />
      )}
    </Grid>
  );
}
