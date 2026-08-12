import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Grid,
  GridItem,
  IconDownload,
  IconEye,
  IconFileText,
  IconPlus,
  Pagination,
  SearchInput,
  Select,
  Stack,
  Table,
  TableBody,
  TableHead,
  useToast,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { PageHeader } from "../../components/pageHeader";
import { InvoiceDetailModal } from "./components/invoiceDetailModal";
import { formatCurrency, formatDate, capitalize } from "../../utils/format";
import { INVOICES, STATUS_COLORS, STATUS_OPTIONS } from "./data/mock";

const PAGE_SIZE = 8;

export function InvoicesPage() {
  useDocumentTitle("Invoices");
  const toast = useToast();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INVOICES.filter((invoice) => {
      const matchesQuery =
        !q ||
        invoice.id.toLowerCase().includes(q) ||
        invoice.customer.toLowerCase().includes(q);
      const matchesStatus = status === "all" || invoice.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleInvoices = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title="Invoices"
          subtitle="Track issued invoices and payment status"
          actions={
            <Button size="sm" leftIcon={<IconPlus size={16} />}>
              New invoice
            </Button>
          }
        />
      </GridItem>

      <GridItem xs={12} spacing={2}>
        <Card
          title="All invoices"
          subtitle={`${filtered.length} invoice${filtered.length === 1 ? "" : "s"}`}>
          <Stack direction="row" spacing={8} wrap className="mb-3 list-toolbar">
            <SearchInput
              placeholder="Search invoice ID or customer…"
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

          {visibleInvoices.length > 0 ? (
            <div className="table-scroll">
              <Table>
                <TableHead color="primary">
                  <tr>
                    <th>Invoice</th>
                    <th>Customer</th>
                    <th>Issued</th>
                    <th>Due</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </TableHead>
                <TableBody>
                  {visibleInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>{invoice.id}</td>
                      <td>{invoice.customer}</td>
                      <td>{formatDate(invoice.issued)}</td>
                      <td>{formatDate(invoice.due)}</td>
                      <td>{formatCurrency(invoice.amount)}</td>
                      <td>
                        <Badge
                          color={STATUS_COLORS[invoice.status] ?? "secondary"}>
                          {capitalize(invoice.status)}
                        </Badge>
                      </td>
                      <td>
                        <Stack direction="row" spacing={4} justify="flex-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            leftIcon={<IconDownload size={16} />}
                            onClick={() =>
                              toast.info("Invoice PDF coming soon")
                            }>
                            PDF
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            leftIcon={<IconEye size={16} />}
                            onClick={() => setSelectedInvoice(invoice)}>
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
              icon={<IconFileText size={28} />}
              title="No invoices found"
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

      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </Grid>
  );
}
