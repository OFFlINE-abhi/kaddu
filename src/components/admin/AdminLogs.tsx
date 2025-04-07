"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const q = query(collection(db, "adminLogs"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      setLogs(snapshot.docs.map((doc) => doc.data()));
    };

    fetchLogs();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Admin Logs</h2>
      <div className="bg-gray-100 p-4 rounded text-sm max-h-60 overflow-y-auto">
        {logs.map((log, i) => (
          <p key={i}>
            {log.action} by {log.admin} at{" "}
            {new Date(log.timestamp?.toDate()).toLocaleString()}
          </p>
        ))}
      </div>
    </div>
  );
}
