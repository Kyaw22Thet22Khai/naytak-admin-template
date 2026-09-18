import { useState } from "react";
import {
  Button,
  Card,
  Grid,
  GridItem,
  IconPlus,
  IconUsers,
  useToast,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useListState } from "../../hooks/useListState";
import { useCollection } from "../../app/dataContext";
import { PageHeader } from "../../components/pageHeader";
import { ListToolbar } from "../../components/listToolbar";
import {
  ListEmptyState,
  ListPagination,
  listTitle,
} from "../../components/listResults";
import { UndoBar, useUndoable } from "../../components/undoBar";
import { UsersTable } from "./components/usersTable";
import { AddUserModal } from "./components/addUserModal";
import { ROLE_OPTIONS } from "./data/mock";
import "./users.css";
import { withNote } from "../../components/titleNote";

/** Stable list config — useListState memoizes on these identities. */
const SEARCH_KEYS = ["name", "email"];
const FILTERS = { role: (user, value) => user.role === value };

export function UsersPage() {
  useDocumentTitle("Users");
  const toast = useToast();
  const users = useCollection("users");
  const undo = useUndoable();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const list = useListState({
    items: users.items,
    searchKeys: SEARCH_KEYS,
    filters: FILTERS,
    defaultSort: "name",
    pageSize: 8,
  });

  const handleDelete = (id) => {
    const index = users.items.findIndex((user) => user.id === id);
    const removed = users.items[index];
    users.remove(id);
    undo.offer(`${removed.name} removed`, () => users.restore(removed, index));
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
    let saved;
    if (editingUser) {
      users.update(editingUser.id, data);
      saved = { ...editingUser, ...data };
      toast.success(`${data.name} updated`);
    } else {
      saved = users.add({
        ...data,
        joined: new Date().toISOString().slice(0, 10),
      });
      toast.success(`${saved.name} added`);
    }
    list.revealItem(saved);
    setModalOpen(false);
    setEditingUser(null);
  };

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title={withNote("Users", "Manage team members and their access")}
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
        <Card title={listTitle("All users", list)}>
          <div className="mb-3">
            <ListToolbar
              list={list}
              searchPlaceholder="Search name or email…"
              filters={[{ name: "role", label: "Role", options: ROLE_OPTIONS }]}
            />
          </div>

          {list.visible.length > 0 ? (
            <UsersTable
              users={list.visible}
              list={list}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ) : (
            <ListEmptyState
              list={list}
              noun="user"
              icon={<IconUsers size={28} />}
              onCreate={openAdd}
              createLabel="Add user"
            />
          )}

          <ListPagination list={list} noun="user" />
        </Card>
      </GridItem>

      {/* Rendered only while open so the form starts clean each time. */}
      {modalOpen && (
        <AddUserModal
          open
          user={editingUser}
          onClose={() => {
            setModalOpen(false);
            setEditingUser(null);
          }}
          onSave={handleSave}
        />
      )}

      <UndoBar undo={undo} />
    </Grid>
  );
}
