"use client";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import SlideOverPanel from "./SlideOverPanel";

function PanelManagerInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const featureSlug = searchParams.get("feature");
  const usecaseSlug = searchParams.get("usecase");

  function closePanel() {
    router.push("/", { scroll: false });
  }

  return (
    <AnimatePresence>
      {featureSlug && (
        <SlideOverPanel
          key={`feature-${featureSlug}`}
          type="feature"
          slug={featureSlug}
          onClose={closePanel}
        />
      )}
      {usecaseSlug && (
        <SlideOverPanel
          key={`usecase-${usecaseSlug}`}
          type="usecase"
          slug={usecaseSlug}
          onClose={closePanel}
        />
      )}
    </AnimatePresence>
  );
}

// Wraps inner component in Suspense so page.tsx stays a Server Component
export default function PanelManager() {
  return (
    <Suspense fallback={null}>
      <PanelManagerInner />
    </Suspense>
  );
}
