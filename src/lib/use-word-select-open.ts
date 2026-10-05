"use client";

import { useEffect, useState } from "react";

function readWordSelectOpen() {
  if (typeof document === "undefined") return false;
  return document.body.dataset.wordSelectOpen === "1";
}

export function useWordSelectOpen() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(readWordSelectOpen());
    const observer = new MutationObserver(() => setOpen(readWordSelectOpen()));
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-word-select-open"] });
    return () => observer.disconnect();
  }, []);

  return open;
}
