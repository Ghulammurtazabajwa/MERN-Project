import { Routes, Route } from "react-router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

// Main Page
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";

// Auth Page
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Logout from "./pages/auth/Logout";

// Post Page
import { PostCard } from "./components/PostCard";
import { PostDetails } from "./pages/post/PostDetails";
import { CreatePost } from "./pages/post/CreatePost";
import { EditPost } from "./pages/post/EditPost";

// Category Page
import { CategoryList } from "./pages/category/CategoryList";
import { CreateCategory } from "./pages/category/CreateCategory";
import { EditCategory } from "./pages/category/EditCategory";

// CSS Custom File
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Auth Page */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/logout" element={<Logout />} />

        {/* Post Page */}
        <Route path="/post-card" element={<PostCard />} />
        <Route path="/post/:slug" element={<PostDetails />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/posts/:slug/edit" element={<EditPost />} />

        {/* Category Page */}
        <Route path="/category" element={<CategoryList />} />
        <Route path="/create-category" element={<CreateCategory />} />
        <Route path="/edit-category/:slug/edit" element={<EditCategory />} />

        {/* Not Fount Page */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
