"use client";

import { useEffect } from "react";

const TRACK_KEY = "cyberai_visitors";

export function VisitorTrack() {
  useEffect(() => {
    const tracked = sessionStorage.getItem("cyberai_tracked");
    if (tracked) return;
    sessionStorage.setItem("cyberai_tracked", "true");

    fetch("https://ip-api.com/json/?fields=country,city,query")
      .then(r => r.json())
      .then(data => {
        const entry = { country: data.country || "Unknown", city: data.city || "", ip: data.query || "", time: Date.now() };
        try {
          const existing = JSON.parse(localStorage.getItem(TRACK_KEY) || "[]");
          existing.push(entry);
          if (existing.length > 500) existing.splice(0, existing.length - 500);
          localStorage.setItem(TRACK_KEY, JSON.stringify(existing));
        } catch {}
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        }).catch(() => {});
      })
      .catch(() => {});
  }, []);

  return null;
}
