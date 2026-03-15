import React, { useEffect, useState } from "react";

export const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const deleteCategory = async (id) => {
    await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    setCategories(categories.filter((cat) => cat._id !== id));
  };

  return (
    <div className="category-list">
      <button onClick={() => (window.location.href = "/create-category")}>
        Create New Category
      </button>
      <h2>Categories</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td>{cat.name}</td>

              <td>{cat.slug}</td>

              <td>
                <button onClick={() => deleteCategory(cat._id)}>Delete</button>
                <button
                  onClick={() =>
                    (window.location.href = `/edit-category/${cat._id}`)
                  }
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
