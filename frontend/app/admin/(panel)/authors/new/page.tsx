import { AuthorForm } from '@/components/admin/AuthorForm';

export default function NewAuthorPage() {
  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-bold text-text mb-6">New Author</h1>
      <AuthorForm mode="create" />
    </div>
  );
}
