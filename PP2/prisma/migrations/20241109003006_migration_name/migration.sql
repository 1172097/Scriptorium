-- CreateTable
CREATE TABLE "User" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "profile_picture" TEXT,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "dark_mode" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "CodeTemplate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "isForked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" INTEGER NOT NULL,
    "originTemplateId" INTEGER,
    CONSTRAINT "CodeTemplate_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CodeTemplate_originTemplateId_fkey" FOREIGN KEY ("originTemplateId") REFERENCES "CodeTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "numReports" INTEGER NOT NULL DEFAULT 0,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "numReports" INTEGER NOT NULL DEFAULT 0,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,
    "postId" INTEGER,
    "parentId" INTEGER,
    CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rating" (
    "rating_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "postId" INTEGER,
    "commentId" INTEGER,
    CONSTRAINT "Rating_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rating_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Rating_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Report" (
    "report_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reason" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" INTEGER NOT NULL,
    "postId" INTEGER,
    "commentId" INTEGER,
    CONSTRAINT "Report_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Report_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Report_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TemplateTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_TemplateTags_A_fkey" FOREIGN KEY ("A") REFERENCES "CodeTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TemplateTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_BlogPostTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BlogPostTags_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BlogPostTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_BlogPostTemplates" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BlogPostTemplates_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BlogPostTemplates_B_fkey" FOREIGN KEY ("B") REFERENCES "CodeTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "CodeTemplate_title_idx" ON "CodeTemplate"("title");

-- CreateIndex
CREATE INDEX "CodeTemplate_content_idx" ON "CodeTemplate"("content");

-- CreateIndex
CREATE UNIQUE INDEX "CodeTemplate_authorId_title_key" ON "CodeTemplate"("authorId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "BlogPost_title_idx" ON "BlogPost"("title");

-- CreateIndex
CREATE INDEX "BlogPost_content_idx" ON "BlogPost"("content");

-- CreateIndex
CREATE INDEX "BlogPost_rating_idx" ON "BlogPost"("rating");

-- CreateIndex
CREATE INDEX "BlogPost_numReports_idx" ON "BlogPost"("numReports");

-- CreateIndex
CREATE INDEX "Comment_rating_idx" ON "Comment"("rating");

-- CreateIndex
CREATE INDEX "Comment_numReports_idx" ON "Comment"("numReports");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_ownerId_postId_key" ON "Rating"("ownerId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_ownerId_commentId_key" ON "Rating"("ownerId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "Report_ownerId_postId_key" ON "Report"("ownerId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "Report_ownerId_commentId_key" ON "Report"("ownerId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "_TemplateTags_AB_unique" ON "_TemplateTags"("A", "B");

-- CreateIndex
CREATE INDEX "_TemplateTags_B_index" ON "_TemplateTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlogPostTags_AB_unique" ON "_BlogPostTags"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogPostTags_B_index" ON "_BlogPostTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlogPostTemplates_AB_unique" ON "_BlogPostTemplates"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogPostTemplates_B_index" ON "_BlogPostTemplates"("B");
