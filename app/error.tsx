"use client";

import { useEffect } from "react";

interface ErrorStateProps {
  error: Error & { digest?: string };
}

export default function ErrorState({ error }: ErrorStateProps) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div className="flex h-[70vh] w-full flex-col items-center justify-center">
      <h1>Uh Oh</h1>
      <p>Something went wrong!</p>
    </div>
  );
}
