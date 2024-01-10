// SearchComponent.js
import React, {useState, useEffect, useRef} from "react";
import {useTranslation} from "react-i18next"; // Import useTranslation
import {useUserSearch} from "./../../graphqlOperations/userClient";
import {validateSearchTerm} from "./../../formValidations";

import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SearchResult from "./SearchResult";

const SearchComponent = () => {
  const {t} = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const {executeSearch, searchData} = useUserSearch();
  const searchComponentRef = useRef();

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      const delayDebounce = setTimeout(() => {
        executeSearch({variables: {searchTerm: searchTerm.trim()}});
      }, 300);

      return () => clearTimeout(delayDebounce);
    }
  }, [searchTerm, executeSearch]);

  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    if (validateSearchTerm(newValue)) {
      setSearchTerm(newValue);
    }
  };

  const handleClickOutside = (event) => {
    if (
      searchComponentRef.current &&
      !searchComponentRef.current.contains(event.target)
    ) {
      setSearchTerm("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box position="relative" ref={searchComponentRef}>
      <input
        type="text"
        placeholder={t("searchcomponent.searchPlaceholder")}
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {searchTerm.trim() && (
        <div id="search-results-container">
          <List id="list-search">
            {searchData && searchData.searchUser.length > 0 ? (
              searchData.searchUser.map((user, index) => (
                <SearchResult key={index} user={user} />
              ))
            ) : (
              <Typography sx={{color: "white"}} variant="subtitle1">
                {t("searchcomponent.noResultsFound")}
              </Typography>
            )}
          </List>
        </div>
      )}
    </Box>
  );
};

export default SearchComponent;
