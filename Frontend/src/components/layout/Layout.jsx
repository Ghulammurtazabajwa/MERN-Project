import { Navbar } from "../Navbar";
import { Sidebar } from "../Sidebar";
import { Footer } from "../Footer";
import "./Layout.css";

export const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <Sidebar />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};
