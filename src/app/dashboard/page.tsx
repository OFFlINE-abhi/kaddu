"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { tsParticles } from "@tsparticles/engine";
import { loadFull } from "tsparticles";
import Particles from "@tsparticles/react";

// 🔧 Layout Components
import LayoutWrapper from "@/components/dashboard/LayoutWrapper";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/layout/Sidebar";
import SearchBar from "@/components/dashboard/SearchBar";
import QuickActions from "@/components/dashboard/QuickActions";
import FeedbackModal from "@/components/dashboard/FeedbackModal";
import ScheduleModal from "@/components/dashboard/ScheduleModal";
import MotionWrapper from "@/components/dashboard/MotionWrapper";

// 🛠️ Tools & Widgets
import Notifications from "@/components/tools/Notifications";
import Feedback from "@/components/tools/Feedback";
import Assist from "@/components/tools/Assistant";
import Clock from "@/components/dashboard/Clock";
import DarkModeToggle from "@/components/dashboard/DarkModeToggle";
import DropdownMenu from "@/components/dashboard/DropdownMenu";
import LiveWeather from "@/components/dashboard/LiveWeather";
import ScientificCalculator from "@/components/tools/ScientificCalculator";

// 📊 Dashboard Tabs
import Overview from "@/components/tabs/Overview";
import Analytics from "@/components/tabs/Analytics";
import Settings from "@/components/tabs/Settings";
import Profile from "@/components/tabs/Profile";

// 🚀 Constants
import { tabIcons } from "@/lib/constants";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<keyof typeof tabIcons>("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [betaAccess, setBetaAccess] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // ✅ Load Particles Effect Once (Better optimization)
  useEffect(() => {
    loadFull(tsParticles).catch(console.error);
  }, []);

  // 🔐 Authentication Check with Loading State
  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) router.replace("/login");
    });
  }, [router]);

  // 🛠️ Get First Name of User (Memoized for Performance)
  const userFirstName = useMemo(() => user?.displayName?.split(" ")[0] || "Kaddu", [user]);

  // 🏠 Render Active Tab (Memoized)
  const renderActiveTab = useMemo(() => {
    const components = {
      Overview: <Overview />,
      Analytics: <Analytics />,
      Settings: <Settings />,
      Profile: <Profile />,
      Calculator: <ScientificCalculator />,
    };

    return components[activeTab] || <Overview />;
  }, [activeTab]);

  // 🔔 Toggle Notifications (Better permission handling)
  const toggleNotifications = useCallback(async () => {
    if (!("Notification" in window)) return alert("This browser does not support notifications.");

    if (Notification.permission === "granted") {
      setNotificationsEnabled((prev) => !prev);
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
        new Notification("Notifications enabled!", { body: "You'll receive updates here." });
      }
    }
  }, []);

  // 🕵️ Show Loading Screen Before Rendering
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <LayoutWrapper>
      {/* 🌌 Particle Background */}
      <Particles id="tsparticles" options={particleOptions} className="absolute inset-0 z-0 pointer-events-none" />

      {/* 📚 Sidebar + Content Layout */}
      <div className="flex h-screen w-full">
        {/* 📌 Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
          setActiveTab={(tab) => setActiveTab(tab as keyof typeof tabIcons)}
          user={user}
        />

        {/* 📖 Main Content */}
        <main className="flex flex-col flex-1 overflow-y-auto p-6 bg-background text-foreground transition-colors duration-300">
          {/* 🏠 Header */}
          <Header user={user} setSidebarOpen={setSidebarOpen} />

          {/* 👋 Welcome Section */}
          <div className="flex justify-between items-center gap-4 mt-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Hey {userFirstName} 👋</h1>
              <p className="text-sm text-muted-foreground">Welcome back to your personalized dashboard!</p>
            </div>
            <div className="flex items-center gap-4 bg-card p-3 px-5 rounded-xl shadow-md">
              <Clock />
              <LiveWeather />
              <DarkModeToggle />
              <DropdownMenu user={user} />
            </div>
          </div>

          {/* 🔍 Search Bar */}
          <SearchBar />

          {/* 🌟 Dynamic Content */}
          <div className="flex-grow">{renderActiveTab}</div>

          {/* ⚡ Quick Actions */}
          <div className="mt-6">
            <MotionWrapper>
              <QuickActions
                setFeedbackOpen={setFeedbackOpen}
                setScheduleOpen={setScheduleOpen}
                betaAccess={betaAccess}
                setBetaAccess={setBetaAccess}
                notificationsEnabled={notificationsEnabled}
                toggleNotifications={toggleNotifications}
              />
            </MotionWrapper>
          </div>

          {/* 🤖 Assistant */}
          <Assist />

          {/* 📌 Footer */}
          <footer className="mt-10 py-4 text-center text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
            © {new Date().getFullYear()} Kaddu's Portfolio. All rights reserved.
          </footer>
        </main>
      </div>

      {/* 📥 Modals */}
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      <ScheduleModal isOpen={scheduleOpen} onClose={() => setScheduleOpen(false)} />
    </LayoutWrapper>
  );
}

// 🎇 Particle Background Configuration
const particleOptions = {
  fullScreen: { enable: false },
  background: { color: "transparent" },
  particles: {
    number: { value: 35 },
    color: { value: "#00ffff" },
    size: { value: 3 },
    move: { enable: true, speed: 1.6 },
    opacity: { value: 0.25 },
    links: { enable: true, color: "#00ffff", distance: 130 },
  },
};
