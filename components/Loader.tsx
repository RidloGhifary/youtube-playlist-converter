"use client";

import { PuffLoader } from "react-spinners";

export default function Loader() {
  return (
    <div className="flex h-[70vh] w-full flex-col items-center justify-center">
      <PuffLoader color="red" size={100} />
    </div>
  );
}
