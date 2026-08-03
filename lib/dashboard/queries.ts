import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/lib/database.types";

// ---------- Types ----------

export interface NextQuestionData {
  id: string;
  type: Enums<"question_type">;
  difficulty: Enums<"difficulty_level">;
  prompt: string;
  conceptTitle: string;
  topicName: string;
}

export type NextQuestionResult =
  | { kind: "question"; question: NextQuestionData }
  | { kind: "caught_up"; nextDueAt: string | null }
  | { kind: "no_content" };

export interface TodayProgress {
  answered: number;
  accuracy: number | null; // null when nothing answered yet today
}

export interface RecentImport {
  id: string;
  title: string;
  status: Enums<"import_status">;
  createdAt: string;
  batchStatus: Enums<"import_status"> | null;
}

// ---------- Current user ----------

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// ---------- Next question to study ----------

interface DueRow {
  question_id: string;
  due_at: string;
  questions: {
    id: string;
    type: Enums<"question_type">;
    difficulty: Enums<"difficulty_level">;
    prompt: string;
    status: Enums<"content_status">;
    concepts: {
      title: string;
      topics: { name: string } | null;
    } | null;
  } | null;
}

interface ApprovedQuestionRow {
  id: string;
  type: Enums<"question_type">;
  difficulty: Enums<"difficulty_level">;
  prompt: string;
  created_at: string;
  concepts: {
    title: string;
    topics: { name: string } | null;
  } | null;
}

function toNextQuestion(row: {
  id: string;
  type: Enums<"question_type">;
  difficulty: Enums<"difficulty_level">;
  prompt: string;
  concepts: { title: string; topics: { name: string } | null } | null;
}): NextQuestionData {
  return {
    id: row.id,
    type: row.type,
    difficulty: row.difficulty,
    prompt: row.prompt,
    conceptTitle: row.concepts?.title ?? "Untitled concept",
    topicName: row.concepts?.topics?.name ?? "General",
  };
}

export async function getNextQuestion(userId: string): Promise<NextQuestionResult> {
  const supabase = await createClient();

  // 1. Anything already due for review, earliest first.
  const { data: dueRows } = await supabase
    .from("study_state")
    .select(
      "question_id, due_at, questions ( id, type, difficulty, prompt, status, concepts ( title, topics ( name ) ) )",
    )
    .eq("user_id", userId)
    .lte("due_at", new Date().toISOString())
    .order("due_at", { ascending: true })
    .limit(25)
    .returns<DueRow[]>();

  const dueApproved = (dueRows ?? []).find((r) => r.questions?.status === "approved");
  if (dueApproved?.questions) {
    return { kind: "question", question: toNextQuestion(dueApproved.questions) };
  }

  // 2. Approved questions the user has never seen yet.
  const { data: approvedQuestions } = await supabase
    .from("questions")
    .select("id, type, difficulty, prompt, created_at, concepts ( title, topics ( name ) )")
    .eq("status", "approved")
    .order("created_at", { ascending: true })
    .limit(100)
    .returns<ApprovedQuestionRow[]>();

  if (!approvedQuestions || approvedQuestions.length === 0) {
    return { kind: "no_content" };
  }

  const { data: seenStates } = await supabase
    .from("study_state")
    .select("question_id")
    .eq("user_id", userId)
    .returns<{ question_id: string }[]>();

  const seenIds = new Set((seenStates ?? []).map((s) => s.question_id));
  const unseen = approvedQuestions.find((q) => !seenIds.has(q.id));

  if (unseen) {
    return { kind: "question", question: toNextQuestion(unseen) };
  }

  // 3. Nothing due, nothing unseen — fully caught up. Surface the next due date.
  const { data: nextDue } = await supabase
    .from("study_state")
    .select("due_at")
    .eq("user_id", userId)
    .order("due_at", { ascending: true })
    .limit(1)
    .returns<{ due_at: string }[]>()
    .maybeSingle();

  return { kind: "caught_up", nextDueAt: nextDue?.due_at ?? null };
}

// ---------- Today's progress ----------

export async function getTodayProgress(userId: string): Promise<TodayProgress> {
  const supabase = await createClient();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from("study_attempts")
    .select("was_correct")
    .eq("user_id", userId)
    .gte("attempted_at", startOfDay.toISOString())
    .returns<{ was_correct: boolean | null }[]>();

  const rows = data ?? [];
  const answered = rows.length;
  const graded = rows.filter((r) => r.was_correct !== null);
  const correct = graded.filter((r) => r.was_correct === true).length;
  const accuracy = graded.length > 0 ? Math.round((correct / graded.length) * 100) : null;

  return { answered, accuracy };
}

// ---------- Streak ----------
// A session counts for a calendar day once 10+ questions were answered that day.
// The streak is the number of consecutive qualifying days, walking back from today.
// If today hasn't reached 10 yet, that's not a broken streak — just not extended yet —
// so we check from yesterday backward in that case.

export async function getStreak(userId: string): Promise<number> {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - 120);

  const { data } = await supabase
    .from("study_attempts")
    .select("attempted_at")
    .eq("user_id", userId)
    .gte("attempted_at", since.toISOString())
    .returns<{ attempted_at: string }[]>();

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    const day = new Date(row.attempted_at).toISOString().slice(0, 10);
    counts.set(day, (counts.get(day) ?? 0) + 1);
  }

  const qualifyingDays = new Set(
    [...counts.entries()].filter(([, count]) => count >= 10).map(([day]) => day),
  );

  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);

  const todayKey = cursor.toISOString().slice(0, 10);
  if (!qualifyingDays.has(todayKey)) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  let streak = 0;
  while (qualifyingDays.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
}

// ---------- Recent imports ----------

interface SourceDocumentRow {
  id: string;
  title: string;
  status: Enums<"import_status">;
  created_at: string;
  import_batches: { status: Enums<"import_status"> }[] | null;
}

export async function getRecentImports(userId: string): Promise<RecentImport[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("source_documents")
    .select("id, title, status, created_at, import_batches ( status )")
    .eq("created_by", userId)
    .order("created_at", { ascending: false })
    .limit(5)
    .returns<SourceDocumentRow[]>();

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    createdAt: row.created_at,
    batchStatus: row.import_batches?.[0]?.status ?? null,
  }));
}
ort "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/lib/database.types";

// ---------- Types ----------

export interface NextQuestionData {
  id: string;
  type: Enums<"question_type">;
  difficulty: Enums<"difficulty_level">;
  prompt: string;
  conceptTitle: string;
  topicName: string;
}

export type NextQuestionResult =
  | { kind: "question"; question: NextQuestionData }
  | { kind: "caught_up"; nextDueAt: string | null }
  | { kind: "no_content" };

export interface TodayProgress {
  answered: number;
  accuracy: number | null; // null when nothing answered yet today
}

export interface RecentImport {
  id: string;
  title: string;
  status: Enums<"import_status">;
  createdAt: string;
  batchStatus: Enums<"import_status"> | null;
}

// ---------- Current user ----------

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// ---------- Next question to study ----------

interface DueRow {
  question_id: string;
  due_at: string;
  questions: {
    id: string;
    type: Enums<"question_type">;
    difficulty: Enums<"difficulty_level">;
    prompt: string;
    status: Enums<"content_status">;
    concepts: {
      title: string;
      topics: { name: string } | null;
    } | null;
  } | null;
}

interface ApprovedQuestionRow {
  id: string;
  type: Enums<"question_type">;
  difficulty: Enums<"difficulty_level">;
  prompt: string;
  created_at: string;
  concepts: {
    title: string;
    topics: { name: string } | null;
  } | null;
}

function toNextQuestion(row: {
  id: string;
  type: Enums<"question_type">;
  difficulty: Enums<"difficulty_level">;
  prompt: string;
  concepts: { title: string; topics: { name: string } | null } | null;
}): NextQuestionData {
  return {
    id: row.id,
    type: row.type,
    difficulty: row.difficulty,
    prompt: row.prompt,
    conceptTitle: row.concepts?.title ?? "Untitled concept",
    topicName: row.concepts?.topics?.name ?? "General",
  };
}

export async function getNextQuestion(userId: string): Promise<NextQuestionResult> {
  const supabase = await createClient();

  // 1. Anything already due for review, earliest first.
  const { data: dueRows } = await supabase
    .from("study_state")
    .select(
      "question_id, due_at, questions ( id, type, difficulty, prompt, status, concepts ( title, topics ( name ) ) )",
    )
    .eq("user_id", userId)
    .lte("due_at", new Date().toISOString())
    .order("due_at", { ascending: true })
    .limit(25)
    .returns<DueRow[]>();

  const dueApproved = (dueRows ?? []).find((r) => r.questions?.status === "approved");
  if (dueApproved?.questions) {
    return { kind: "question", question: toNextQuestion(dueApproved.questions) };
  }

  // 2. Approved questions the user has never seen yet.
  const { data: approvedQuestions } = await supabase
    .from("questions")
    .select("id, type, difficulty, prompt, created_at, concepts ( title, topics ( name ) )")
    .eq("status", "approved")
    .order("created_at", { ascending: true })
    .limit(100)
    .returns<ApprovedQuestionRow[]>();

  if (!approvedQuestions || approvedQuestions.length === 0) {
    return { kind: "no_content" };
  }

  const { data: seenStates } = await supabase
    .from("study_state")
    .select("question_id")
    .eq("user_id", userId);

  const seenIds = new Set((seenStates ?? []).map((s) => s.question_id));
  const unseen = approvedQuestions.find((q) => !seenIds.has(q.id));

  if (unseen) {
    return { kind: "question", question: toNextQuestion(unseen) };
  }

  // 3. Nothing due, nothing unseen — fully caught up. Surface the next due date.
  const { data: nextDue } = await supabase
    .from("study_state")
    .select("due_at")
    .eq("user_id", userId)
    .order("due_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return { kind: "caught_up", nextDueAt: nextDue?.due_at ?? null };
}

// ---------- Today's progress ----------

export async function getTodayProgress(userId: string): Promise<TodayProgress> {
  const supabase = await createClient();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from("study_attempts")
    .select("was_correct")
    .eq("user_id", userId)
    .gte("attempted_at", startOfDay.toISOString());

  const rows = data ?? [];
  const answered = rows.length;
  const graded = rows.filter((r) => r.was_correct !== null);
  const correct = graded.filter((r) => r.was_correct === true).length;
  const accuracy = graded.length > 0 ? Math.round((correct / graded.length) * 100) : null;

  return { answered, accuracy };
}

// ---------- Streak ----------
// A session counts for a calendar day once 10+ questions were answered that day.
// The streak is the number of consecutive qualifying days, walking back from today.
// If today hasn't reached 10 yet, that's not a broken streak — just not extended yet —
// so we check from yesterday backward in that case.

export async function getStreak(userId: string): Promise<number> {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - 120);

  const { data } = await supabase
    .from("study_attempts")
    .select("attempted_at")
    .eq("user_id", userId)
    .gte("attempted_at", since.toISOString());

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    const day = new Date(row.attempted_at).toISOString().slice(0, 10);
    counts.set(day, (counts.get(day) ?? 0) + 1);
  }

  const qualifyingDays = new Set(
    [...counts.entries()].filter(([, count]) => count >= 10).map(([day]) => day),
  );

  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);

  const todayKey = cursor.toISOString().slice(0, 10);
  if (!qualifyingDays.has(todayKey)) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  let streak = 0;
  while (qualifyingDays.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
}

// ---------- Recent imports ----------

interface SourceDocumentRow {
  id: string;
  title: string;
  status: Enums<"import_status">;
  created_at: string;
  import_batches: { status: Enums<"import_status"> }[] | null;
}

export async function getRecentImports(userId: string): Promise<RecentImport[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("source_documents")
    .select("id, title, status, created_at, import_batches ( status )")
    .eq("created_by", userId)
    .order("created_at", { ascending: false })
    .limit(5)
    .returns<SourceDocumentRow[]>();

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    createdAt: row.created_at,
    batchStatus: row.import_batches?.[0]?.status ?? null,
  }));
}
