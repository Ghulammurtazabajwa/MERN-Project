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

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create category");
        return;
      }

      alert("Category Created");

      setForm({
        name: "",
        slug: "",
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="category-form">
      <h2>Create Category</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Category Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="slug"
          placeholder="Category Slug"
          value={form.slug}
          onChange={handleChange}
        />

        <button type="submit">Create Category</button>
      </form>
    </div>
  );
};
