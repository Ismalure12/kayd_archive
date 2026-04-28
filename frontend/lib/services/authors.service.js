const prisma = require('../prisma');
const AppError = require('../AppError');
const { generateSlug } = require('../slug');

async function listAuthors({ page, limit, skip, search }) {
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { nameSomali: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const [authors, total] = await Promise.all([
    prisma.author.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
      select: { id: true, name: true, nameSomali: true, slug: true, photoUrl: true, birthYear: true, deathYear: true, era: true, bio: true, createdAt: true, updatedAt: true, _count: { select: { stories: { where: { isPublished: true } } } } },
    }),
    prisma.author.count({ where }),
  ]);

  return { authors, total };
}

async function getAuthorBySlug(slug) {
  const author = await prisma.author.findUnique({
    where: { slug },
    include: {
      stories: {
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, title: true, titleSomali: true, slug: true,
          description: true, coverImageUrl: true, readingTime: true,
          language: true, publishedDate: true, viewCount: true,
          tags: { include: { tag: true } },
        },
      },
    },
  });
  if (!author) throw new AppError('Author not found', 404);
  return author;
}

async function createAuthor(data) {
  const slug = data.slug || generateSlug(data.name);
  const exists = await prisma.author.findUnique({ where: { slug } });
  if (exists) throw new AppError('Slug already in use', 409);
  return prisma.author.create({ data: { ...data, slug } });
}

async function updateAuthor(id, data) {
  await getAuthorById(id);
  if (data.slug) {
    const exists = await prisma.author.findFirst({ where: { slug: data.slug, NOT: { id } } });
    if (exists) throw new AppError('Slug already in use', 409);
  }
  return prisma.author.update({ where: { id }, data });
}

async function deleteAuthor(id) {
  await getAuthorById(id);
  return prisma.author.delete({ where: { id } });
}

async function getAuthorById(id) {
  const author = await prisma.author.findUnique({ where: { id } });
  if (!author) throw new AppError('Author not found', 404);
  return author;
}

module.exports = { listAuthors, getAuthorBySlug, createAuthor, updateAuthor, deleteAuthor, getAuthorById };
