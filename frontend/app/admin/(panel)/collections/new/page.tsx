import { CollectionForm } from '@/components/admin/CollectionForm';

export default function NewCollectionPage() {
  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-bold text-text mb-6">New Collection</h1>
      <CollectionForm mode="create" />
    </div>
  );
}
