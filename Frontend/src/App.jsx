import { Routes, Route } from "react-router";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Register } from "./pages/auth/Register";
import { Login } from "./pages/auth/Login";
import "./App.css";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { Dashboard } from "./pages/admin/Dashboard";
import { PostCard } from "./components/PostCard";
import { PostDetails } from "./pages/PostDetails";
import { CreatePost } from "./pages/CreatePost";
import { EditPost } from "./pages/EditPost";
import { CategoryList } from "./pages/CategoryList";
import { CreateCategory } from "./pages/CreateCategory";
import { EditCategory } from "./pages/EditCategory";
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/posts" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/post-card" element={<PostCard />} />
        <Route path="/post/:slug" element={<PostDetails />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/posts/:slug/edit" element={<EditPost />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/create-category" element={<CreateCategory />} />
        <Route path="/edit-category/:slug/edit" element={<EditCategory />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Layout>
  );
}

export default App;
