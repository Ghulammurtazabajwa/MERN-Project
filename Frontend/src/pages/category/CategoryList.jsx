import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./Category.css";

export const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/category")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const deleteCategory = async (id) => {
    await fetch(`/api/category/${id}`, {
      method: "DELETE",
    });

    setCategories(categories.filter((cat) => cat._id !== id));
  };

  const editCategory = (id) => {
    navigate(`/edit-category/${id}/edit`);
  };

  return (
    <section className="category-list">
      <button className="create-btn" onClick={() => navigate("/create-category")}>
        Create New Category
      </button>
      <h2 className="category-h2">Categories</h2>
      <table className="category-table">
        <thead className="category-thead">
          <tr className="category-tr">
            <th className="category-th">Name</th>
            <th className="category-th">Slug</th>
            <th className="category-th">Action</th>
          </tr>
        </thead>
        <tbody className="category-tbody">
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td>{cat.name}</td>
              <td>{cat.slug}</td>
              <td>
                <button className="delete-btn" onClick={() => deleteCategory(cat._id)}>Delete</button>
                <button className="edit-btn" onClick={() => editCategory(cat._id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
