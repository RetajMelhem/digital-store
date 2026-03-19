import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ProductSeed = {
  slug: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  category: string;
  image: string;
  price: number;
  deliveryType: "CUSTOMER_ACCOUNT" | "PRIVATE_ACCOUNT";
  reviewProfile: {
    minReviews: number;
    maxReviews: number;
    ratingWeights: number[];
  };
};

const firstNames = [
  "أحمد",
  "سارة",
  "عمر",
  "لينا",
  "محمد",
  "نور",
  "يوسف",
  "رنا",
  "حسن",
  "آية",
  "علي",
  "ديما",
  "خالد",
  "منى",
  "سمير",
  "رامي",
  "سلمى",
  "كريم",
  "هدى",
  "عادل",
  "مها",
  "تقى",
  "جود",
  "نادر",
  "إياد",
  "بشرى",
  "ميس",
  "زين",
  "لمى",
  "شيماء"
] as const;

const lastNames = [
  "الخوالدة",
  "الحسن",
  "اليوسف",
  "الأحمد",
  "المحمود",
  "الفارس",
  "العلي",
  "السالم",
  "الزيدي",
  "الكتبي",
  "الرفاعي",
  "التميمي",
  "النجار",
  "الشرع",
  "العبادي",
  "الطراونة",
  "العمري",
  "النسور",
  "الخطيب",
  "الصالح"
] as const;

const legacySlugs = ["gemini-Pro-1M", "discord-nitro-Gaming-1M"] as const;

const productSeeds: ProductSeed[] = [
  {
    slug: "chatgpt-plus-account-1M",
    nameEn: "ChatGPT Plus Account 1M",
    nameAr: "حساب ChatGPT Plus شهر واحد",
    descriptionEn: "You will receive a new private account with email and password after payment confirmation. The account is dedicated to you only.",
    descriptionAr: "سيتم تسليمك إيميل وباسورد لحساب جديد بعد تأكيد الدفع، والحساب خاص ومخصص لك فقط.",
    category: "AI",
    image: "/images/products/Cgpt plus 1M.png",
    price: 4,
    deliveryType: "PRIVATE_ACCOUNT",
    reviewProfile: {
      minReviews: 11,
      maxReviews: 18,
      ratingWeights: [5, 5, 5, 5, 4, 4]
    }
  },
  {
    slug: "chatgpt-plus-account-3M",
    nameEn: "ChatGPT Plus Account 3M",
    nameAr: "حساب ChatGPT Plus 3 أشهر",
    descriptionEn: "You will receive a new private account with email and password after payment confirmation. The account is dedicated to you only.",
    descriptionAr: "سيتم تسليمك إيميل وباسورد لحساب جديد بعد تأكيد الدفع، والحساب خاص ومخصص لك فقط.",
    category: "AI",
    image: "/images/products/Cgpt plus 3M.png",
    price: 10,
    deliveryType: "PRIVATE_ACCOUNT",
    reviewProfile: {
      minReviews: 8,
      maxReviews: 14,
      ratingWeights: [5, 5, 5, 4, 4, 4]
    }
  },
  {
    slug: "chatgpt-pro-account-1M",
    nameEn: "ChatGPT Pro Account 1M",
    nameAr: "حساب ChatGPT Pro شهر واحد",
    descriptionEn: "You will receive a new private account with email and password after payment confirmation. The account is dedicated to you only.",
    descriptionAr: "سيتم تسليمك إيميل وباسورد لحساب جديد بعد تأكيد الدفع، والحساب خاص ومخصص لك فقط.",
    category: "AI",
    image: "/images/products/Cgpt pro 1M.png",
    price: 8,
    deliveryType: "PRIVATE_ACCOUNT",
    reviewProfile: {
      minReviews: 9,
      maxReviews: 15,
      ratingWeights: [5, 5, 5, 4, 4, 4]
    }
  },
  {
    slug: "chatgpt-pro-account-3M",
    nameEn: "ChatGPT Pro Account 3M",
    nameAr: "حساب ChatGPT Pro 3 أشهر",
    descriptionEn: "You will receive a new private account with email and password after payment confirmation. The account is dedicated to you only.",
    descriptionAr: "سيتم تسليمك إيميل وباسورد لحساب جديد بعد تأكيد الدفع، والحساب خاص ومخصص لك فقط.",
    category: "AI",
    image: "/images/products/Cgpt pro 3M.png",
    price: 20,
    deliveryType: "PRIVATE_ACCOUNT",
    reviewProfile: {
      minReviews: 5,
      maxReviews: 10,
      ratingWeights: [5, 5, 4, 4, 4]
    }
  },
  {
    slug: "gemini-pro-1M",
    nameEn: "Gemini Pro 1M",
    nameAr: "حساب Gemini Pro شهر واحد",
    descriptionEn: "You will receive a new private account with email and password after payment confirmation. The account is dedicated to you only.",
    descriptionAr: "سيتم تسليمك إيميل وباسورد لحساب جديد بعد تأكيد الدفع، والحساب خاص ومخصص لك فقط.",
    category: "AI",
    image: "/images/products/gemeni pro 1M.png",
    price: 4.5,
    deliveryType: "PRIVATE_ACCOUNT",
    reviewProfile: {
      minReviews: 7,
      maxReviews: 11,
      ratingWeights: [5, 5, 4, 4, 4, 4]
    }
  },
  {
    slug: "youtube-premium-1M",
    nameEn: "YouTube Premium 1M",
    nameAr: "يوتيوب بريميوم شهر واحد",
    descriptionEn: "Activation is completed on your personal account with ad-free viewing and background playback.",
    descriptionAr: "يتم التفعيل على حسابك الشخصي مع مشاهدة بدون إعلانات وتشغيل في الخلفية.",
    category: "Social Media",
    image: "/images/products/youtube premium 1M.png",
    price: 4,
    deliveryType: "CUSTOMER_ACCOUNT",
    reviewProfile: {
      minReviews: 15,
      maxReviews: 24,
      ratingWeights: [5, 5, 5, 5, 4, 4, 4]
    }
  },
  {
    slug: "snapchat-plus-3M",
    nameEn: "Snapchat Plus 3M",
    nameAr: "سناب شات بلس 3 أشهر",
    descriptionEn: "Activation is completed on your personal Snapchat account with Snapchat Plus features for 3 months after payment confirmation.",
    descriptionAr: "يتم التفعيل على حساب سناب شات الخاص بك مع مزايا Snapchat Plus لمدة 3 أشهر بعد تأكيد الدفع.",
    category: "Social Media",
    image: "/images/products/snap chat plus.png",
    price: 4,
    deliveryType: "CUSTOMER_ACCOUNT",
    reviewProfile: {
      minReviews: 7,
      maxReviews: 12,
      ratingWeights: [5, 5, 5, 4, 4, 4]
    }
  },
  {
    slug: "snapchat-plus-6M",
    nameEn: "Snapchat Plus 6M",
    nameAr: "سناب شات بلس 6 أشهر",
    descriptionEn: "Activation is completed on your personal Snapchat account with Snapchat Plus features for 6 months after payment confirmation.",
    descriptionAr: "يتم التفعيل على حساب سناب شات الخاص بك مع مزايا Snapchat Plus لمدة 6 أشهر بعد تأكيد الدفع.",
    category: "Social Media",
    image: "/images/products/snap chat plus.png",
    price: 7,
    deliveryType: "CUSTOMER_ACCOUNT",
    reviewProfile: {
      minReviews: 6,
      maxReviews: 10,
      ratingWeights: [5, 5, 5, 4, 4]
    }
  },
  {
    slug: "discord-nitro-gaming-1M",
    nameEn: "Discord Nitro Gaming 1M",
    nameAr: "ديسكورد نيترو جيمينج شهر واحد",
    descriptionEn: "Activation is completed on your personal account with Discord Nitro perks and fast processing.",
    descriptionAr: "يتم تفعيل الاشتراك على حسابك الشخصي مع مزايا Discord Nitro ومعالجة سريعة للطلب.",
    category: "Gaming",
    image: "/images/products/discord nitro 1M.png",
    price: 5,
    deliveryType: "CUSTOMER_ACCOUNT",
    reviewProfile: {
      minReviews: 6,
      maxReviews: 12,
      ratingWeights: [5, 5, 4, 4, 4]
    }
  }
];

function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(items: T[]) {
  const clone = [...items];

  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }

  return clone;
}

function createReviewerPool() {
  return shuffle(firstNames.flatMap((firstName) => lastNames.map((lastName) => `${firstName} ${lastName}`)));
}

async function main() {
  await prisma.review.deleteMany();
  await prisma.product.updateMany({
    where: {
      slug: {
        in: [...legacySlugs]
      }
    },
    data: {
      isActive: false
    }
  });

  for (const { reviewProfile: _, ...product } of productSeeds) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product
    });
  }

  const products = await prisma.product.findMany({ orderBy: { slug: "asc" } });
  const reviewerPool = createReviewerPool();
  let reviewerIndex = 0;

  for (const product of products) {
    const productConfig = productSeeds.find((item) => item.slug === product.slug);
    if (!productConfig) continue;

    const reviewCount = randomInt(productConfig.reviewProfile.minReviews, productConfig.reviewProfile.maxReviews);

    for (let index = 0; index < reviewCount; index += 1) {
      const selectedName = reviewerPool[reviewerIndex % reviewerPool.length];
      reviewerIndex += 1;
      const rating = randomItem(productConfig.reviewProfile.ratingWeights);

      await prisma.review.create({
        data: {
          productId: product.id,
          name: selectedName,
          rating,
          comment: null,
          status: "APPROVED"
        }
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
