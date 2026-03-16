import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

export const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    slug: "",
  });

  useEffect(() => {
    fetch(`/api/categories/${id}`)
      .then((res) => res.json())
      .then((data) =>
        setForm({
          name: data.name,
          slug: data.slug,
        })
      );
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    alert("Category Updated");

    navigate("/categories");
  };

  return (
    <div className="edit-category">
      <h2>Edit Category</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          placeholder="Category Name"
          onChange={handleChange}
        />

        <input
          name="slug"
          value={form.slug}
          placeholder="Category Slug"
          onChange={handleChange}
        />

        <button type="submit">Update Category</button>
      </form>
    </div>
  );
};
