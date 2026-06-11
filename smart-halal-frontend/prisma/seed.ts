import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ingredients = [
  {
    eNumber: 'E120',
    name: 'Karmin (Cochineal)',
    status: 'HARAM' as const,
    description:
      'Zat pewarna merah yang diekstrak dari serangga betina Dactylopius coccus. Diharamkan karena berasal dari serangga yang tidak termasuk jenis yang halal dikonsumsi.',
    source: 'Serangga (Dactylopius coccus)',
  },
  {
    eNumber: 'E471',
    name: 'Mono dan Digliserida Asam Lemak',
    status: 'SYUBHAT' as const,
    description:
      'Emulsifier yang bisa berasal dari lemak nabati (halal) maupun lemak hewani (haram). Status bergantung pada sumber lemak yang digunakan dalam proses produksi.',
    source: 'Lemak nabati atau hewani',
  },
  {
    eNumber: 'E322',
    name: 'Lesitin Kedelai',
    status: 'HALAL' as const,
    description:
      'Emulsifier yang diekstrak dari kedelai. Aman dikonsumsi dan tidak mengandung unsur haram. Banyak digunakan dalam cokelat dan produk roti.',
    source: 'Kedelai (nabati)',
  },
  {
    eNumber: 'E441',
    name: 'Gelatin',
    status: 'SYUBHAT' as const,
    description:
      'Protein yang diekstrak dari tulang dan kulit hewan. Berstatus HALAL jika dari sapi yang disembelih secara syariat, namun HARAM jika dari babi. Perlu cek sumber dan sertifikasi.',
    source: 'Tulang/kulit sapi atau babi',
  },
  {
    eNumber: 'E270',
    name: 'Asam Laktat',
    status: 'HALAL' as const,
    description:
      'Pengawet alami hasil fermentasi gula. Umumnya diproduksi dari sumber nabati (jagung, bit gula) dan tidak mengandung unsur haram.',
    source: 'Fermentasi gula nabati',
  },
  {
    eNumber: 'E110',
    name: 'Sunset Yellow FCF',
    status: 'HALAL' as const,
    description:
      'Pewarna makanan sintetis berwarna kuning-oranye. Berasal dari bahan kimia sintetis, tidak mengandung unsur hewan, sehingga halal. Namun perlu diperhatikan batas konsumsi harian.',
    source: 'Sintetis (bahan kimia)',
  },
  {
    eNumber: null,
    name: 'Vanilla Alami',
    status: 'HALAL' as const,
    description:
      'Ekstrak perisa dari tanaman Vanilla planifolia. Sepenuhnya berasal dari tumbuhan dan halal dikonsumsi.',
    source: 'Tanaman Vanilla planifolia (nabati)',
  },
  {
    eNumber: 'E621',
    name: 'Monosodium Glutamat (MSG)',
    status: 'HALAL' as const,
    description:
      'Penguat rasa yang diproduksi melalui fermentasi tetes tebu atau bahan nabati lainnya. Proses produksi modern menggunakan bahan nabati, sehingga statusnya halal.',
    source: 'Fermentasi tetes tebu/nabati',
  },
  {
    eNumber: 'E422',
    name: 'Gliserol (Gliserin)',
    status: 'SYUBHAT' as const,
    description:
      'Bahan pelembab yang bisa diperoleh dari lemak nabati maupun hewani. Status keterhalalan bergantung pada sumber: halal jika dari nabati, haram jika dari babi.',
    source: 'Lemak nabati atau hewani',
  },
  {
    eNumber: 'E252',
    name: 'Kalium Nitrat',
    status: 'HALAL' as const,
    description:
      'Pengawet dan penghambat pertumbuhan bakteri yang digunakan pada daging olahan. Berasal dari senyawa anorganik mineral, tidak mengandung unsur hewan.',
    source: 'Mineral anorganik (sintetis)',
  },
];

async function main() {
  console.log('🌱 Memulai proses seed database...');

  for (const ingredient of ingredients) {
    await prisma.ingredient.upsert({
      where: { name: ingredient.name },
      update: ingredient,
      create: ingredient,
    });
    console.log(`  ✅ ${ingredient.name} (${ingredient.status})`);
  }

  console.log(`\n🎉 Selesai! ${ingredients.length} bahan berhasil di-seed ke database.`);
}

main()
  .catch((e) => {
    console.error('❌ Error saat seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
