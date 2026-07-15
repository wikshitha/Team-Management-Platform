import {
  FiBell,
  FiCheckSquare,
  FiFolder,
  FiMessageSquare,
  FiRefreshCw,
} from "react-icons/fi";

import type { NotificationType } from "@/types/notification";

interface NotificationIconProps {
  type: NotificationType;
}

export default function NotificationIcon({
  type,
}: NotificationIconProps) {
  const iconClassName = "text-lg";

  switch (type) {
    case "PROJECT_ASSIGNED":
      return (
        <FiFolder className={iconClassName} />
      );

    case "TASK_ASSIGNED":
      return (
        <FiCheckSquare
          className={iconClassName}
        />
      );

    case "TASK_UPDATED":
      return (
        <FiRefreshCw
          className={iconClassName}
        />
      );

    case "TASK_COMMENT":
      return (
        <FiMessageSquare
          className={iconClassName}
        />
      );

    default:
      return <FiBell className={iconClassName} />;
  }
}