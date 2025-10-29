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
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 p-6 ring-1 ring-slate-200/50">
        {icon || <FiInbox className="h-12 w-12 text-slate-400" />}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      {description && (
        <p className="text-slate-600 max-w-md mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}
