import { useMemo, useState } from "react";
import {
  Button,
  Card,
  EmptyState,
  Grid,
  GridItem,
  IconPlus,
  IconUsers,
  Pagination,
  SearchInput,
  Select,
  Stack,
  useToast,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { PageHeader } from "../../components/pageHeader";
import { UsersTable } from "./components/usersTable";
import { AddUserModal } from "./components/addUserModal";
import { ROLE_OPTIONS, USERS } from "./data/mock";
import "./users.css";

const PAGE_SIZE = 8;

export function UsersPage() {
  useDocumentTitle("Users");
  const toast = useToast();

  const [users, setUsers] = useState(USERS);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesQuery =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q);
      const matchesRole = role === "all" || user.role === role;
      return matchesQuery && matchesRole;
    });
  }, [users, query, role]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleUsers = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
    toast.success("User removed");
  };

  const openAdd = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleSave = (data) => {
    if (editingUser) {
      // Overwrite the existing user that shares the same id.
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id ? { ...user, ...data } : user,
        ),
      );
      toast.success(`${data.name} updated`);
    } else {
      // Append a new row to the user list.
      const user = {
        ...data,
        id: Date.now(),
        joined: new Date().toISOString().slice(0, 10),
      };
      setUsers((prev) => [user, ...prev]);
      toast.success(`${user.name} added`);
    }
    setModalOpen(false);
    setEditingUser(null);
  };

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title="Users"
          subtitle="Manage team members and their access"
          actions={
            <Button
              size="sm"
              leftIcon={<IconPlus size={16} />}
              onClick={openAdd}>
              Add user
            </Button>
          }
        />
      </GridItem>

      <GridItem xs={12} spacing={2}>
        <Card
          title="All users"
          subtitle={`${filtered.length} user${filtered.length === 1 ? "" : "s"}`}>
          <Stack direction="row" spacing={8} wrap className="mb-3 list-toolbar">
            <SearchInput
              placeholder="Search name or email…"
              clearable
              value={query}
              onChange={setQuery}
            />
            <Select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
              options={ROLE_OPTIONS}
            />
          </Stack>

          {visibleUsers.length > 0 ? (
            <UsersTable
              users={visibleUsers}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ) : (
            <EmptyState
              icon={<IconUsers size={28} />}
              title="No users found"
              description="Try a different search term or role filter."
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

      <AddUserModal
        open={modalOpen}
        user={editingUser}
        onClose={() => {
          setModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSave}
      />
    </Grid>
  );
}
