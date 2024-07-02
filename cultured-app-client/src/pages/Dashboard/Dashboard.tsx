import Nav from "../../components/Nav/Nav";

import { PostItem, Search, SelectTags, Spinner } from "../../components";
import { useGetUserTags } from "../../api/user";
import { useSearchPosts } from "../../api/post";
import { useEffect, useState } from "react";
import { IUserOnTags } from "../../types/UsersOnTags";
import { IPostWithMedia } from "../../types/Post";
import { Tag } from "../../types/Tag";
import {
  ArrowDownCircleIcon,
  EllipsisHorizontalCircleIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/outline";
import { useGetTagWithId } from "../../api/tag";
import { useInView } from "react-intersection-observer";
import React from "react";
import { Masonry } from "@mui/lab";
import SearchContext from "../../context/SearchContext";

const Dashboard = () => {
  // These 3 lines are only in charge of fetching the initial tags
  const { data: userOnTags, isSuccess: getUserOnTagsSuccess } = useGetUserTags();
  const [tagIds, setTagIds] = useState<number[]>([]);
  const { data: tags, isSuccess: getTagsSuccess } = useGetTagWithId(tagIds);

  const [numCols, setNumCols] = useState<number>(
    window.innerWidth >= 768 ? 5 : 2
  );
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const { ref, inView } = useInView();

  const {
    data: posts,
    isSuccess: getPostsSuccess,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSearchPosts(
    searchKeyword,
    selectedTags.map((t) => t.id)
  );

  useEffect(() => {
    if (userOnTags) {
      let result = (userOnTags as IUserOnTags[]).map((tag) => {
        return tag.tagId;
      });
      setTagIds(result);
    }
  }, [getUserOnTagsSuccess]);

  useEffect(() => {
    if (tags) {
      setSelectedTags(tags);
    }
  }, [getTagsSuccess]);

  useEffect(() => {
    refetch();
  }, [selectedTags]);

  useEffect(() => {
    refetch();
  }, [searchKeyword]);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const alterCols = () => {
    if (window.innerWidth >= 768) {
      setNumCols(5);
    }
    if (window.innerWidth < 768) {
      setNumCols(2);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", alterCols);
  }, []);

  const renderMasonryGallery = () => {
    if (!!posts && posts.pages[0]?.data?.length > 0) {
      return (
        <div className="w-full mx-1 md:mx-3">
          <Masonry columns={numCols} spacing={2}>
            {getPostsSuccess &&
              posts &&
              posts.pages.map((page) => {
                return (
                  <React.Fragment key={page.pageBookmark}>
                    {page.data.map((post: IPostWithMedia) => {
                      return <PostItem key={post.id} post={post} />;
                    })}
                  </React.Fragment>
                );
              })}
          </Masonry>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col w-full min-h-full my-5 gap-2 text-center">
          <div className="mx-3 md:mx-auto text-gray-900 text-lg font-semibold">
            Nothing to see here.
          </div>
          <div className="mx-3 md:mx-auto text-gray-600 text-sm">
            Try adding some tags or searching differently to get results.
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-col md:flex-row  mx-3 gap-2">
        <div className="md:w-1/2">
          <SearchContext.Provider value={{ searchKeyword, setSearchKeyword }}>
            <Search />
          </SearchContext.Provider>
        </div>
        <div className="mb-3 md:w-1/2">
          <SelectTags selectedTagsState={{ selectedTags, setSelectedTags }} />
        </div>
      </div>
      {renderMasonryGallery()}
      <div className="w-full flex">
        {(!posts || (posts && posts.pages[0]?.data?.length > 0)) && (
          <button
            ref={ref}
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            className="bg-gray-100 p-3 mx-auto animate-slide-in mt-1 mb-3 text-gray-500"
          >
            {isFetchingNextPage ? (
              <EllipsisHorizontalCircleIcon className="animate-ping w-5 h-5" />
            ) : hasNextPage ? (
              <ArrowDownCircleIcon className="w-5 h-5" />
            ) : (
              <div className="flex gap-3">
                <NoSymbolIcon className="w-5 h-5" /> Nothing left to load.
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
