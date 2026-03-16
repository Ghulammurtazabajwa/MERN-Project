import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

export const EditPost = () => {

  const { id } = useParams();

  const [form, setForm] = useState({});

  useEffect(() => {

    fetch(`/api/posts/${id}`)
      .then(res => res.json())
      .then(data => setForm(data));

  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    await fetch(`/api/posts/${id}/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    alert("Post Updated");
  };

  return (
    <div className="post-form">

      <h2>Edit Post</h2>

      <form onSubmit={handleSubmit}>

        <input
          name="title"
          value={form.title || ""}
          onChange={handleChange}
        />

        <input
          name="slug"
          value={form.slug || ""}
          onChange={handleChange}
        />

        <textarea
          name="metaDescription"
          value={form.metaDescription || ""}
          onChange={handleChange}
        />

        <textarea
          name="content"
          rows="10"
          value={form.content || ""}
          onChange={handleChange}
        />

        <button type="submit">
          Update Post
        </button>

      </form>

    </div>
  );
};
