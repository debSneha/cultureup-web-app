import Nav from "../../../components/Nav/Nav";

import { PostItem, Search } from "../../../components";
import { useSearchUserPosts } from "../../../api/post";
import { useEffect, useState } from "react";
import { IPostWithMedia } from "../../../types/Post";
import { ArrowDownCircleIcon, EllipsisHorizontalCircleIcon, NoSymbolIcon } from "@heroicons/react/24/outline";
import { useInView } from "react-intersection-observer";
import React from "react";
import { Masonry } from "@mui/lab";
import SearchContext from "../../../context/SearchContext";
import { useQueryClient } from "@tanstack/react-query";

const UserPosts = () => {
  const [numCols, setNumCols] = useState<number>(5);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const queryClient = useQueryClient();

  const { ref, inView } = useInView();

  const {
    data,
    isSuccess,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSearchUserPosts(searchKeyword);


  useEffect(() => {
    queryClient.removeQueries(["user-posts"])
  }, [])

  useEffect(()=> {}, [data])

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const alterCols = () => {
    if (window.innerWidth >= 768) {
      setNumCols(5)
    } else {
      setNumCols(2)
    }
  }

  useEffect(() => {
    alterCols()
    window.addEventListener("resize", () => {
      alterCols()
    });
    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);


  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col mt-2 justify-center items-center">
        <div className="mb-5 w-full md:max-w-md">
          <SearchContext.Provider value={{searchKeyword, setSearchKeyword}}>
            <Search />
          </SearchContext.Provider>
        </div>
        <Masonry columns={numCols} spacing={2} className="w-full">
          {isSuccess &&
            data &&
            data.pages.map((page) => { 
              return (
              <React.Fragment key={page.pageBookmark}>
                {page.data.map((post: IPostWithMedia) => {
                  return <PostItem key={post.id} post={post} showStatus/>;
                })}
              </React.Fragment>
            )})}
        </Masonry>
      </div>
      <div className="w-full flex">
        <button
          ref={ref}
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className="bg-gray-100 p-3 mx-auto animate-slide-in mt-1 mb-3 text-gray-500"
        >
          {isFetchingNextPage
            ? <EllipsisHorizontalCircleIcon className="animate-ping w-5 h-5"/>
            : hasNextPage
            ? <ArrowDownCircleIcon className="w-5 h-5"/>
            : <div className="flex gap-3"><NoSymbolIcon className="w-5 h-5"/> Nothing to load...</div>}
        </button>
      </div>
    </div>
  );
};

export default UserPosts;
