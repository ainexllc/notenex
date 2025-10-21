import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Archive, Clock4, History, Undo2 } from "lucide-react";

export default function ArchivePage() {
  return (
    <AppShell>
      <div className="space-y-10">
        <PagePlaceholder
          icon={Archive}
          title="Shelf notes without losing context"
          description="Keep your workspace lean by archiving completed notes. Retrieve anything in seconds with global search."
          actions={
            <Link
              href="/workspace"
              className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-2 text-sm font-semibold text-ink-50 shadow-sm transition hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-500"
            >
              Back to board
            </Link>
          }
        >
          <div className="grid gap-5 text-left sm:grid-cols-3">
            <div className="rounded-3xl border border-outline-subtle/60 bg-white/80 px-6 py-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-800">
                <Clock4 className="h-4 w-4 text-accent-600" aria-hidden />
                Auto-expiring shelves
              </h2>
              <p className="mt-2 text-sm text-muted">
                Notes resurface automatically if you set a revisit cadence or reminder.
              </p>
            </div>
            <div className="rounded-3xl border border-outline-subtle/60 bg-white/80 px-6 py-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-800">
                <Undo2 className="h-4 w-4 text-accent-600" aria-hidden />
                One-tap restore
              </h2>
              <p className="mt-2 text-sm text-muted">
                Send archived notes back to the active board with all labels intact.
              </p>
            </div>
            <div className="rounded-3xl border border-outline-subtle/60 bg-white/80 px-6 py-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-800">
                <History className="h-4 w-4 text-accent-600" aria-hidden />
                Timeline history
              </h2>
              <p className="mt-2 text-sm text-muted">
                See when a note was archived, restored, or shared with collaborators.
              </p>
            </div>
          </div>
        </PagePlaceholder>
      </div>
    </AppShell>
  );
}
