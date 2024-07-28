import React, { useState } from "react";
import _debounce from "lodash.debounce";
import "./SearchBar.css";

const SearchBar = ({ search, clearSearchResults }) => {
  const [term, setTerm] = useState("");

  const debouncedSearch = _debounce((newTerm) => {
    if (newTerm.trim()) {
      search(newTerm);
    } else {
      clearSearchResults();
    }
  }, 500);

  const handleTermChange = (event) => {
    const newTerm = event.target.value;
    setTerm(newTerm);
    debouncedSearch(newTerm);
  };

  const handleBlur = () => {
    if (!term.trim()) {
      clearSearchResults(); // Clear search results
      debouncedSearch.cancel(); // Cancel the pending search request
    }
  };

  return (
    <div className="SearchBar">
      <input
        placeholder="Enter an Artist, Song Title, or Album"
        onChange={handleTermChange}
        value={term}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default SearchBar;
