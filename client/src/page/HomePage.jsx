import React from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";


function HomePage(){
    return(
        <div className="homepage">
            
        
        <div className="authforms">
            {/* authentication forms*/}
            <LoginForm/>
            <SignupForm/>
        </div>
        </div>
    );
}
export default HomePage;