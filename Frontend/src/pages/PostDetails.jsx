import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

export const PostDetails = () => {

  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {

    fetch(`/api/posts/${slug}`)
      .then(res => res.json())
      .then(data => setPost(data));

  }, [slug]);

  if (!post) return <p>Loading...</p>;

  return (
    <div className="post-details">

      <h1>{post.title}</h1>

      <div className="post-info">
        <span>Author: {post.author?.name}</span>
        <span>Category: {post.category?.name}</span>
      </div>

      <img src={post.image} alt={post.title} />

      <div className="post-body">
        {post.content}
      </div>

    </div>
  );
};
