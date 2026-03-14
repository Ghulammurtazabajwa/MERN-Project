import mongoose from "mongoose";
import slugify from "slugify";

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    metaTitle: { type: String, required: true, trim: true },
    metaDescription: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: { type: [String], default: [] },
    image: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedDate: { type: Date },
    viewCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    readingTime: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    excerpt: { type: String, maxlength: 300 },
    bookmarkCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    lastEditedAt: { type: Date },
  },
  { timestamps: true },
);

// ⭐ TEXT SEARCH INDEX
PostSchema.index(
  { title: "text", content: "text", metaTitle: "text" },
  { weights: { title: 5, metaTitle: 3, content: 1 } },
);

// ⭐ Additional indexes for performance
PostSchema.index({ category: 1 });
PostSchema.index({ status: 1 });
PostSchema.index({ featured: 1 });
PostSchema.index({ createdAt: -1 });

// middleware for publishedDate, readingTime, slug, lastEditedAt
PostSchema.pre("save", function (next) {
  if (this.status === "published" && !this.publishedDate) {
    this.publishedDate = new Date();
  }
  if (!this.isNew) {
    this.lastEditedAt = new Date();
  }
  if (this.content) {
    this.readingTime = Math.ceil(this.content.split(/\s+/).length / 200);
  }
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

export default mongoose.model("Post", PostSchema);
