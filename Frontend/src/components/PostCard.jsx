import React from "react";
import { Link } from "react-router-dom";

export const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <img src={post.image} alt={post.title} className="post-image" />

      <div className="post-content">
        <h2 className="post-title">
          <Link to={`/post/${post.slug}`}>{post.title}</Link>
        </h2>

        <p className="post-description">{post.metaDescription}</p>

        <div className="post-meta">
          <span className="author">Author: {post.author?.name}</span>

          <span className="category">Category: {post.category?.name}</span>

          <span className="date">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        <Link to={`/post/${post.slug}`} className="read-btn">
          Read More
        </Link>
      </div>
    </div>
  );
};
