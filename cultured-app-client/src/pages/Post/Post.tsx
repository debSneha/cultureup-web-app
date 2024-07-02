import { useNavigate, useParams } from "react-router-dom";
import { useGetPost, useGetPostMedia } from "../../api/post";
import {ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import { useGetTagByPost } from "../../api/tag";
import { Tag } from "../../types/Tag";
import { Media } from "../../types/Post";
import DOMPurify from "dompurify";
import ImageCarousel from "./components/ImageCarousel";

const Post = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const { data: post, isSuccess: getPostSuccess } = useGetPost(
    parseInt(postId as string)
  );
  const { data: tags, isSuccess: getPostTagsSuccess } = useGetTagByPost(postId);
  const { data: media } = useGetPostMedia(parseInt(postId as string));

  const returnToPrevScreen = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/", { replace: true }); // the current entry in the history stack will be replaced with the new one with { replace: true }
    }
  };

  const renderHTMLData = (rawHtml: string) => {
    const sanitizedData = () => ({
      __html: DOMPurify.sanitize(rawHtml),
    });
    return <div dangerouslySetInnerHTML={sanitizedData()} />;
  };

  return (
    <div className="flex flex-grow">
      <div className="bg-white w-full p-5">
        <div className="border-b">
          {post?.rejectDsc && post?.status === "REJECTED" &&
            <div className="w-full bg-red-300 text-red-900 rounded-md p-3 mb-4">
              {`Rejected: "${post.rejectDsc}"`}
            </div>
          }
          <div className="flex flex-col lg:flex-row w-full items-left lg:items-center lg:justify-between mb-2 gap-2">
            <div className="flex gap-2 flex-col lg:flex-row lg:max-w-3/5 overflow-scroll scrollbar-hide">
              <div className="flex items-center">
                <ArrowUturnLeftIcon
                  className="w-5 h-5 lg:w-7 lg:h-7 hover:text-umeed-tangerine-500 cursor-pointer items-center justify-center mr-5"
                  onClick={returnToPrevScreen}
                />
              </div>
              <div className="text-4xl lg:text-3xl font-bold line-clamp-1">
                {getPostSuccess && post.title}
              </div>
            </div>
            <div className="lg:ml-0 lg:max-w-2/5 text-xs text-neutral-500 flex flex-col lg:flex-row lg:items-center gap-2">
              <div className="flex items-center space-x-2 mt-3 lg:mt-0 lg:justify-end">
                {getPostTagsSuccess &&
                  !!tags &&
                  tags.map(({ tag }: { tag: Tag }) => (
                    <div
                      className="rounded-2xl border bg-neutral-100 px-3 py-1 text-xs font-semibold"
                      key={tag.id}
                    >
                      {tag.name}
                    </div>
                ))}
              </div>
              <div className="ml-2 lg:ml-0">
                {getPostSuccess && moment(post.updatedAt).fromNow()}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="flex justify-center mt-5">
            {media && (
              <ImageCarousel>
                {(media as Media[]).map((m, i) => (
                  <div key={i}>
                    <img key={i} src={m.mediaUrl} className="h-[30em] w-[30em] object-cover" />
                  </div>
                ))}
              </ImageCarousel>
            )}
          </div>
          <div className="mx-auto mt-4 mb-6 prose prose-sm lg:prose-lg col-span-2 break-words">
            <div className="quill">{getPostSuccess && renderHTMLData(post.desc)}</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Post;
