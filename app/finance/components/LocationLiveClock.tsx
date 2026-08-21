"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import Clock01Icon from "@hugeicons/core-free-icons/Clock01Icon";

interface LocationTimeState {
  timeStr: string;
  tzAbbr: string;
  cityName: string;
  fullDateStr: string;
  isClient: boolean;
}

function getTimezoneDetails(date: Date): { tzAbbr: string; cityName: string } {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta";
    
    // Map common Indonesian and regional timezones to standard abbreviations
    let tzAbbr = "";
    if (timeZone.includes("Jakarta") || timeZone.includes("Pontianak") || timeZone === "Asia/Bangkok" || timeZone === "Asia/Ho_Chi_Minh") {
      tzAbbr = "WIB";
    } else if (timeZone.includes("Makassar") || timeZone.includes("Ujung_Pandang") || timeZone.includes("Denpasar") || timeZone.includes("Kupang") || timeZone === "Asia/Singapore" || timeZone === "Asia/Kuala_Lumpur") {
      tzAbbr = "WITA";
    } else if (timeZone.includes("Jayapura") || timeZone.includes("Ambon") || timeZone === "Asia/Tokyo") {
      tzAbbr = "WIT";
    } else {
      // Fallback to Intl short timezone name or GMT offset
      const shortFormatter = new Intl.DateTimeFormat("id-ID", {
        timeZoneName: "short",
      });
      const parts = shortFormatter.formatToParts(date);
      const tzPart = parts.find((p) => p.type === "timeZoneName");
      tzAbbr = tzPart ? tzPart.value : "Lokal";
    }

    // Clean city name from timezone identifier (e.g., 'Asia/Jakarta' -> 'Jakarta')
    const rawCity = timeZone.split("/").pop() || "Lokal";
    const cityName = rawCity.replace(/_/g, " ");

    return { tzAbbr, cityName };
  } catch {
    return { tzAbbr: "WIB", cityName: "Jakarta" };
  }
}

export function LocationLiveClock() {
  const [state, setState] = useState<LocationTimeState>({
    timeStr: "--:--:--",
    tzAbbr: "WIB",
    cityName: "Jakarta",
    fullDateStr: "",
    isClient: false,
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const timeStr = `${hours}:${minutes}:${seconds}`;

      const { tzAbbr, cityName } = getTimezoneDetails(now);

      const dateFormatter = new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const fullDateStr = dateFormatter.format(now);

      setState({
        timeStr,
        tzAbbr,
        cityName,
        fullDateStr,
        isClient: true,
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="location-live-clock"
      title={
        state.isClient
          ? `Waktu Lokal: ${state.fullDateStr} ${state.timeStr} · Lokasi/Zona: ${state.cityName} (${state.tzAbbr})`
          : "Sinkronisasi waktu lokal..."
      }
      aria-label="Waktu lokal pengguna berdasarkan lokasi akses"
    >
      <HugeiconsIcon
        className="clock-icon"
        icon={Clock01Icon}
        size={16}
        strokeWidth={1.8}
      />
      <span className="clock-time-value">{state.timeStr}</span>
      <span className="clock-timezone-badge">{state.tzAbbr}</span>
    </div>
  );
}
