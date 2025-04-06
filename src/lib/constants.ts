import {
  FiGrid,
  FiTrendingUp,
  FiSettings,
  FiUser,
  FiCpu, // 🧠 For calculator
} from "react-icons/fi";
import { IconType } from "react-icons";

export const tabIcons: Record<
  "Overview" | "Analytics" | "Settings" | "Profile" | "Calculator", // 👈 Added here
  IconType
> = {
  Overview: FiGrid,
  Analytics: FiTrendingUp,
  Settings: FiSettings,
  Profile: FiUser,
  Calculator: FiCpu, // 👈 New entry
};
