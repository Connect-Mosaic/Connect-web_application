import React,{useState} from "react";
import "./SearchPage.css";

function SearchPage(){
    const [query, setQuery] = useState("");
    return (

        /* Search field input */
        <div className="search-page">
            <h3>Search</h3>
            <input
            className="search-input"
            type ="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            />

            {/* search field container*/}

            <div className="result-container">
                {query?(
                    <p>Showing results for: <strong>{query}</strong></p>
                ):(
                    <p>Search results will appear here:</p>
                )}
                {/* search results will appear here later */}
            </div>

        </div>
    )
}
export default SearchPage;