import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RecentImport } from "@/lib/dashboard/queries";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-surface-sunken text-ink-faint",
  queued: "bg-surface-sunken text-ink-faint",
  processing: "bg-accent-soft text-accent-deep",
  ready_for_review: "bg-[#FBEFE0] text-mastery",
  approved: "bg-success-soft text-success",
  failed: "bg-danger-soft text-danger",
  archived: "bg-surface-sunken text-ink-faint",
};

function statusLabel(status: string): string {
  return status.replace(/_/g, " ");
}

export function RecentImportsList({ imports }: { imports: RecentImport[] }) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[13.5px] font-semibold text-ink">Recent imports</h3>
        <Link href="/import" className="text-[13px] font-medium text-accent hover:text-accent-deep">
          View all
        </Link>
      </div>

      {imports.length === 0 ? (
        <p className="py-3 text-[13.5px] text-ink-faint">
          Nothing imported yet. Paste an article on the Import Knowledge page to get started.
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {imports.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className="truncate text-[14px] font-medium text-ink">{item.title}</p>
                <p className="mt-0.5 text-[12.5px] text-ink-faint">
                  {new Date(item.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-pill px-2.5 py-0.5 text-[11px] font-semibold capitalize",
                  STATUS_STYLES[item.batchStatus ?? item.status] ?? STATUS_STYLES.draft,
                )}
              >
                {statusLabel(item.batchStatus ?? item.status)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
