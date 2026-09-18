import { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Grid,
  GridItem,
  IconDownload,
  IconEye,
  IconUserRound,
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
import { CustomerDetailModal } from "./components/customerDetailModal";
import { formatCurrency, formatDate } from "../../utils/format";
import { withNote } from "../../components/titleNote";
import { downloadCsv } from "../../utils/exportCsv";
import {
  SEGMENT_COLORS,
  SEGMENT_LABELS,
  SEGMENT_OPTIONS,
  STATUS_COLORS,
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "./data/mock";

const CSV_COLUMNS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "segment", label: "Segment" },
  { key: "orders", label: "Orders" },
  { key: "spent", label: "Total spent" },
  { key: "lastOrder", label: "Last order" },
  { key: "status", label: "Status" },
];

/** Stable list config — useListState memoizes on these identities. */
const SEARCH_KEYS = ["name", "email"];
const FILTERS = {
  segment: (customer, value) => customer.segment === value,
  status: (customer, value) => customer.status === value,
};

export function CustomersPage() {
  useDocumentTitle("Customers");
  const toast = useToast();
  const customers = useCollection("customers");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const list = useListState({
    items: customers.items,
    searchKeys: SEARCH_KEYS,
    filters: FILTERS,
    defaultSort: "name",
    pageSize: 8,
  });

  // Exports what the user is actually looking at, filters included — an export
  // that silently ignores the active filters is worse than no export.
  const handleExport = () => {
    downloadCsv("customers.csv", CSV_COLUMNS, list.results);
    toast.success(
      `Exported ${list.total} customer${list.total === 1 ? "" : "s"} to CSV`,
    );
  };

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title={withNote(
            "Customers",
            "Manage your customer base and segments",
          )}
          actions={
            <Button
              size="sm"
              leftIcon={<IconDownload size={16} />}
              disabled={list.total === 0}
              onClick={handleExport}>
              Export CSV
            </Button>
          }
        />
      </GridItem>

      <GridItem xs={12} spacing={2}>
        <Card title={listTitle("All customers", list)}>
          <div className="mb-3">
            <ListToolbar
              list={list}
              searchPlaceholder="Search name or email…"
              filters={[
                { name: "segment", label: "Segment", options: SEGMENT_OPTIONS },
                { name: "status", label: "Status", options: STATUS_OPTIONS },
              ]}
            />
          </div>

          {list.visible.length > 0 ? (
            <div className="table-scroll">
              <Table>
                <TableHead color="primary">
                  <tr>
                    <SortableTh list={list} field="name">
                      Customer
                    </SortableTh>
                    <SortableTh list={list} field="segment">
                      Segment
                    </SortableTh>
                    <SortableTh list={list} field="orders">
                      Orders
                    </SortableTh>
                    <SortableTh list={list} field="spent">
                      Total spent
                    </SortableTh>
                    <SortableTh list={list} field="lastOrder">
                      Last order
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
                  {list.visible.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <Stack direction="row" spacing={8} align="center">
                          <Avatar size="sm" text={customer.name} />
                          <div>
                            <div>{customer.name}</div>
                            <div className="list-meta">{customer.email}</div>
                          </div>
                        </Stack>
                      </td>
                      <td>
                        <Badge
                          color={SEGMENT_COLORS[customer.segment] ?? "info"}>
                          {SEGMENT_LABELS[customer.segment] ?? customer.segment}
                        </Badge>
                      </td>
                      <td>{customer.orders}</td>
                      <td>{formatCurrency(customer.spent)}</td>
                      <td>
                        {customer.lastOrder
                          ? formatDate(customer.lastOrder)
                          : "—"}
                      </td>
                      <td>
                        <Badge
                          color={STATUS_COLORS[customer.status] ?? "secondary"}>
                          {STATUS_LABELS[customer.status] ?? customer.status}
                        </Badge>
                      </td>
                      <td>
                        <Stack direction="row" spacing={4} justify="flex-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            leftIcon={<IconEye size={16} />}
                            onClick={() => setSelectedCustomer(customer)}>
                            View
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
              noun="customer"
              icon={<IconUserRound size={28} />}
            />
          )}

          <ListPagination list={list} noun="customer" />
        </Card>
      </GridItem>

      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </Grid>
  );
}
