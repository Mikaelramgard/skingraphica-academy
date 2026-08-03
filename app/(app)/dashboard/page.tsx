import { redirect } from "next/navigation";
import {
  getCurrentUser,
  getNextQuestion,
  getTodayProgress,
  getStreak,
  getRecentImports,
} from "@/lib/dashboard/queries";
import { ContinueLearningCard } from "@/components/dashboard/continue-learning-card";
import { StatTile } from "@/components/dashboard/stat-tile";
import { MasteryRing } from "@/components/dashboard/mastery-ring";
import { RecentImportsList } from "@/components/dashboard/recent-imports-list";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [nextQuestion, todayProgress, streak, recentImports] = await Promise.all([
    getNextQuestion(user.id),
    getTodayProgress(user.id),
    getStreak(user.id),
    getRecentImports(user.id),
  ]);

  const streakRingProgress = Math.min(100, (streak / 7) * 100);

  return (
    <div className="space-y-8">
      <header className="animate-fade-up">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink-faint">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="mt-1.5 font-display text-[32px] italic leading-tight text-ink">
          Welcome back.
        </h1>
      </header>

      <section className="animate-fade-up" style={{ animationDelay: "60ms" }}>
        <ContinueLearningCard result={nextQuestion} />
      </section>

      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-3 animate-fade-up"
        style={{ animationDelay: "120ms" }}
      >
        <StatTile label="Questions today" value={String(todayProgress.answered)} />
        <StatTile
          label="Accuracy today"
          value={todayProgress.accuracy !== null ? `${todayProgress.accuracy}%` : "—"}
        />
        <StatTile
          label="Current streak"
          value={`${streak}`}
          sublabel={streak === 1 ? "day" : "days"}
        >
          <MasteryRing progress={streakRingProgress} size={56} strokeWidth={4} tone="mastery">
            <span className="font-mono text-[13px] font-semibold text-mastery">{streak}</span>
          </MasteryRing>
        </StatTile>
      </section>

      <section className="animate-fade-up" style={{ animationDelay: "180ms" }}>
        <RecentImportsList imports={recentImports} />
      </section>
    </div>
  );
}
