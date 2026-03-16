import React, { useEffect, useState } from "react";

export const CreatePost = () => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    category: "",
    image: "",
    content: "",
    status: "draft",
    featured: false,
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      ...form,
      tags: tags.split(",").map((tag) => tag.trim()),
    };

    await fetch("/api/posts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    alert("Post Published");
  };

  return (
    <div className="editor-container">
      <h2>Create New Post</h2>

      <form className="editor-form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Post Title"
          value={form.title}
          onChange={handleChange}
        />

        <input
          name="slug"
          placeholder="Slug (example: ai-for-beginners)"
          value={form.slug}
          onChange={handleChange}
        />

        <input
          name="metaTitle"
          placeholder="SEO Meta Title"
          value={form.metaTitle}
          onChange={handleChange}
        />

        <textarea
          name="metaDescription"
          placeholder="SEO Meta Description"
          value={form.metaDescription}
          onChange={handleChange}
        />

        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <input
          name="image"
          placeholder="Featured Image URL"
          value={form.image}
          onChange={handleChange}
        />

        {form.image && (
          <img src={form.image} alt="preview" className="image-preview" />
        )}

        <textarea
          name="content"
          rows="12"
          placeholder="Write your article here..."
          value={form.content}
          onChange={handleChange}
        />

        {/* Status Control */}
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        {/* Featured Control */}
        <label className="featured-checkbox">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
          />
          Featured Post
        </label>

        <button type="submit">Publish Post</button>
      </form>
    </div>
  );
};
