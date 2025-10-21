"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { LandingPage } from "@/components/marketing/landing-page";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/workspace");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#050505] text-gray-200">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500/10">
          <Loader2 className="h-6 w-6 animate-spin text-orange-400" />
        </span>
        <p className="text-sm text-gray-400">Booting up your workspace…</p>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#050505] text-gray-200">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500/10">
          <Loader2 className="h-6 w-6 animate-spin text-orange-400" />
        </span>
        <p className="text-sm text-gray-400">Redirecting to your workspace…</p>
      </div>
    );
  }

  return <LandingPage />;
}
