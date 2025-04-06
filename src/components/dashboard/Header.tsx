import { User } from "firebase/auth";
import DarkModeToggle from "./DarkModeToggle";
import DropdownMenu from "./DropdownMenu";

interface HeaderProps {
  user: User | null;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ user, setSidebarOpen }: HeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div className="text-sm font-medium">
        👤 Welcome, {user?.displayName?.split(" ")[0] || "Kaddu"}
      </div>
      <div className="flex items-center gap-4">
        <DarkModeToggle />
        <DropdownMenu user={user} />
      </div>
    </header>
  );
}
