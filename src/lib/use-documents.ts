"use client";

import { useEffect, useState } from "react";
import { db, listDocuments, seedDocuments } from "@/lib/db";
import { ARTICLE_PAIRS } from "@/data/articles";
import type { LearningLanguage, ReadingDocument } from "@/lib/types";

export function useDocuments(language: LearningLanguage) {
  const [documents, setDocuments] = useState<ReadingDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      await seedDocuments(ARTICLE_PAIRS);
      const docs = await listDocuments(language);
      if (active) {
        setDocuments(docs);
        setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [language]);

  return { documents, loading, refresh: async () => setDocuments(await listDocuments(language)) };
}

export function useDocument(id: string) {
  const [document, setDocument] = useState<ReadingDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void seedDocuments(ARTICLE_PAIRS).then(async () => {
      const doc = await db.documents.get(id);
      if (active) {
        setDocument(doc ?? null);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [id]);

  return { document, loading };
}
