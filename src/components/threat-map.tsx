"use client";

import { useEffect, useRef } from "react";

interface City {
  name: string;
  lat: number;
  lng: number;
}

const CITIES: City[] = [
  { name: "New York", lat: 40.7128, lng: -74.006 },
  { name: "London", lat: 51.5074, lng: -0.1278 },
  { name: "Moscow", lat: 55.7558, lng: 37.6173 },
  { name: "Beijing", lat: 39.9042, lng: 116.4074 },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
  { name: "Sydney", lat: -33.8688, lng: 151.2093 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "Berlin", lat: 52.52, lng: 13.405 },
];

const ATTACK_TYPES = ["SQL Injection", "DDoS", "Port Scan", "Brute Force", "XSS", "DNS Spoofing"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function arcPoints(from: City, to: City, n = 40): [number, number][] {
  const pts: [number, number][] = [];
  const dLat = to.lat - from.lat;
  const dLng = to.lng - from.lng;
  const dist = Math.sqrt(dLat * dLat + dLng * dLng);
  const height = Math.max(dist * 0.35, 6);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const bulge = Math.sin(t * Math.PI) * height;
    pts.push([from.lat + dLat * t + bulge, from.lng + dLng * t]);
  }
  return pts;
}

export function ThreatMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let running = true;
    let cleanup: (() => void) | null = null;

    import("leaflet").then(({ default: L }) => {
      import("leaflet/dist/leaflet.css");

      const container = containerRef.current;
      if (!container) return;

      const map = L.map(container, {
        zoomControl: false,
        attributionControl: false,
        center: [20, 0],
        zoom: 2,
        scrollWheelZoom: false,
        dragging: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 18,
        subdomains: "abcd",
      }).addTo(map);

      interface Attack {
        line: L.Polyline;
        label: L.Marker;
        born: number;
        dash: number;
      }

      const attacks: Attack[] = [];

      function spawn() {
        const src = pick(CITIES);
        let dst = pick(CITIES);
        while (dst === src) dst = pick(CITIES);
        const pts = arcPoints(src, dst);
        const type = pick(ATTACK_TYPES);
        const hue = Math.floor(Math.random() * 360);
        const color = `hsl(${hue}, 80%, 55%)`;

        const line = L.polyline(pts, {
          color,
          weight: 2,
          opacity: 0.9,
          dashArray: "8, 8",
          dashOffset: "0",
        }).addTo(map);

        const mid = pts[Math.floor(pts.length / 2)];
        const label = L.marker(mid, {
          icon: L.divIcon({
            className: "",
            html: `<span style="background:rgba(0,0,0,0.75);color:${color};padding:2px 8px;border-radius:4px;font:11px monospace;white-space:nowrap;border:1px solid ${color};backdrop-filter:blur(2px)">${type}</span>`,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          }),
          interactive: false,
        }).addTo(map);

        attacks.push({ line, label, born: performance.now(), dash: 0 });
        if (attacks.length > 12) {
          const old = attacks.shift()!;
          map.removeLayer(old.line);
          map.removeLayer(old.label);
        }
      }

      function tick() {
        if (!running) return;
        const now = performance.now();
        for (let i = attacks.length - 1; i >= 0; i--) {
          const a = attacks[i];
          const age = now - a.born;
          a.dash -= 0.6;
          a.line.setStyle({ dashOffset: String(a.dash) });
          if (age > 3500) {
            const fade = Math.min((age - 3500) / 1000, 1);
            a.line.setStyle({ opacity: 1 - fade });
            a.label.setOpacity(1 - fade);
            if (fade >= 1) {
              map.removeLayer(a.line);
              map.removeLayer(a.label);
              attacks.splice(i, 1);
            }
          }
        }
        requestAnimationFrame(tick);
      }

      spawn();
      const interval = setInterval(spawn, 3000);
      requestAnimationFrame(tick);

      cleanup = () => {
        running = false;
        clearInterval(interval);
        for (const a of attacks) {
          map.removeLayer(a.line);
          map.removeLayer(a.label);
        }
        attacks.length = 0;
        map.remove();
      };
    });

    return () => { if (cleanup) cleanup(); };
  }, []);

  return (
    <div className="relative rounded-xl border overflow-hidden" style={{ height: 400, width: "100%" }}>
      <div ref={containerRef} className="h-full w-full" />
      <div className="absolute top-3 left-3 z-[1000] bg-black/60 text-white text-xs px-3 py-1.5 rounded-md font-mono tracking-wider border border-white/10 pointer-events-none">
        LIVE THREAT MAP
      </div>
    </div>
  );
}
