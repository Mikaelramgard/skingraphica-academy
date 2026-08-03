import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import type { NextQuestionResult } from "@/lib/dashboard/queries";
import { cn } from "@/lib/utils";

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: "bg-success-soft text-success",
  medium: "bg-accent-soft text-accent-deep",
  advanced: "bg-[#FBEFE0] text-mastery",
  mastery: "bg-[#F3E8F5] text-[#8A3FA0]",
};

function formatRelativeDue(iso: string): string {
  const due = new Date(iso);
  const diffMs = due.getTime() - Date.now();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  if (diffHours <= 0) return "now";
  if (diffHours < 24) return `in ${diffHours}h`;
  const diffDays = Math.round(diffHours / 24);
  return `in ${diffDays} day${diffDays === 1 ? "" : "s"}`;
}

export function ContinueLearningCard({ result }: { result: NextQuestionResult }) {
  if (result.kind === "no_content") {
    return (
      <Card className="p-9">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink-faint">
          Get started
        </p>
        <h2 className="mt-3 max-w-md font-display text-[26px] italic leading-tight text-ink">
          Nothing to study yet — import your first source.
        </h2>
        <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-ink-soft">
          Paste an article on the Import Knowledge page and questions will appear here once
          they're approved.
        </p>
        <Link href="/import" className={cn(buttonVariants({ variant: "accent", size: "md" }), "mt-6")}>
          Import Knowledge →
        </Link>
      </Card>
    );
  }

  if (result.kind === "caught_up") {
    return (
      <Card className="p-9">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink-faint">
          All caught up
        </p>
        <h2 className="mt-3 max-w-md font-display text-[26px] italic leading-tight text-ink">
          You're through everything that's due.
        </h2>
        <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-ink-soft">
          {result.nextDueAt
            ? `Your next review comes up ${formatRelativeDue(result.nextDueAt)}.`
            : "Add more approved questions to keep building your streak."}
        </p>
      </Card>
    );
  }

  const { question } = result;

  return (
    <Card className="p-9">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "rounded-pill px-2.5 py-0.5 text-[11px] font-semibold capitalize",
            DIFFICULTY_STYLES[question.difficulty],
          )}
        >
          {question.difficulty}
        </span>
        <span className="text-[13px] text-ink-faint">
          {question.topicName} · {question.conceptTitle}
        </span>
      </div>

      <h2 className="mt-4 max-w-lg font-display text-[26px] italic leading-tight text-ink">
        Continue where you left off.
      </h2>
      <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-ink-soft line-clamp-2">
        {question.prompt}
      </p>

      <Link href="/study" className={cn(buttonVariants({ variant: "accent", size: "lg" }), "mt-7")}>
        Continue Learning →
      </Link>
    </Card>
  );
}
