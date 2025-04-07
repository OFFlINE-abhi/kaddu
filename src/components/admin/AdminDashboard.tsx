import AdminPanel from "./AdminPanel";
import AdminFeedbackPanel from "./AdminFeedbackPanel";

export default function AdminDashboard() {
  return (
    <div className="space-y-10 px-4 md:px-10 py-6">
      <AdminPanel />
      <AdminFeedbackPanel />
    </div>
  );
}
