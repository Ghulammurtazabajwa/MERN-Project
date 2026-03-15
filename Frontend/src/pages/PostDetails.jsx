import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const PostDetails = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then((res) => res.json())
      .then((data) => setPost(data))
      .catch((err) => console.error(err));
  }, [slug]);
  
  if (!post) return <p className="loading">Loading...</p>;
  return (
    <div className="post-details">
      <h1 className="post-title">{post.data.title}</h1>

      <div className="post-info">
        <span>Author: {post.data.author?.email}</span>
        <span>Category: {post.data.category?.name}</span>
        <span>
          Published: {new Date(post.data.createdAt).toLocaleDateString()}
        </span>
      </div>

      <img className="post-image" src={post.data.image} alt={post.data.title} />

      <div className="post-body">{post.data.content}</div>
    </div>
  );
};
