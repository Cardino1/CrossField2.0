import { CollaborationType } from "@prisma/client";
import { FiCode, FiCpu, FiUsers } from "react-icons/fi";

const typeConfig: Record<CollaborationType, { label: string; className: string; icon: React.ElementType }> = {
  RESEARCH: { 
    label: "Research", 
    className: "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 ring-1 ring-blue-200/50",
    icon: FiCpu 
  },
  OPEN_SOURCE_PROJECT: { 
    label: "Open Source", 
    className: "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 ring-1 ring-purple-200/50",
    icon: FiCode 
  },
  STARTUP_COFOUNDER: { 
    label: "Co-Founder", 
    className: "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 ring-1 ring-emerald-200/50",
    icon: FiUsers 
  },
};

export function TypeBadge({ type }: { type: CollaborationType }) {
  const config = typeConfig[type];
  const Icon = config.icon;
  return (
    <span className={`badge ${config.className}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
