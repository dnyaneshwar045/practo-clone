import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { dateOnly } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findFirst({
    where: { slug: params.slug, published: true },
    include: { author: { select: { name: true } } },
  });

  if (!article) notFound();

  const related = await prisma.article.findMany({
    where: { published: true, category: article.category, NOT: { id: article.id } },
    take: 3,
  });

  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/articles" className="text-sm text-sky-700 hover:underline">
        ← Back to health library
      </Link>

      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-sky-700">{article.category}</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">{article.title}</h1>
      <p className="mt-2 text-sm text-slate-500">
        By {article.author.name} · {dateOnly(article.createdAt)}
      </p>

      <div className="mt-8 space-y-4 text-[15px] leading-7 text-slate-700">
        {article.content.split("\n").filter(Boolean).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {related.length > 0 ? (
        <div className="mt-12 border-t border-slate-200 pt-6">
          <h2 className="font-semibold text-slate-900">More on {article.category}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {related.map((item) => (
              <li key={item.id}>
                <Link href={`/articles/${item.slug}`} className="text-sky-700 hover:underline">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
