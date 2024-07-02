import { XMarkIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import { Button } from "../../../components";
import { IPreviewItems, IThumbnail,  } from "../CreatePost";

interface IProps {
  img: IPreviewItems
  thumbnail : IThumbnail | undefined
  removeImage: (url: string, filename: string) => void
  setThumbnail: (value: React.SetStateAction<IThumbnail | undefined>) => void
}

const UploadedImage = ({img, thumbnail, removeImage, setThumbnail} : IProps) => {
  return ( 
    <div className={`relative group rounded-md flex justify-center ${
      img.url == thumbnail?.url
            ? "border-4 border-umeed-tangerine-300 duration-100"
            : ""
    }`}>
      <img
        src={img.url}
        alt=""
        className={`w-56 h-56 object-cover rounded group-hover:opacity-30 ${
          img.url == thumbnail?.url
            ? "m-1 duration-100"
            : ""
        }`}
      />
      <div
        className="flex justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full transition-all opacity-0 
        group-hover:opacity-100 "
      >
        <Button
          styles="w-fit border-r border-black"
          onClick={() => {
            removeImage(img.url, img.filename);
          }}
        >
          <XMarkIcon className="h-6 w-6 " />
        </Button>
        <Button
          styles="w-fit"
          onClick={() =>
            setThumbnail({
              url: img.url,
              filename: img.filename,
            })
          }
        >
          <BookmarkIcon className="h-6 w-6 " />
        </Button>
      </div>
    </div>
   );
}
 
export default UploadedImage;