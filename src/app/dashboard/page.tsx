"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { tsParticles } from "@tsparticles/engine";
import { loadFull } from "tsparticles";
import Particles from "@tsparticles/react";

// 📌 Layout Components
import LayoutWrapper from "@/components/dashboard/LayoutWrapper";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/layout/Sidebar";
import MotionWrapper from "@/components/dashboard/MotionWrapper";

// 🛠️ Dashboard Features
import SearchBar from "@/components/dashboard/SearchBar";
import QuickActions from "@/components/dashboard/QuickActions";
import Assist from "@/components/tools/Assistant";
import DarkModeToggle from "@/components/dashboard/DarkModeToggle";
import DropdownMenu from "@/components/dashboard/DropdownMenu";
import LiveWeather from "@/components/dashboard/LiveWeather";
import Clock from "@/components/dashboard/Clock";

// 📊 Dashboard Tabs
import Overview from "@/components/tabs/Overview";
import Analytics from "@/components/tabs/Analytics";
import Settings from "@/components/tabs/Settings";
import Profile from "@/components/tabs/Profile";
import ScientificCalculator from "@/components/tools/ScientificCalculator";

// 🔔 Modals
import FeedbackModal from "@/components/dashboard/FeedbackModal";
import ScheduleModal from "@/components/dashboard/ScheduleModal";

// 👑 Admin Panel Component
import AdminPanel from "@/components/admin/AdminPanel";

// 🧠 Meeting Features
import MeetingScheduler from "@/components/tools/MeetingScheduler";
import MeetingHistory from "@/components//tools/MeetingHistory";
import JitsiMeetingComponent from "@/components/tools/JitsiMeetingComponent";

// 🚀 Constants
import { tabIcons } from "@/lib/constants";

// 🔐 Firebase Role Logic Hook
const useAuthWithRole = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    return onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setUser(currentUser);

      const roleRef = doc(db, "users", currentUser.uid);
      const roleSnap = await getDoc(roleRef);
      const role = roleSnap.exists() ? roleSnap.data()?.role || "user" : "user";

      setRole(role);
      setLoading(false);
    });
  }, [router]);

  return { user, role, loading };
};

export default function Dashboard() {
  const { user, role, loading } = useAuthWithRole();
  const [activeTab, setActiveTab] = useState<keyof typeof tabIcons>("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [betaAccess, setBetaAccess] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showMeeting, setShowMeeting] = useState(false);
  const [currentMeetingId, setCurrentMeetingId] = useState<string | null>(null);

  const meetingSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadFull(tsParticles).catch(console.error);
  }, []);

  const userFirstName = useMemo(() => user?.displayName?.split(" ")[0] || "Kaddu", [user]);

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

  const toggleNotifications = useCallback(async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications.");
      return;
    }

    if (Notification.permission === "granted") {
      const updated = !notificationsEnabled;
      setNotificationsEnabled(updated);

      new Notification(`🔔 Notifications ${updated ? "enabled" : "disabled"}`, {
        body: updated
          ? "You'll now receive browser alerts."
          : "You have disabled browser alerts.",
      });
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
        new Notification("🔔 Notifications enabled!", {
          body: "You'll now receive browser alerts.",
        });
      }
    }
  }, [notificationsEnabled]);

  const handleScheduleClick = () => {
    setScheduleOpen(true);
    setTimeout(() => {
      meetingSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <LayoutWrapper>
      <Particles id="tsparticles" options={particleOptions} className="absolute inset-0 z-0 pointer-events-none" />

      <div className="flex h-screen w-full">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
          setActiveTab={(tab) => setActiveTab(tab as keyof typeof tabIcons)}
          user={user}
        />

        <main className="flex flex-col flex-1 overflow-y-auto p-6 bg-background text-foreground transition-colors duration-300">
          <Header user={user} setSidebarOpen={setSidebarOpen} />

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

          <SearchBar />

          {role === "admin" && (
            <div className="mb-6">
              <MotionWrapper>
                <AdminPanel />
              </MotionWrapper>
            </div>
          )}

          <div className="flex-grow">{renderActiveTab}</div>

          <div className="mt-6">
            <MotionWrapper>
              <QuickActions
                setFeedbackOpen={setFeedbackOpen}
                setScheduleOpen={handleScheduleClick} // ← updated here
                betaAccess={betaAccess}
                setBetaAccess={setBetaAccess}
                notificationsEnabled={notificationsEnabled}
                toggleNotifications={toggleNotifications}
              />
            </MotionWrapper>
          </div>

          {/* 🧠 Meeting Section */}
          <div ref={meetingSectionRef} className="mt-10 space-y-6">
            <MeetingScheduler />
            <MeetingHistory />
            {showMeeting && currentMeetingId && (
              <JitsiMeetingComponent
                roomName={currentMeetingId}
                displayName={user?.displayName || "Guest"}
                userId={user?.uid || "unknown"}
                onMeetingEnd={() => {
                  setShowMeeting(false);
                  setCurrentMeetingId(null);
                }}
              />
            )}
          </div>

          <Assist />

          <footer className="mt-10 py-4 text-center text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
            © {new Date().getFullYear()} Kaddu's Portfolio. All rights reserved.
          </footer>
        </main>
      </div>

      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      <ScheduleModal isOpen={scheduleOpen} onClose={() => setScheduleOpen(false)} />
    </LayoutWrapper>
  );
}

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
