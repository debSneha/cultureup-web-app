import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { useSearchContext } from "../../context/SearchContext";

const Search = () => {
  const { searchKeyword, setSearchKeyword } = useSearchContext();

  return (
    <div className="w-full flex items-center">
      <label className="sr-only">Search</label>
      <div className="relative w-full">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <MagnifyingGlassIcon className="w-5 h-7 text-gray-500" />
        </div>
        <input
          type="text"
          id="simple-search"
          className="border border-gray-300 text-gray-900 text-sm rounded-md focus:outline-none focus:shadow-md block w-full pl-10 p-2"
          placeholder="Search Posts by Title..."
          required
          value={searchKeyword}
          onChange={(event) => setSearchKeyword(event.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
