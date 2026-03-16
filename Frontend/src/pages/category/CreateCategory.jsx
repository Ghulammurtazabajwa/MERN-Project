import React, { useState } from "react";

export const CreateCategory = () => {
  const [form, setForm] = useState({
    name: "",
    slug: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    alert("Category Created");
  };

  return (
    <div className="category-form">
      <h2>Create Category</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Category Name"
          onChange={handleChange}
        />

        <input
          name="slug"
          placeholder="Category Slug"
          onChange={handleChange}
        />

        <button type="submit">Create Category</button>
      </form>
    </div>
  );
};
