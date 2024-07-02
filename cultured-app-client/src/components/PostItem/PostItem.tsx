import moment from "moment";
import type { IPostWithMedia, PostStatus } from "../../types/Post";
import { useNavigate } from "react-router-dom";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Modal from "../Modal/Modal";
import { useDeletePost } from "../../api/post";
import { useGetUser } from "../../api/user";

interface IProps {
  showStatus?: boolean;
  post: IPostWithMedia;
}

const PostItem = ({ post, showStatus = false }: IProps) => {
  const navigate = useNavigate();
  const { mutate: deletePost } = useDeletePost();
  const {data: user, isLoading} = useGetUser();

  const retrieveThumbnailMediaUrl = (post: IPostWithMedia) => {
    const thumbnailMedia = post.media?.find((m) => m.isThumbnail);
    if (thumbnailMedia) return thumbnailMedia.mediaUrl;
    return "";
  };

  const styleStatus = (status: PostStatus) => {
    if (status == "APPROVED")
      return "bg-umeed-blue bg-opacity-10 text-umeed-blue";
    if (status == "IN_REVIEW")
      return "bg-gray-900 bg-opacity-10 text-umeed-gray";
    if (status == "REJECTED") return "bg-red-900 bg-opacity-10 text-red-900";
    return "hidden"; // hide status because invalid value parsed
  };

  const handleEdit = () => {
    if (!isLoading && user?.userType == "ADMIN"){
      navigate(`/admin/post?postId=${post.id}`);
    } else {
      navigate(`/create-post?postId=${post.id}`);
    }
  };

  const handleDelete = () => {
    deletePost({ postId: post.id });
  };

  return (
    <div className="flex flex-initial flex-col overflow-hidden animate-slide-in cursor-pointer">
      <img
        className="w-full h-full object-contain rounded-lg"
        src={retrieveThumbnailMediaUrl(post)}
        alt={post.title}
        onClick={() => navigate(`/post/${post.id}`)}
      />
      <div className="p-2 pt-1">
        <div
          className="text-sm md:text-md text-gray-700 text-ellipse line-clamp-2"
          onClick={() => navigate(`/post/${post.id}`)}
        >
          {post.title}
        </div>
        <div
          className="text-xs md:text-sm text-gray-500"
          onClick={() => navigate(`/post/${post.id}`)}
        >
          {post.author} | {moment(post.updatedAt).fromNow()}
        </div>
        {showStatus && (
          <div className="flex mt-2 w-full justify-between">
            <div
              className={`text-xs ${styleStatus(
                post.status
              )} rounded-md py-1 px-2  w-fit `}
            >
              {post.status.replace("_", " ")}
            </div>
            <div className="flex">
              <div>
                <button onClick={handleEdit}>
                  <PencilSquareIcon className="h-6 w-6 text-gray-500 hover:text-umeed-beige" />
                </button>
              </div>
              <div>
                <Modal
                  icon={
                    <TrashIcon className="h-6 w-6 text-gray-500 hover:text-umeed-beige" />
                  }
                  title="Delete Post"
                  body={
                    <div>{`Are you sure you want to permanantly delete the post "${post.title}" ?`}</div>
                  }
                  action="Delete"
                  onClick={handleDelete}
                ></Modal>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostItem;
