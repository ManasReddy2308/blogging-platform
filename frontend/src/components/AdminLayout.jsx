// src/components/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = () => {
  return (
    <div>
      <AdminNavbar />
      <div className="p-6 max-w-7xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
