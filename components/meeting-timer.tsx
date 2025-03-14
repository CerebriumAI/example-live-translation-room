"use client";

import { useEffect, useState } from "react";
import { useRoomStore } from "@/lib/store";

export function MeetingTimer() {
  const startTime = useRoomStore((state) => state.meetingStartTime);
  const [elapsed, setElapsed] = useState("00:00:00");

  useEffect(() => {
    if (!startTime) return;

    const updateTimer = () => {
      const now = new Date();
      const diff = now.getTime() - startTime.getTime();

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setElapsed(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="font-mono text-sm text-muted-foreground">{elapsed}</div>
  );
}
