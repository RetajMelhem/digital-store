# متجر رقمي ثنائي اللغة - Bilingual Digital Store

مشروع متجر ويب رقمي مبني باستخدام **Next.js + TailwindCSS + Prisma + PostgreSQL** لبيع المنتجات الرقمية مثل اشتراكات الذكاء الاصطناعي والخدمات الرقمية.

## ما الذي تم إصلاحه في هذه النسخة

- إزالة نظام المخزون القديم من المشروع بالكامل.
- إزالة ملف `.env` الحقيقي من المشروع والإبقاء على `.env.example` فقط.
- إضافة `.gitignore` لمنع رفع الملفات الحساسة وملفات البناء.
- تحسين حماية لوحة الإدارة باستخدام **جلسة موقعة** بدل كوكي ثابتة قابلة للتزوير.
- إضافة **Rate limiting** لمحاولات دخول الإدارة.
- حماية Server Actions الخاصة بالإدارة بالتحقق من الجلسة نفسها.
- تحسين حذف المنتجات بإظهار خطأ واضح عند وجود طلبات مرتبطة بالمنتج.
- توسيع دعم الصور الخارجية في Next.js.
- تحسين رسالة واتساب لتتضمن تفاصيل أوضح للمستخدم.

## التقنيات المستخدمة

- Next.js App Router
- React 19
- Tailwind CSS
- Prisma
- PostgreSQL
- Zod

## التشغيل المحلي

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run dev
```
http://localhost:3000
## متغيرات البيئة المطلوبة

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/digital_store?schema=public"
ADMIN_PASSWORD="change-this-password"
ADMIN_SESSION_SECRET="replace-with-a-long-random-secret"
CLIQ_PHONE="0776323241"
WHATSAPP_PHONE="962776323241"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DEFAULT_LOCALE="ar"
RATE_LIMIT_WINDOW_MS="60000"
RATE_LIMIT_MAX_REQUESTS="5"
```

## الملاحظات

- يجب تعيين قيمة قوية جدًا لـ `ADMIN_PASSWORD`.
- يجب تعيين قيمة طويلة وعشوائية لـ `ADMIN_SESSION_SECRET`.
- المشروع لا يستخدم نظام إدارة مخزون بعد الآن.
- لا ترفع `.env` أو `node_modules` أو `.next` إلى Git.

## المسارات المهمة

- المتجر: `/{locale}`
- المنتجات: `/{locale}/products`
## أوامر مفيدة

```bash
npm run dev
npm run build
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```
