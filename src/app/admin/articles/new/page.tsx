import { ArticleForm } from "@/components/forms/ArticleForm";
import { Card } from "@/components/ui";

export default function NewArticlePage() {
  return (
    <Card>
      <h2 className="mb-4 font-semibold text-slate-900">New article</h2>
      <ArticleForm />
    </Card>
  );
}
