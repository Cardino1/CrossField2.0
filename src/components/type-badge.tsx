import { CollaborationType } from "@/lib/collaboration-constants";

const typeConfig: Record<CollaborationType, { label: string; className: string }> = {
  RESEARCH: { label: "Research", className: "bg-blue-50 text-blue-600" },
  OPEN_SOURCE_PROJECT: { label: "Open Source Project", className: "bg-purple-50 text-purple-600" },
  STARTUP_COFOUNDER: { label: "Startup Co-Founder", className: "bg-emerald-50 text-emerald-600" },
};

export function TypeBadge({ type }: { type: CollaborationType }) {
  const config = typeConfig[type];
  return <span className={`badge ${config.className}`}>{config.label}</span>;
}
