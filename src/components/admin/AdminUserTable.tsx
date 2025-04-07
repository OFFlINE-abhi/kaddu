"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/firebase";
import { collection, getDocs } from "firebase/firestore";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminUserTable() {
  const [users, setUsers] = useState<UserRecord[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const userData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as UserRecord[];
      setUsers(userData);
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">User List</h2>
      <table className="min-w-full table-auto bg-white text-black">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="px-4 py-2">{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
