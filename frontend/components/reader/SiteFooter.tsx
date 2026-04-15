import Link from 'next/link';

interface FooterData {
  tags?: { name: string; slug: string }[];
  collections?: { title: string; slug: string }[];
}

async function getFooterData(): Promise<FooterData> {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const [tagsRes, collectionsRes] = await Promise.all([
      fetch(`${API}/tags`, { next: { revalidate: 3600 } }),
      fetch(`${API}/collections?limit=8`, { next: { revalidate: 3600 } }),
    ]);
    const [tags, collections] = await Promise.all([tagsRes.json(), collectionsRes.json()]);
    return {
      tags: tags.data?.slice(0, 12) || [],
      collections: collections.data || [],
    };
  } catch {
    return {};
  }
}

export async function SiteFooter() {
  const { tags, collections } = await getFooterData();

  return (
    <footer style={{ backgroundColor: '#EDE7D9' }} className="border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <Link href="/" className="font-serif italic text-lg font-bold text-text block mb-3">
              Kayd
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed">
              Preserving Somali short stories and literary works. Read freely, explore deeply.
            </p>
          </div>

          {/* Collections */}
          {collections && collections.length > 0 && (
            <div>
              <h3 className="text-xs font-medium uppercase tracking-widest text-text-secondary mb-3">
                Collections
              </h3>
              <ul className="space-y-1.5">
                {collections.map((col) => (
                  <li key={col.slug}>
                    <Link
                      href={`/collections/${col.slug}`}
                      className="text-sm text-text-secondary hover:text-text transition-colors"
                    >
                      {col.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/collections" className="text-sm text-terracotta hover:underline">
                    All collections →
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div>
              <h3 className="text-xs font-medium uppercase tracking-widest text-text-secondary mb-3">
                Browse by Tag
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/stories?tag=${tag.slug}`}
                    className="text-xs px-2.5 py-1 rounded-full border border-border text-text-secondary hover:border-terracotta hover:text-terracotta transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Kayd Archive
          </p>
          <div className="flex items-center gap-4">
            <Link href="/stories" className="text-xs text-muted hover:text-text transition-colors">Stories</Link>
            <Link href="/authors" className="text-xs text-muted hover:text-text transition-colors">Authors</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
