import {
    FiGrid,
    FiTrendingUp,
    FiSettings,
    FiUser,
  } from "react-icons/fi";
  import { IconType } from "react-icons";
  
  export const tabIcons: Record<"Overview" | "Analytics" | "Settings" | "Profile", IconType> = {
    Overview: FiGrid,
    Analytics: FiTrendingUp,
    Settings: FiSettings,
    Profile: FiUser,
  };
  