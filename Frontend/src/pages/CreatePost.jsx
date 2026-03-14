import React, { useState } from "react";

export const CreatePost = () => {

  const [form, setForm] = useState({
    title: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    content: "",
    image: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    alert("Post Created");
  };

  return (
    <div className="post-form">

      <h2>Create Post</h2>

      <form onSubmit={handleSubmit}>

        <input
          name="title"
          placeholder="Title"
          onChange={handleChange}
        />

        <input
          name="slug"
          placeholder="Slug"
          onChange={handleChange}
        />

        <input
          name="metaTitle"
          placeholder="Meta Title"
          onChange={handleChange}
        />

        <textarea
          name="metaDescription"
          placeholder="Meta Description"
          onChange={handleChange}
        />

        <input
          name="image"
          placeholder="Image URL"
          onChange={handleChange}
        />

        <textarea
          name="content"
          placeholder="Post Content"
          rows="10"
          onChange={handleChange}
        />

        <button type="submit">
          Publish Post
        </button>

      </form>

    </div>
  );
};
