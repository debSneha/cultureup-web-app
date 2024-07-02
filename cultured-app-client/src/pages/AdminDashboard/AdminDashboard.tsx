import { useGetRelevantPosts } from "../../api/post";
import { useContext, useEffect, useState } from "react";
import { PostStatus, PostType } from "../../types/Post";
import AdminTabs from "./components/AdminTabs";
import UserPostTable from "./components/UserPostTable";
import MyPostTable from "./components/AdminPostTable";
import Search from "../../components/Search/Search";
import SearchContext from "../../context/SearchContext";
import { PlusIcon } from "@heroicons/react/24/solid";
import MultipleInput from "../../components/Input/MultipleInput";
import Modal from "../../components/Modal/Modal";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { Menu, MenuItem } from "@mui/material";
import { useCreateTags } from "../../api/tag";

const AdminDashboard = () => {
  const [postType, setPostType] = useState<PostType>("MY_POST");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [postStatus, setPostStatus] = useState<PostStatus>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [inputFields, setInputFields] = useState<string[]>([""]);
  
 
  const {mutate: createTags} = useCreateTags();


  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { data, isLoading, refetch } = useGetRelevantPosts(
    postType,
    searchKeyword,
    postStatus
  );

  useEffect(() => {
    refetch();
  }, [searchKeyword]);

  useEffect(() => {
    refetch();
  }, [data])

  useEffect(() => {
    refetch();
  }, [postStatus]);

  const handleUserPosts = () => {
    setPostType("USER_POST");
    refetch();
  };

  const handleMyPosts = () => {
    setPostType("MY_POST");
    refetch();
  };

  const handleCreateTags = () => {
    console.log("loveee")
    console.log("tags",inputFields)
    createTags({tags: inputFields})
  }
  const handleApprovedPosts = () => {
    setPostStatus("APPROVED");
    setAnchorEl(null);
  };

  const handleRejectedPosts = () => {
    setPostStatus("REJECTED");
    setAnchorEl(null);
  };

  const handleReviewPosts = () => {
    setPostStatus("IN_REVIEW");
    setAnchorEl(null);
  };

  const handleAllPosts = () => {
    setPostStatus("");
    setAnchorEl(null);
  };


  return (
    <div className='flex flex-col min-h-screen'>
      <div className="flex flex-row my-10 pb-6 mx-8">
        <div className="w-1/2 h-10 ">
          <div>
            <span className="font-cormorant rounded-none p-2 font-bold text-3xl">
              Admin Dashboard
            </span>
          </div>
          <div>
            <span className="font-manrope rounded-none p-2 font-regular text-lg text-slate-500">
              Welcome back, SuperUser
            </span>
          </div>
        </div>
        <div className="w-1/2 flex justify-end">
          <Modal icon={<div className="flex p-2 bg-umeed-tangerine-300 text-gray-800 hover:bg-umeed-tangerine-700 hover:text-white"><PlusIcon className="h-6 w-6 " /> Create Post Tags </div>}
          title="Create Tags" action="Create" onClick={handleCreateTags} body={<MultipleInput createdTags={{inputFields, setInputFields}}/>}></Modal>
        </div>
      </div>
      <div className='mx-10 '>
        <AdminTabs
          onUserPostClick={handleUserPosts}
          onMyPostClick={handleMyPosts}
          type={postType}
        />
        <div className='flex flex-row mb-2 py-2'>
          <SearchContext.Provider value={{ searchKeyword, setSearchKeyword }}>
            <Search />
          </SearchContext.Provider>

          {postType == "USER_POST" && (
            <div>
              <div
                onClick={(event) => setAnchorEl(event.currentTarget)}
                className={`flex flex-row items-center text-md py-2 px-5 mx-3 bg-white text-gray-500 hover:bg-gray-200 hover:text-gray-800 rounded-md text-sm`}>
                <FunnelIcon className='h-6 w-6 mr-2' />
                Filter
              </div>
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={handleAllPosts}>All</MenuItem>
                <MenuItem onClick={handleApprovedPosts}>Approved</MenuItem>
                <MenuItem onClick={handleRejectedPosts}>Rejected</MenuItem>
                <MenuItem onClick={handleReviewPosts}>In Review</MenuItem>
              </Menu>
            </div>
          )}
        </div>

        <div className='w-full'>
          {postType === "USER_POST" && data && (
            <UserPostTable tabData={data} />
          )}
          {postType === "MY_POST" && data && <MyPostTable tabData={data} />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
