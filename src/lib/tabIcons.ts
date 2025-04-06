import { FiGrid, FiTrendingUp, FiSettings, FiUser, FiClock, FiEdit2 } from "react-icons/fi";
import { AiOutlineCalculator } from "react-icons/ai";
import { MdOutlinePlaylistAddCheck } from "react-icons/md";
import { BsCalendar3 } from "react-icons/bs";
import { FaQuoteRight } from "react-icons/fa";
import { IconType } from "react-icons";

export const tabIcons: Record<string, IconType> = {
  Overview: FiGrid,
  Analytics: FiTrendingUp,
  Settings: FiSettings,
  Calculator: AiOutlineCalculator,
  Pomodoro: FiClock,
  Notes: FiEdit2,
  Todo: MdOutlinePlaylistAddCheck,
  Calendar: BsCalendar3,
  Quotes: FaQuoteRight,
};
