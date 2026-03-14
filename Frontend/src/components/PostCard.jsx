import React from "react";
import { Link } from "react-router";

export const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <img src={post.image} alt={post.title} className="post-image" />

      <div className="post-content">
        <h2 className="post-title">
          <Link to={`/post/${post.slug}`}>{post.title}</Link>
        </h2>

        <p className="post-desc">{post.metaDescription}</p>

        <div className="post-meta">
          <span>Author: {post.author?.name}</span>
          <span>Category: {post.category?.name}</span>
        </div>

        <Link to={`/post/${post.slug}`} className="read-btn">
          Read More
        </Link>
      </div>
    </div>
  );
};
