import { StoryForm } from '@/components/admin/StoryForm';

export default function NewStoryPage() {
  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-bold text-text mb-6">New Story</h1>
      <StoryForm mode="create" />
    </div>
  );
}
