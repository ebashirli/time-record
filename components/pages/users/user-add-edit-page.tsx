import { UserAddEditForm } from "./UserAddEditForm";
import { UserAddEditModal } from "./UserAddEditModal";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components//ui/dialog";
import { User } from "./types";

interface Props {
  user: User | null;
}

export default async function UserAddEditPage({ user }: Props) {
  return (
    <UserAddEditModal open={!!user || user === null}>
      <>
        <DialogHeader>
          <div className="">
            <DialogTitle className="text-3xl font-bold tracking-tight">
              {user ? "Edit user" : "Add user"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {user
                ? `Update user information for ${user.name}`
                : "Add new user"}
            </DialogDescription>
          </div>
        </DialogHeader>

        <UserAddEditForm user={user} />
      </>
    </UserAddEditModal>
  );
}
