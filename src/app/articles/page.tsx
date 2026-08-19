import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/ArticleCard";
import { Empty } from "@/components/ui";
import { IMAGES, photo } from "@/lib/images";

export const dynamic = "force-dynamic";

export default async function ArticlesPage({ searchParams }: { searchParams: { category?: string } }) {
  const articles = await prisma.article.findMany({
    where: { published: true, ...(searchParams.category ? { category: searchParams.category } : {}) },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const categories = Array.from(
    new Set(
      (await prisma.article.findMany({ where: { published: true }, select: { category: true } })).map(
        (a) => a.category
      )
    )
  ).sort();

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-5 py-9 text-white shadow-xl sm:px-8 sm:py-12">
        <Image
          src={photo(IMAGES.heroConsultation, 1400, 500)}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-sky-700/50" />
        <div className="relative">
          <h1 className="text-2xl font-bold sm:text-3xl">Health library</h1>
          <p className="mt-2 max-w-xl text-sm text-sky-50/90">
            Articles and blogs written and reviewed by our doctors — nutrition, fitness, skin, mental
            health and more.
          </p>
        </div>
      </section>

      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 text-sm">
        <Link
          href="/articles"
          className={`whitespace-nowrap rounded-full px-4 py-2 transition ${
            !searchParams.category
              ? "bg-sky-600 text-white shadow-md shadow-sky-600/25"
              : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300"
          }`}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category}
            href={`/articles?category=${encodeURIComponent(category)}`}
            className={`whitespace-nowrap rounded-full px-4 py-2 transition ${
              searchParams.category === category
                ? "bg-sky-600 text-white shadow-md shadow-sky-600/25"
                : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300"
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
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
