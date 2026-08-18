import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArticleForm } from "@/components/forms/ArticleForm";
import { Card } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const article = await prisma.article.findUnique({ where: { id: params.id } });
  if (!article) notFound();

  return (
    <Card>
      <h2 className="mb-4 font-semibold text-slate-900">Edit article</h2>
      <ArticleForm article={article} />
    </Card>
  );
}
