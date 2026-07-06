"use client";

import { useEffect, useRef } from "react";

interface Attack {
  x: number; y: number; targetX: number; targetY: number;
  progress: number; speed: number; color: string; label: string;
}

const CITIES = [
  { name: "New York", x: 0.8, y: 0.35, color: "#ef4444" },
  { name: "London", x: 0.52, y: 0.28, color: "#f97316" },
  { name: "Moscow", x: 0.6, y: 0.22, color: "#e11d48" },
  { name: "Shanghai", x: 0.85, y: 0.3, color: "#a855f7" },
  { name: "Tokyo", x: 0.9, y: 0.35, color: "#3b82f6" },
  { name: "Sydney", x: 0.9, y: 0.7, color: "#06b6d4" },
  { name: "São Paulo", x: 0.72, y: 0.75, color: "#10b981" },
  { name: "Dubai", x: 0.65, y: 0.38, color: "#f59e0b" },
  { name: "Singapore", x: 0.82, y: 0.48, color: "#ec4899" },
  { name: "Lagos", x: 0.55, y: 0.55, color: "#8b5cf6" },
];

const ATTACK_LABELS = ["DDoS", "Brute Force", "SQLi", "Phishing", "Malware", "Ransomware", "Port Scan", "Credential Stuffing"];

export function ThreatMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const attacksRef = useRef<Attack[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    let frame = 0;

    const animate = () => {
      frame++;
      if (frame % 30 === 0) {
        const src = CITIES[Math.floor(Math.random() * CITIES.length)];
        const dst = CITIES[Math.floor(Math.random() * CITIES.length)];
        if (src !== dst) {
          attacksRef.current.push({
            x: src.x, y: src.y, targetX: dst.x, targetY: dst.y,
            progress: 0, speed: 0.008 + Math.random() * 0.012,
            color: src.color,
            label: ATTACK_LABELS[Math.floor(Math.random() * ATTACK_LABELS.length)],
          });
        }
      }

      attacksRef.current = attacksRef.current.filter(a => a.progress < 1);

      ctx.clearRect(0, 0, w / 2, h / 2);

      // Grid
      ctx.strokeStyle = "rgba(100, 116, 139, 0.08)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 20; i++) {
        ctx.beginPath(); ctx.moveTo(i * (w / 2 / 20), 0); ctx.lineTo(i * (w / 2 / 20), h / 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * (h / 2 / 12)); ctx.lineTo(w / 2, i * (h / 2 / 12)); ctx.stroke();
      }

      // Cities
      for (const city of CITIES) {
        const cx = city.x * (w / 2 - 20) + 10;
        const cy = city.y * (h / 2 - 20) + 10;
        ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fillStyle = city.color; ctx.fill();
        ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fillStyle = city.color + "20"; ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = "6px Inter, sans-serif"; ctx.textAlign = "center";
        ctx.fillText(city.name, cx, cy + 13);
      }

      // Attacks
      for (const attack of attacksRef.current) {
        attack.progress += attack.speed;
        const ax = (attack.x + (attack.targetX - attack.x) * attack.progress) * (w / 2 - 20) + 10;
        const ay = (attack.y + (attack.targetY - attack.y) * attack.progress) * (h / 2 - 20) + 10;

        ctx.beginPath(); ctx.moveTo(attack.x * (w / 2 - 20) + 10, attack.y * (h / 2 - 20) + 10);
        ctx.lineTo(ax, ay);
        ctx.strokeStyle = attack.color + "40";
        ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.stroke(); ctx.setLineDash([]);

        ctx.beginPath(); ctx.arc(ax, ay, 2, 0, Math.PI * 2);
        ctx.fillStyle = attack.color;
        ctx.fill();

        if (attack.progress > 0.5) {
          ctx.fillStyle = attack.color + "80";
          ctx.font = "5px Inter, sans-serif"; ctx.textAlign = "left";
          ctx.fillText(attack.label, ax + 4, ay + 2);
        }
      }

      requestAnimationFrame(animate);
    };

    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <canvas ref={canvasRef} className="h-full w-full rounded-xl" style={{ background: "transparent" }} />
  );
}
