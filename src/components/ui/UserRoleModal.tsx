"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/Dialog";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/app/firebase";

interface UserRoleModalProps {
  userId: string;
  currentRole: string;
  triggerLabel?: string;
}

const roles = ["user", "admin", "moderator"];

export default function UserRoleModal({
  userId,
  currentRole,
  triggerLabel = "Edit Role",
}: UserRoleModalProps) {
  const [role, setRole] = useState(currentRole);
  const [open, setOpen] = useState(false);

  const handleSave = async () => {
    try {
      const ref = doc(db, "users", userId);
      await updateDoc(ref, { role });
      setOpen(false);
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="outline">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Edit User Role</DialogHeader>
        <div className="space-y-4 mt-2">
          <Label htmlFor="role">User Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
