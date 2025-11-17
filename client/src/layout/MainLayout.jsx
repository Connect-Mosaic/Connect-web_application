import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer";

function MainLayout({ children, isLoggedIn, onLogout }) {
    return (
        <div className="main-layout">

            <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />
            
            <main>{children}</main>
            
            <Footer />

        </div>
    );
}

export default MainLayout;
