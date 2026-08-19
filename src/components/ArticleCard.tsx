import Image from "next/image";
import Link from "next/link";
import { articleCover } from "@/lib/images";
import { dateOnly } from "@/lib/format";

export type ArticleCardData = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverUrl?: string | null;
  createdAt: Date;
  author?: { name: string };
};

export function ArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group block h-full">
      <article className="card-3d flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
          <Image
            src={articleCover(article, 640, 400)}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
            {article.category}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-semibold text-slate-900 group-hover:text-sky-700">{article.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm text-slate-500">{article.excerpt}</p>
          <p className="mt-4 text-xs text-slate-400">
            {article.author ? `${article.author.name} · ` : ""}
            {dateOnly(article.createdAt)}
          </p>
        </div>
      </article>
    </Link>
  );
}
