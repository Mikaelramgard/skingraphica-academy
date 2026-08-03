"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "./actions";
import { Button } from "@/components/ui/button";

const initialState: LoginState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-[380px] animate-fade-up">
        <div className="mb-10 text-center">
          <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-ink-faint">
            Skingraphica
          </p>
          <h1 className="font-display text-3xl italic text-ink">Academy</h1>
        </div>

        <form action={formAction} className="space-y-3">
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              placeholder="Email"
              className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-[15px] text-ink placeholder:text-ink-faint focus-visible:border-accent"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-[15px] text-ink placeholder:text-ink-faint focus-visible:border-accent"
            />
          </div>

          {state.error ? (
            <p role="alert" className="px-1 text-[13px] text-danger">
              {state.error}
            </p>
          ) : null}

          <Button
            type="submit"
            variant="accent"
            size="md"
            disabled={pending}
            className="w-full"
          >
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
