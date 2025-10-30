import { ReactNode } from "react";
import { FiInbox } from "react-icons/fi";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 rounded-lg bg-slate-100 p-5">
        {icon || <FiInbox className="h-10 w-10 text-slate-400" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-950 mb-2">{title}</h3>
      {description && (
        <p className="text-slate-600 max-w-md text-sm mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}
