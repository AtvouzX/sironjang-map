"use client";

import dynamic from "next/dynamic";
import ExploreOutlined from "@mui/icons-material/ExploreOutlined";

// Dynamically import InteractiveMap to disable server-side rendering (SSR)
const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="h-dvh w-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-3xl text-indigo-600 dark:text-indigo-400 relative flex items-center justify-center">
          <ExploreOutlined className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-0 rounded-3xl border-2 border-indigo-500/20 animate-ping"></div>
        </div>
        <div className="space-y-1">
          <h2 className="font-extrabold text-lg tracking-tight">Peta Tematik Pakintelan</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Memuat Peta Interaktif & Sistem Informasi Geografis...</p>
        </div>
        <div className="h-1 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full w-1/2 animate-pulse"></div>
        </div>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="w-full h-full overflow-hidden flex flex-col">
      <InteractiveMap />
    </main>
  );
}

