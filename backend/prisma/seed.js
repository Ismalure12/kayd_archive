require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Admin
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@kayd.so' },
    update: {},
    create: { email: 'admin@kayd.so', passwordHash, name: 'Kayd Admin', role: 'SUPER_ADMIN' },
  });
  console.log('Admin created:', admin.email);

  // Authors
  const nuruddin = await prisma.author.upsert({
    where: { slug: 'nuruddin-farah' },
    update: {},
    create: {
      name: 'Nuruddin Farah',
      nameSomali: 'Nuuradiin Faarax',
      slug: 'nuruddin-farah',
      birthYear: 1945,
      bio: 'Nuruddin Farah is a Somali novelist and one of Africa\'s most celebrated writers. His novels explore the complexity of Somali society, politics, and the experience of exile. He is best known for his trilogy "Blood in the Sun" and has received numerous international awards including the Neustadt International Prize for Literature.',
      photoUrl: null,
    },
  });

  const fadumo = await prisma.author.upsert({
    where: { slug: 'fadumo-qasim' },
    update: {},
    create: {
      name: 'Fadumo Qasim',
      nameSomali: 'Faadumo Qaasim',
      slug: 'fadumo-qasim',
      birthYear: 1962,
      bio: 'Fadumo Qasim is a pioneering Somali female author whose stories capture the lives of Somali women across generations. Her writing blends oral storytelling traditions with modern literary forms, giving voice to experiences long left unrecorded.',
      photoUrl: null,
    },
  });
  console.log('Authors created:', nuruddin.name, fadumo.name);

  // Tags
  const tagData = [
    { name: 'Jacayl', slug: 'jacayl' },
    { name: 'Dagaal', slug: 'dagaal' },
    { name: 'Qurbajoog', slug: 'qurbajoog' },
    { name: 'Taariikh', slug: 'taariikh' },
  ];

  const tags = {};
  for (const t of tagData) {
    tags[t.slug] = await prisma.tag.upsert({
      where: { slug: t.slug },
      update: {},
      create: t,
    });
  }
  console.log('Tags created:', Object.keys(tags).join(', '));

  // Stories
  const story1 = await prisma.story.upsert({
    where: { slug: 'xiddigta-habeenka' },
    update: {},
    create: {
      authorId: nuruddin.id,
      title: 'Xiddigta Habeenka',
      titleSomali: 'Xiddigta Habeenka',
      slug: 'xiddigta-habeenka',
      description: 'Nin dheer oo cirka fiiriya ayaa ogaada in xiddigaha ay xigmad weyn qaataan.',
      content: `<h2>Xiddigta Habeenka</h2>
<p>Habeenkii, markii cirka madoobaado oo xiddigihii iftiimiyo, Cali waxa uu fadhiyi jiray dabaqa gurigiisa korka ah isagoo indhahaaga cirka u laabaya. Waxa uu aaminsan yahay in xiddig kasta ay hayso sheekooyinkeedii — sheekooyin bilaysanaa muddo dhawr kun oo sano ah.</p>
<p>Hooyadiis, oo gabi ahaanba la shaqaynaysay xariirka gurigiisa, ayaa mar dheh ku tidhi: <em>"Maxaad u eegaysaa, wiilkaygiiye? Ma waxba aad raadsanaysaa?"</em></p>
<p>Cali ayaa si tartiib ah u jeestay. <strong>"Hooyooy, waxaan raadinayaa xiddigta aan la soo dhashay — tii aabahay sheegay inuu aaminsan yahay in ninba xiddig uu lahaan jiray."</strong></p>
<p>Hooyadiis ayaa dhagaystay, kolkay nuxurka hadalka gashay, indhaheeda ayaa la buuxiyeen. Waxa ay xasuusatay maalintii aabihiis uu soo noqday dagaalkii — jirka ka daalay laakiin indhahooda way xirnaan waayeen.</p>
<blockquote>
<p>"Xiddigta aad raadsanaysaa," ayay tidhi oo cod hoosaysa ku hadashay, "waa tii uu aabbahaa ku daacad ahaa. Markaad aad u xanuunsatid buu orday inuu kuu soo shuugo nuurkeedii."</p>
</blockquote>
<p>Habeenkaas, Cali wuu seexan waayay. Waxa uu ogaaday in xiddigaha ay yihiin xasuus — xasuusta kuwii ka horreyey ee nala socdaa hadba meel aan ka garanayn.</p>`,
      language: 'SOMALI',
      isPublished: true,
      publishedDate: new Date('2024-01-15'),
      readingTime: 3,
      tags: { create: [{ tag: { connect: { id: tags['jacayl'].id } } }, { tag: { connect: { id: tags['taariikh'].id } } }] },
    },
  });

  const story2 = await prisma.story.upsert({
    where: { slug: 'guri-ka-fogaanshaha' },
    update: {},
    create: {
      authorId: fadumo.id,
      title: 'Guri ka Fogaanshaha',
      titleSomali: 'Guri ka Fogaanshaha',
      slug: 'guri-ka-fogaanshaha',
      description: 'Gabadh qurbaha joogta ah ayaa xasuustaa gurigeeda hore iyo dhaqankeedii.',
      content: `<h2>Guri ka Fogaanshaha</h2>
<p>Saraynimo waxa ay ku noolayd magaalo qabow oo waqooyiga Yurub ah, laakiin maskaxdeeda waxa ay joogtaa Muqdisho — waddooyinkeedii ciidda leh, caanka ah, iyo urta badda ee gaadhsiisata.</p>
<p>Toddobaadkiiba hal mar, waxa ay wacday hooyadiis. Sheekooyinkii ay ka maqli jirtay gurigoodii hore — gabayada, masalada, kaftankii — waxa ay noqdeen kubtiyaasha adag ee ay ku xidnayd dhulkeedii asalka ah.</p>
<p>Maalin, xaaskeedii Iswiidishka ahaa ayaa weyddiiyay: <em>"Muxuu kuu macneeya guriga?"</em></p>
<p>Saraynimo ayaa iska raacday jawaabta oo badan. Dabadeedna waxa ay tidhi:</p>
<ul>
<li>Urta roobka ee dhulka ku dhaca</li>
<li>Codka abeesada ee subaxdii hore</li>
<li>Wajiga hooyadiis marka ay qososhaa</li>
<li>Habeenkii iftiin yar oo guri wanaagsan</li>
</ul>
<p><strong>"Guri,"</strong> ayay tidhi ugu dambeyntii, <strong>"waa meesha qalbigaagu ku nasto — xitaa haddaadan joogin."</strong></p>`,
      language: 'SOMALI',
      isPublished: true,
      publishedDate: new Date('2024-02-20'),
      readingTime: 3,
      tags: { create: [{ tag: { connect: { id: tags['qurbajoog'].id } } }, { tag: { connect: { id: tags['jacayl'].id } } }] },
    },
  });

  const story3 = await prisma.story.upsert({
    where: { slug: 'dagaalkii-gobannimada' },
    update: {},
    create: {
      authorId: nuruddin.id,
      title: 'Dagaalkii Gobannimada',
      titleSomali: 'Dagaalkii Gobannimada',
      slug: 'dagaalkii-gobannimada',
      description: 'Nin hore oo dagaal galay ayaa xusuustaa dhibaatadii iyo kalsoonigiisii.',
      content: `<h2>Dagaalkii Gobannimada</h2>
<p>Maxamed waxa uu ahaa nin da'da dhexe ah, laakiin indhahooda waxa ay ku qornaa muddooyinkii adag. Waxa uu xasuustaa maalintii ugu horraysay ee uu qaatay hubka — gacmihiisa ay gariiraan, laakiin wadnihiisu way xidnaayeen.</p>
<p>Sanadihii dambe, markii nabaddu timid, waxa uu helaa naftiisa oo u baahan inuu dib u dhiso wixii dagaalku burburiyay — guri, qoys, iyo naftii lafteeda.</p>
<p>Wiilkiisa, oo 20 jirka gaadhay oo wax baran lahaa, ayaa mar weyddiiyay: <em>"Aabbahay, ma ka cabsan tihiin?"</em></p>
<p>Maxamed ayaa aamusay muddo dheer. Kolkaa waxa uu ku jawaabay:</p>
<blockquote>
<p>"Cabsida, wiilkaygiiye, ma aha cadowga — waa saaxiibkaaga daacadka ah. Kuu sheegaysaa bacdameerka. Kuu ogeysiinaynaa in naftaadu qiimaynayso. Cabsi la'aanta waa xumaan, ma ahan geesinnimo."</p>
</blockquote>
<p>Wiilkiis ayaa aamusay isagoo u fiirinaya aabbihiis si cusub.</p>`,
      language: 'SOMALI',
      isPublished: true,
      publishedDate: new Date('2024-03-10'),
      readingTime: 3,
      tags: { create: [{ tag: { connect: { id: tags['dagaal'].id } } }, { tag: { connect: { id: tags['taariikh'].id } } }] },
    },
  });
  console.log('Stories created:', story1.title, story2.title, story3.title);

  // Collection
  const collection = await prisma.collection.upsert({
    where: { slug: 'tusmo-sheekooyin' },
    update: {},
    create: {
      title: 'Tusmo — Sheekooyin La Doorbiday',
      description: 'Ururinta ugu wanaagsan ee sheekooyin Soomaaliyeed ee casriga ah. Hal meel ayaad ka helaysaa xigmadda, jacaylka, iyo noloshii.',
      slug: 'tusmo-sheekooyin',
      isFeatured: true,
      stories: {
        create: [
          { story: { connect: { id: story1.id } }, sortOrder: 0 },
          { story: { connect: { id: story2.id } }, sortOrder: 1 },
          { story: { connect: { id: story3.id } }, sortOrder: 2 },
        ],
      },
    },
  });
  console.log('Collection created:', collection.title);

  console.log('\nSeed complete.');
  console.log('Admin login: admin@kayd.so / admin123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
