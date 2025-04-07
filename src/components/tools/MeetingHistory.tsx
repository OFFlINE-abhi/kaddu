"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  DocumentData,
} from "firebase/firestore";

interface Meeting extends DocumentData {
  id: string;
  title: string;
  scheduledTime: { seconds: number; nanoseconds: number };
  expiresAt: { seconds: number; nanoseconds: number };
}

export default function MeetingHistory() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const q = query(
          collection(db, "meetings"),
          orderBy("scheduledTime", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetched: Meeting[] = querySnapshot.docs.map((doc) => ({
          id: doc.data().id,
          title: doc.data().title,
          scheduledTime: doc.data().scheduledTime,
          expiresAt: doc.data().expiresAt,
        }));
        setMeetings(fetched);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchMeetings();
  }, []);

  const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-md text-white max-w-2xl mt-6">
      <h2 className="text-lg font-semibold mb-4">📜 Meeting History</h2>
      {meetings.length === 0 ? (
        <p className="text-gray-400">No meetings scheduled yet.</p>
      ) : (
        <ul className="space-y-4">
          {meetings.map((meeting) => (
            <li key={meeting.id} className="p-4 rounded bg-zinc-700">
              <div className="font-semibold">{meeting.title}</div>
              <div className="text-sm text-gray-400">
                Scheduled: {formatDate(meeting.scheduledTime)}
              </div>
              <div className="text-sm text-gray-500">
                Expires: {formatDate(meeting.expiresAt)}
              </div>
              <a
                href={`https://meet.jit.si/${meeting.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-400 hover:underline"
              >
                🔗 Join Meeting
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
