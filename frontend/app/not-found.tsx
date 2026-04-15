import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="font-serif text-5xl font-bold text-text mb-4">404</h1>
      <p className="text-xl text-text-secondary mb-8">
        This page doesn&apos;t exist in the archive.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-terracotta text-white rounded-lg font-medium hover:bg-terracotta-dark transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
