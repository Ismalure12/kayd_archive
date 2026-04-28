const prisma = require('../prisma');
const AppError = require('../AppError');
const { generateSlug } = require('../slug');

const PUBLIC_MURTI_SELECT = {
  id: true,
  title: true,
  titleTranslation: true,
  context: true,
  narrator: true,
  narratorLocation: true,
  slug: true,
  status: true,
  isFeatured: true,
  publishedDate: true,
  viewCount: true,
  createdAt: true,
};

async function listMurti({ page, limit, skip }) {
  const where = { isPublished: true };
  const [murti, total] = await Promise.all([
    prisma.murti.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: PUBLIC_MURTI_SELECT,
    }),
    prisma.murti.count({ where }),
  ]);
  return { murti, total };
}

async function getMurtiBySlug(slug) {
  const murti = await prisma.murti.findFirst({
    where: { slug, isPublished: true },
    select: { ...PUBLIC_MURTI_SELECT, updatedAt: true },
  });
  if (!murti) throw new AppError('Murti not found', 404);
  await prisma.murti.update({ where: { id: murti.id }, data: { viewCount: { increment: 1 } } });
  return murti;
}

async function listMurtiAdmin({ page, limit, skip, search, status }) {
  const where = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { narrator: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (status) where.status = status.toUpperCase();

  const [murti, total] = await Promise.all([
    prisma.murti.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.murti.count({ where }),
  ]);
  return { murti, total };
}

async function getMurtiById(id) {
  const murti = await prisma.murti.findUnique({ where: { id } });
  if (!murti) throw new AppError('Murti not found', 404);
  return murti;
}

async function createMurti(data) {
  const slug = data.slug || generateSlug(data.title);
  const exists = await prisma.murti.findUnique({ where: { slug } });
  if (exists) throw new AppError('Slug already in use', 409);

  const { ...murtiData } = data;
  if (murtiData.status === 'PUBLISHED') murtiData.isPublished = true;
  else if (murtiData.status) murtiData.isPublished = false;

  return prisma.murti.create({ data: { ...murtiData, slug } });
}

async function updateMurti(id, data) {
  await getMurtiById(id);
  const { ...murtiData } = data;

  if (murtiData.status === 'PUBLISHED') murtiData.isPublished = true;
  else if (murtiData.status) murtiData.isPublished = false;

  if (murtiData.slug) {
    const exists = await prisma.murti.findFirst({ where: { slug: murtiData.slug, NOT: { id } } });
    if (exists) throw new AppError('Slug already in use', 409);
  }

  return prisma.murti.update({ where: { id }, data: murtiData });
}

async function deleteMurti(id) {
  await getMurtiById(id);
  return prisma.murti.delete({ where: { id } });
}

module.exports = { listMurti, getMurtiBySlug, listMurtiAdmin, getMurtiById, createMurti, updateMurti, deleteMurti };
