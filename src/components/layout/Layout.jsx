import React from "react";
import Navbar from "../common/Navbar";
 
const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="px-20">{children}</div>
        </div>
    );
};
 
export default Layout;