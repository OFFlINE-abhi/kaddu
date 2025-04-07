"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getFirestore,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

export default function AdminPanel() {
  const db = getFirestore();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (err) {
        console.error("Error fetching users:", err);
        toast.error("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [db]);

  const updateUserRole = async (uid: string, newRole: string) => {
    try {
      await updateDoc(doc(db, "users", uid), { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === uid ? { ...u, role: newRole } : u))
      );
      toast.success(
        `User successfully ${newRole === "admin" ? "promoted" : "banned"}.`
      );
    } catch (err) {
      console.error("Error updating user role:", err);
      toast.error("Error updating user.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700"
    >
      <h2 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-white">
        🛠️ Admin Controls
      </h2>

      {loading ? (
        <p className="text-zinc-500 dark:text-zinc-400">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm font-medium text-zinc-800 dark:text-zinc-100">
            <thead className="bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-300 dark:border-zinc-700">
              <tr>
                <th className="py-2 px-3">Name</th>
                <th className="px-3">Email</th>
                <th className="px-3">Role</th>
                <th className="px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-zinc-200 dark:border-zinc-700"
                >
                  <td className="py-2 px-3">{u.name || "—"}</td>
                  <td className="px-3">{u.email || "—"}</td>
                  <td className="px-3 capitalize">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.role === "admin"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : u.role === "banned"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                      }`}
                    >
                      {u.role || "user"}
                    </span>
                  </td>
                  <td className="px-3 space-x-2">
                    {u.role !== "admin" && (
                      <button
                        onClick={() => updateUserRole(u.id, "admin")}
                        className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1 rounded"
                      >
                        Promote
                      </button>
                    )}
                    {u.role !== "banned" && (
                      <button
                        onClick={() => updateUserRole(u.id, "banned")}
                        className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1 rounded"
                      >
                        Ban
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
