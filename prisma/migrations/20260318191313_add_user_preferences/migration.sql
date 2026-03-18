-- AlterTable
ALTER TABLE "User" ADD COLUMN     "language" TEXT DEFAULT 'pt-BR',
ADD COLUMN     "notificationsEnabled" BOOLEAN DEFAULT true,
ADD COLUMN     "theme" TEXT DEFAULT 'light',
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
