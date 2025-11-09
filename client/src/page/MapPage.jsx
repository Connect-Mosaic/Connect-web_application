import React from "react";

function MapPage (){
    return(
        <div className="map-page">
            <h2>Event Map</h2>
            <p> view events near you on the map below</p>
            {/* map container */}
            <div className="map-container" 
            style={{width:"100%", height:"450px", 
                display:"flex",alignItems:"center",borderRadius:"8px"}}>
                    <h3>map placeholder</h3>

            </div>
            {/*filter location*/}
            <div className="filterlocation">

            </div>
        </div>
    );
}
export default MapPage;