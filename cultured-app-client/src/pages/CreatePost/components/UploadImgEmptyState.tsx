import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { IPreviewItems } from "../CreatePost";

interface IProps {
  preview: IPreviewItems[];
}

const UploadImgEmptyState = ({preview}: IProps) => {

  return preview.length == 0 ? (
    <div className="flex flex-col items-center justify-center">
      <i>
        <CloudArrowUpIcon className="h-10 w-10 text-gray-800" />
      </i>
      <p className="text-md text-gray-600 font-light">
        Browse and choose files from your device
      </p>
    </div>
  ) : (
    <></>
  );
};

export default UploadImgEmptyState;
