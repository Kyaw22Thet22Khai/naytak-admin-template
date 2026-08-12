import {
  Avatar,
  Badge,
  Button,
  Stack,
  Table,
  TableBody,
  TableHead,
  IconEdit,
} from "naytak-react-ui";
import { formatDate, capitalize } from "../../../utils/format";
import { ConfirmButton } from "../../../components/confirmButton";

const ROLE_COLORS = {
  admin: "danger",
  editor: "info",
  viewer: "secondary",
};

const AVATAR_COLORS = {
  admin: "danger",
  editor: "primary",
  viewer: "secondary",
};

const STATUS_COLORS = {
  active: "success",
  suspended: "warning",
  pending: "danger",
};

export function UsersTable({ users, onEdit, onDelete }) {
  return (
    <div className="table-scroll">
      <Table>
        <TableHead color="primary">
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Stack direction="row" spacing={8} align="center">
                  <Avatar
                    size="sm"
                    text={user.name}
                    color={AVATAR_COLORS[user.role] ?? "secondary"}
                  />
                  <div>
                    <div>{user.name}</div>
                    <div className="list-meta">{user.email}</div>
                  </div>
                </Stack>
              </td>
              <td>
                <Badge color={ROLE_COLORS[user.role] ?? "secondary"}>
                  {capitalize(user.role)}
                </Badge>
              </td>
              <td>
                <Badge color={STATUS_COLORS[user.status] ?? "secondary"}>
                  {capitalize(user.status)}
                </Badge>
              </td>
              <td>{formatDate(user.joined)}</td>
              <td>
                <Stack direction="row" spacing={4} justify="flex-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<IconEdit size={16} />}
                    onClick={() => onEdit?.(user)}>
                    Edit
                  </Button>
                  <ConfirmButton
                    size="sm"
                    label="Delete"
                    title="Delete user?"
                    message={`${user.name} will lose access immediately.`}
                    onConfirm={() => onDelete?.(user.id)}
                  />
                </Stack>
              </td>
            </tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
