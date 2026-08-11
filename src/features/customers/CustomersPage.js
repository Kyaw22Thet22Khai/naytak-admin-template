import { useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  Grid,
  GridItem,
  IconEye,
  IconUserRound,
  Pagination,
  SearchInput,
  Select,
  Stack,
  Table,
  TableBody,
  TableHead,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { PageHeader } from "../../components/PageHeader";
import { CustomerDetailModal } from "./components/CustomerDetailModal";
import { formatCurrency, formatDate } from "../../utils/format";
import {
  CUSTOMERS,
  SEGMENT_COLORS,
  SEGMENT_LABELS,
  SEGMENT_OPTIONS,
  STATUS_COLORS,
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "./data/mock";

const PAGE_SIZE = 8;

export function CustomersPage() {
  useDocumentTitle("Customers");

  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CUSTOMERS.filter((customer) => {
      const matchesQuery =
        !q ||
        customer.name.toLowerCase().includes(q) ||
        customer.email.toLowerCase().includes(q);
      const matchesSegment = segment === "all" || customer.segment === segment;
      const matchesStatus = status === "all" || customer.status === status;
      return matchesQuery && matchesSegment && matchesStatus;
    });
  }, [query, segment, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleCustomers = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title="Customers"
          subtitle="Manage your customer base and segments"
          actions={
            <Button size="sm" leftIcon={<IconEye size={16} />}>
              Export
            </Button>
          }
        />
      </GridItem>

      <GridItem xs={12} spacing={2}>
        <Card
          title="All customers"
          subtitle={`${filtered.length} customer${filtered.length === 1 ? "" : "s"}`}>
          <Stack direction="row" spacing={8} wrap className="mb-3 list-toolbar">
            <SearchInput
              placeholder="Search name or email…"
              clearable
              value={query}
              onChange={setQuery}
            />
            <Select
              value={segment}
              onChange={(e) => {
                setSegment(e.target.value);
                setPage(1);
              }}
              options={SEGMENT_OPTIONS}
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

          {visibleCustomers.length > 0 ? (
            <div className="table-scroll">
              <Table>
                <TableHead color="primary">
                  <tr>
                    <th>Customer</th>
                    <th>Segment</th>
                    <th>Orders</th>
                    <th>Total spent</th>
                    <th>Last order</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </TableHead>
                <TableBody>
                  {visibleCustomers.map((customer) => (
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
            <EmptyState
              icon={<IconUserRound size={28} />}
              title="No customers found"
              description="Try a different search term or segment filter."
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

      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </Grid>
  );
}
