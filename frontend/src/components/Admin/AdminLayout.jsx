// import React, { useState, useEffect } from "react";
// import { Outlet } from "react-router-dom";
// import AdminSidebar from "./AdminSidebar.jsx";
// import AdminNavbar from "./AdminNavbar.jsx";

// const AdminLayout = () => {
//   const [collapsed, setCollapsed] = useState(window.innerWidth < 768);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 768) {
//         setCollapsed(true);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
//       {/* 1. Sidebar */}
//       <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

//       {/* 2. Main Content Wrapper */}
//       <div 
//         className={`flex-1 flex flex-col transition-all duration-300 ease-in-out
//           ${collapsed ? "md:ml-20" : "md:ml-64"}
//           ml-0
//         `}
//       >
//         {/* 3. Navbar */}
//         <AdminNavbar collapsed={collapsed} setCollapsed={setCollapsed} />
        
//         {/* 4. Page Content */}
//         <main className="mt-16 p-4 md:p-6 w-full max-w-[100vw]">
//           <Outlet /> 
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;