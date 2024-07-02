import { createContext, useContext } from "react";

interface ISearchContext {
  searchKeyword: string;
  setSearchKeyword: React.Dispatch<React.SetStateAction<string>>;
}

const SearchContext = createContext<ISearchContext>({
  searchKeyword: "",
  setSearchKeyword: () => {}
})

export function useSearchContext() {
    return useContext(SearchContext);
}

export default SearchContext;