import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, Empty, SectionTitle } from "@/components/ui";
import { dateOnly } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ArticlesPage({ searchParams }: { searchParams: { category?: string } }) {
  const articles = await prisma.article.findMany({
    where: { published: true, ...(searchParams.category ? { category: searchParams.category } : {}) },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const categories = Array.from(
    new Set((await prisma.article.findMany({ where: { published: true }, select: { category: true } })).map((a) => a.category))
  ).sort();

  return (
    <div className="space-y-6">
      <SectionTitle title="Health library" subtitle="Articles and blogs reviewed by our doctors" />

      <div className="flex flex-wrap gap-2 text-sm">
        <Link
          href="/articles"
          className={`rounded-full px-3 py-1.5 ${!searchParams.category ? "bg-sky-600 text-white" : "bg-white text-slate-600 border border-slate-200"}`}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category}
            href={`/articles?category=${encodeURIComponent(category)}`}
            className={`rounded-full px-3 py-1.5 ${
              searchParams.category === category ? "bg-sky-600 text-white" : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            {category}
          </Link>
        ))}
      </div>

      {articles.length === 0 ? (
        <Empty>No articles published yet.</Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`}>
              <Card className="h-full transition hover:border-sky-400">
                <p className="text-xs font-medium uppercase tracking-wide text-sky-700">{article.category}</p>
                <h2 className="mt-1 font-semibold text-slate-900">{article.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-slate-500">{article.excerpt}</p>
                <p className="mt-3 text-xs text-slate-400">
                  {article.author.name} · {dateOnly(article.createdAt)}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
