"use client";

import { useFormState } from "react-dom";
import type { Article } from "@prisma/client";
import { saveArticle } from "@/lib/actions/content";
import { SubmitButton } from "@/components/SubmitButton";
import { Alert, Field } from "@/components/ui";
import { input } from "@/components/forms/styles";

export function ArticleForm({ article }: { article?: Article }) {
  const [state, formAction] = useFormState(saveArticle, {});

  return (
    <form action={formAction} className="space-y-4">
      <Alert error={state.error} />
      {article ? <input type="hidden" name="id" value={article.id} /> : null}
      <Field label="Title">
        <input name="title" defaultValue={article?.title} required className={input} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category">
          <input name="category" defaultValue={article?.category} required className={input} placeholder="Dermatology" />
        </Field>
        <Field label="Slug" hint="Leave blank to generate from the title">
          <input name="slug" defaultValue={article?.slug} className={input} />
        </Field>
      </div>
      <Field label="Cover image URL">
        <input name="coverUrl" defaultValue={article?.coverUrl ?? ""} className={input} />
      </Field>
      <Field label="Excerpt">
        <textarea name="excerpt" rows={2} defaultValue={article?.excerpt} className={input} />
      </Field>
      <Field label="Content" hint="Plain text or markdown-ish paragraphs">
        <textarea name="content" rows={12} defaultValue={article?.content} required className={input} />
      </Field>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="published" defaultChecked={article?.published ?? true} />
        Published
      </label>
      <SubmitButton>{article ? "Update article" : "Publish article"}</SubmitButton>
    </form>
  );
}
