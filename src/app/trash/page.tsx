import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Clock, Recycle, Trash2, Undo } from "lucide-react";

export default function TrashPage() {
  return (
    <AppShell>
      <div className="space-y-10">
        <PagePlaceholder
          icon={Trash2}
          title="Review and restore"
          description="Notes stay in the trash for 30 days before permanent deletion. Restore mistakes instantly or clear space with confidence."
          actions={
            <>
              <Link
                href="/workspace"
                className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-2 text-sm font-semibold text-ink-50 shadow-sm transition hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-500"
              >
                Back to notes
              </Link>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-outline-subtle px-5 py-2 text-sm font-medium text-danger transition hover:border-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-danger"
              >
                Empty trash
              </button>
            </>
          }
        >
          <div className="grid gap-5 text-left sm:grid-cols-3">
            <div className="rounded-3xl border border-outline-subtle/60 bg-white/80 px-6 py-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-800">
                <Undo className="h-4 w-4 text-accent-600" aria-hidden />
                One-click restore
              </h2>
              <p className="mt-2 text-sm text-muted">
                Send notes back to their original labels and pinned status instantly.
              </p>
            </div>
            <div className="rounded-3xl border border-outline-subtle/60 bg-white/80 px-6 py-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-800">
                <Clock className="h-4 w-4 text-accent-600" aria-hidden />
                Retention timer
              </h2>
              <p className="mt-2 text-sm text-muted">
                Track how many days remain before a note is permanently removed.
              </p>
            </div>
            <div className="rounded-3xl border border-outline-subtle/60 bg-white/80 px-6 py-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-800">
                <Recycle className="h-4 w-4 text-accent-600" aria-hidden />
                Bulk cleanup
              </h2>
              <p className="mt-2 text-sm text-muted">
                Select and delete multiple notes at once to keep storage tidy.
              </p>
            </div>
          </div>
        </PagePlaceholder>
      </div>
    </AppShell>
  );
}
