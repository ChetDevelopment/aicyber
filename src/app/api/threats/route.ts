import { NextResponse } from "next/server"

const THREAT_TYPES = [
  "SQL Injection attempt",
  "XSS payload detected",
  "Port scan detected",
  "Brute force login",
  "DDoS amplification",
  "DNS tunneling",
  "Malware beaconing",
  "Credential stuffing",
  "SSRF attempt",
  "RCE exploitation",
];

const SOURCES = [
  "185.220.101.x", "103.235.46.x", "45.33.32.x", "91.121.87.x",
  "192.168.1.x", "10.0.0.x", "172.16.0.x", "203.0.113.x",
];

const CITIES = [
  "Moscow", "Beijing", "Pyongyang", "Tehran", "New York",
  "London", "Singapore", "Seoul", "Berlin", "Tokyo",
];

export const dynamic = "force-dynamic";

export async function GET() {
  const threats = Array.from({ length: 8 }, (_, i) => ({
    id: Date.now() + i,
    type: THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)],
    source: SOURCES[Math.floor(Math.random() * SOURCES.length)],
    city: CITIES[Math.floor(Math.random() * CITIES.length)],
    timestamp: new Date(Date.now() - Math.random() * 60000).toISOString(),
    severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)],
  }));

  return NextResponse.json({ threats });
}
