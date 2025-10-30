import { CollaborationType } from "@prisma/client";

const typeConfig: Record<CollaborationType, { label: string }> = {
  RESEARCH: { 
    label: "Research"
  },
  OPEN_SOURCE_PROJECT: { 
    label: "Open Source"
  },
  STARTUP_COFOUNDER: { 
    label: "Co-Founder"
  },
};

export function TypeBadge({ type }: { type: CollaborationType }) {
  const config = typeConfig[type];
  return (
    <span className="badge-soft">
      {config.label}
    </span>
  );
}
