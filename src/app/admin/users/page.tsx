"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import { useAdminCheck } from "@/components/hooks/useAdminCheck";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const { isAdmin, loading } = useAdminCheck();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const userData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(userData);
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      toast.success("User deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      toast.success("Role updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return <div className="text-white p-4">Checking admin status...</div>;
  if (!isAdmin)
    return <div className="text-red-400 p-4">Access denied.</div>;

  return (
    <div className="p-4 space-y-4 max-w-screen-xl mx-auto">
      <h2 className="text-2xl font-semibold text-white">Manage Users</h2>

      <Input
        placeholder="Search by email"
        className="max-w-md w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="p-4 space-y-3 flex flex-col">
            <div className="text-white font-medium break-words">
              {user.email}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm text-gray-300 sm:w-16">Role:</label>
              <select
                aria-label={`Role for ${user.email}`}
                className="bg-white/10 border border-white/20 text-white rounded px-2 py-1 w-full sm:w-auto"
                value={user.role || "user"}
                onChange={(e) => handleRoleChange(user.id, e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>

            <Button
              className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto"
              onClick={() => handleDelete(user.id)}
            >
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}