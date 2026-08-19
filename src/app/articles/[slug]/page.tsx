import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { dateOnly } from "@/lib/format";
import { articleCover } from "@/lib/images";

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

      <div className="relative mt-6 h-56 overflow-hidden rounded-3xl shadow-lg sm:h-80">
        <Image
          src={articleCover(article, 1200, 700)}
          alt={article.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>

      <p className="mt-6 rounded-2xl border-l-4 border-sky-500 bg-white/80 px-4 py-3 text-[15px] italic text-slate-600">
        {article.excerpt}
      </p>

      <div className="mt-8 space-y-4 text-[15px] leading-7 text-slate-700">
        {article.content.split("\n").filter(Boolean).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {related.length > 0 ? (
        <div className="mt-12 border-t border-slate-200 pt-6">
          <h2 className="font-semibold text-slate-900">More on {article.category}</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-3">
            {related.map((item) => (
              <li key={item.id}>
                <Link href={`/articles/${item.slug}`} className="group block">
                  <span className="relative block h-24 overflow-hidden rounded-xl">
                    <Image
                      src={articleCover(item, 400, 260)}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </span>
                  <span className="mt-2 block text-sm font-medium text-slate-700 group-hover:text-sky-700">
                    {item.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
