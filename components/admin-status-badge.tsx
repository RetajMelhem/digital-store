type Status = "PENDING" | "PAID" | "DELIVERED" | "APPROVED" | "HIDDEN";

const styles: Record<Status, string> = {
  PENDING: "border border-amber-300/50 bg-amber-100 text-amber-900 dark:border-amber-500/25 dark:bg-amber-500/15 dark:text-amber-200",
  PAID: "border border-sky-300/50 bg-sky-100 text-sky-900 dark:border-sky-500/25 dark:bg-sky-500/15 dark:text-sky-200",
  DELIVERED: "border border-emerald-300/50 bg-emerald-100 text-emerald-900 dark:border-emerald-500/25 dark:bg-emerald-500/15 dark:text-emerald-200",
  APPROVED: "border border-emerald-300/50 bg-emerald-100 text-emerald-900 dark:border-emerald-500/25 dark:bg-emerald-500/15 dark:text-emerald-200",
  HIDDEN: "border border-line bg-surface-muted text-muted"
};

export function AdminStatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}
