import React, { useEffect, useState } from "react";
import { getPosts } from "../api/postApi";
import { PostCard } from "../components/PostCard";

export const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPosts({ status: "published" });
      setPosts(data.data);
    };
    fetchPosts();
  }, []);

  return (
    <div className="posts-grid">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};
