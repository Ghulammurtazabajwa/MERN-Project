import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

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

  const editCategory = (id) => {
    navigate(`/edit-category/${id}/edit`);
  };

  return (
    <div className="category-list">
      <button
        className="create-btn"
        onClick={() => navigate("/create-category")}
      >
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
                <button
                  className="delete-btn"
                  onClick={() => deleteCategory(cat._id)}
                >
                  Delete
                </button>

                <button
                  className="edit-btn"
                  onClick={() => editCategory(cat._id)}
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
