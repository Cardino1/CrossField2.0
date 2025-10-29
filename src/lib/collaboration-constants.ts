export const COLLABORATION_TYPES = [
  "RESEARCH",
  "OPEN_SOURCE_PROJECT",
  "STARTUP_COFOUNDER",
] as const;

export type CollaborationType = (typeof COLLABORATION_TYPES)[number];

export const COLLABORATION_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;

export type CollaborationStatus = (typeof COLLABORATION_STATUSES)[number];

export type CollaborationRecord = {
  id: string;
  type: CollaborationType;
  title: string;
  fullName: string;
  organization: string | null;
  description: string;
  link: string | null;
  status: CollaborationStatus;
  createdAt: Date;
  updatedAt: Date;
};
