import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteArticle } from "@/lib/actions/content";
import { SubmitButton } from "@/components/SubmitButton";
import { Badge, Card, Empty } from "@/components/ui";
import { dateOnly } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">Articles &amp; blogs</h2>
        <Link href="/admin/articles/new" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">
          New article
        </Link>
      </div>

      {articles.length === 0 ? (
        <Empty>No articles yet.</Empty>
      ) : (
        <ul className="divide-y divide-slate-100">
          {articles.map((article) => (
            <li key={article.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
              <div>
                <p className="font-medium text-slate-800">{article.title}</p>
                <p className="text-slate-500">
                  {article.category} · {article.author.name} · {dateOnly(article.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={article.published ? "green" : "amber"}>{article.published ? "PUBLISHED" : "DRAFT"}</Badge>
                <Link href={`/articles/${article.slug}`} className="rounded-lg border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-50">
                  View
                </Link>
                <Link href={`/admin/articles/${article.id}`} className="rounded-lg border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-50">
                  Edit
                </Link>
                <form action={deleteArticle}>
                  <input type="hidden" name="id" value={article.id} />
                  <SubmitButton variant="danger">Delete</SubmitButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
