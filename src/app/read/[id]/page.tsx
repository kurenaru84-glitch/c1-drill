"use client";

import Link from "next/link";
import { use } from "react";
import { ReaderView } from "@/components/ReaderView";
import { useDocument } from "@/lib/use-documents";

export default function ReadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { document, loading } = useDocument(id);

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="text-sm text-stone-500">読み込み中…</p>
      </main>
    );
  }

  if (!document) {
    return (
      <main className="mx-auto max-w-lg px-4 py-8 text-center">
        <p className="text-stone-600">文章が見つかりませんでした。</p>
        <Link href="/" className="mt-4 inline-block text-teal-700">
          ホームに戻る
        </Link>
      </main>
    );
  }

  return <ReaderView document={document} />;
}
