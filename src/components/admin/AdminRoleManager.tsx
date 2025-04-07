"use client";

import { db } from "@/app/firebase";
import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function AdminRoleManager() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(list);
    };

    fetchUsers();
  }, []);

  const updateRole = async (id: string, role: string) => {
    const ref = doc(db, "users", id);
    await updateDoc(ref, { role });
    alert(`Updated role for ${id} to ${role}`);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Manage User Roles</h2>
      {users.map((user) => (
        <div key={user.id} className="mb-2 flex items-center gap-4">
          <p className="w-40">{user.name}</p>
          <label htmlFor={`role-select-${user.id}`} className="sr-only">
            Select role for {user.name}
          </label>
          <select
            id={`role-select-${user.id}`}
            className="border px-2 py-1"
            value={user.role}
            onChange={(e) => updateRole(user.id, e.target.value)}
            aria-label={`Select role for ${user.name}`}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      ))}
    </div>
  );
}
