import React from "react";
import NavBar from "../components/Navbar";
import Footer from "../ components/Footer";


function MainLayout({children}){
    return (
        <div className="main-layout">
            <NavBar/>
            <main>{children}</main>
            <Footer/>
        </div>

    );
}
export default MainLayout;