import Post from "../models/Post.js"; // Make sure path is correct
import slugify from "slugify";

// ✅ GET all posts with optional filters (category, tags, status, featured)
export const getPosts = async (req, res) => {
  try {
    const { category, tags, status, featured } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (featured) filter.featured = featured === "true";
    if (tags) filter.tags = { $in: tags.split(",") };

    const posts = await Post.find(filter)
      .populate("author", "name email") // populate author info
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ GET single post by slug
export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({ slug, status: "published" })
      .populate("author", "name email")
      .populate("category", "name");

    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    // Increment view count
    post.viewCount += 1;
    await post.save();

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ CREATE new post
export const createPost = async (req, res) => {
  try {
    const { title, metaTitle, metaDescription, content, author, category, tags, status, image, featured, excerpt } =
      req.body;

    let slug = slugify(title, { lower: true, strict: true });

    // Check if slug exists
    const existing = await Post.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const newPost = new Post({
      title,
      metaTitle,
      metaDescription,
      content,
      author,
      category,
      tags,
      status,
      image,
      featured,
      excerpt,
      slug,
    });
    await newPost.save();

    res.status(201).json({ success: true, data: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ UPDATE post by ID
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.title) {
      updateData.slug = slugify(updateData.title, { lower: true, strict: true });
    }

    const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPost) return res.status(404).json({ success: false, message: "Post not found" });

    res.status(200).json({ success: true, data: updatedPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ DELETE post by ID
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) return res.status(404).json({ success: false, message: "Post not found" });

    res.status(200).json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
