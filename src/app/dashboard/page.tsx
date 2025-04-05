"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

import Clock from "@/components/dashboard/Clock";
import Sidebar from "@/components/layout/Sidebar";
import QuickActions from "@/components/dashboard/QuickActions";
import FeedbackModal from "@/components/dashboard/FeedbackModal";
import ScheduleModal from "@/components/dashboard/ScheduleModal";
import Assist from "@/components/dashboard/Assist";

import { tabIcons } from "@/lib/constants";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<keyof typeof tabIcons>("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [betaAccess, setBetaAccess] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return <div className="p-6">Welcome to the Dashboard Overview!</div>;
      case "Analytics":
        return <div className="p-6">Analytics data will appear here.</div>;
      case "Settings":
        return <div className="p-6">Adjust your settings here.</div>;
      case "Profile":
        return <div className="p-6">This is your profile page.</div>;
      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
      />

      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
          >
            ☰
          </button>
          <Clock />
        </div>

        {renderContent()}

        <div className="mt-6">
          <QuickActions
            setFeedbackOpen={setFeedbackOpen}
            setScheduleOpen={setScheduleOpen}
            betaAccess={betaAccess}
            setBetaAccess={setBetaAccess}
            notificationsEnabled={notificationsEnabled}
            setNotificationsEnabled={setNotificationsEnabled}
          />
        </div>

        <Assist />
      </main>

      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      <ScheduleModal isOpen={scheduleOpen} onClose={() => setScheduleOpen(false)} />
    </div>
  );
}
