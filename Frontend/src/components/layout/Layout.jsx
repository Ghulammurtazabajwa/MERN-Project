import React from "react";
import { Navbar } from "../Navbar";
import { Sidebar } from "../Sidebar";
import { Footer } from "../Footer";
import "./Layout.css";

export const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />

      <div className="layout-container">
        <Sidebar />

        <main className="main-content">{children}</main>
      </div>

      <Footer />
    </div>
  );
};
