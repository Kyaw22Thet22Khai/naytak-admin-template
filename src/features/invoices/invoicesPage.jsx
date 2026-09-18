import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Grid,
  GridItem,
  IconEye,
  IconFileText,
  IconPlus,
  IconPrinter,
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
import { InvoiceDetailModal } from "./components/invoiceDetailModal";
import { InvoiceFormModal } from "./components/invoiceFormModal";
import { printInvoice } from "./printInvoice";
import { formatCurrency, formatDate, capitalize } from "../../utils/format";
import { withNote } from "../../components/titleNote";
import { STATUS_COLORS, STATUS_OPTIONS } from "./data/mock";

/** Stable list config — useListState memoizes on these identities. */
const SEARCH_KEYS = ["id", "customer"];
const FILTERS = { status: (invoice, value) => invoice.status === value };

export function InvoicesPage() {
  useDocumentTitle("Invoices");
  const toast = useToast();
  const invoices = useCollection("invoices");

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const list = useListState({
    items: invoices.items,
    searchKeys: SEARCH_KEYS,
    filters: FILTERS,
    defaultSort: "issued",
    pageSize: 8,
  });

  const handleCreate = (data) => {
    const created = invoices.add(data);
    list.revealItem(created);
    setFormOpen(false);
    toast.success(`Invoice ${created.id} created`);
  };

  // Opens the invoice in a print window — the browser's own "Save as PDF" is
  // a real PDF, and costs no dependency.
  const handlePrint = (invoice) => {
    const opened = printInvoice(invoice);
    if (!opened) toast.error("Allow pop-ups to print or save this invoice.");
  };

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title={withNote(
            "Invoices",
            "Track issued invoices and payment status",
          )}
          actions={
            <Button
              size="sm"
              leftIcon={<IconPlus size={16} />}
              onClick={() => setFormOpen(true)}>
              New invoice
            </Button>
          }
        />
      </GridItem>

      <GridItem xs={12} spacing={2}>
        <Card title={listTitle("All invoices", list)}>
          <div className="mb-3">
            <ListToolbar
              list={list}
              searchPlaceholder="Search invoice ID or customer…"
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
                      Invoice
                    </SortableTh>
                    <SortableTh list={list} field="customer">
                      Customer
                    </SortableTh>
                    <SortableTh list={list} field="issued">
                      Issued
                    </SortableTh>
                    <SortableTh list={list} field="due">
                      Due
                    </SortableTh>
                    <SortableTh list={list} field="amount">
                      Amount
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
                  {list.visible.map((invoice) => (
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
                            aria-label={`Print invoice ${invoice.id}`}
                            leftIcon={<IconPrinter size={16} />}
                            onClick={() => handlePrint(invoice)}>
                            Print
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
            <ListEmptyState
              list={list}
              noun="invoice"
              icon={<IconFileText size={28} />}
              onCreate={() => setFormOpen(true)}
              createLabel="New invoice"
            />
          )}

          <ListPagination list={list} noun="invoice" />
        </Card>
      </GridItem>

      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {formOpen && (
        <InvoiceFormModal
          open
          onClose={() => setFormOpen(false)}
          onSave={handleCreate}
        />
      )}
    </Grid>
  );
}
