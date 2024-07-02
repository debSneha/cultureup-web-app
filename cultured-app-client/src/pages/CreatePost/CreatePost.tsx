import { auth, storage } from "../../config/firebase";
import { Button, Input, Spinner, FileInput, Editor } from "../../components";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  useAssignPostTags,
  useCreateMedia,
  useCreatePost,
  useDeletePostMedia,
  useGetPost,
  useGetPostMedia,
  useGetPostTags,
} from "../../api/post";
import { Media, Post } from "../../types/Post";
import { useGetTagWithId, useSearchTags } from "../../api/tag";
import { Tag } from "../../types/Tag";
import Select, { MultiValue } from "react-select";
import React from "react";
import { useFormValidator } from "../../hooks";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate } from "react-router-dom";
import { SelectOption } from "../../components/SelectTags/SelectTags";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import UploadImgEmptyState from "./components/UploadImgEmptyState";
import UploadedImage from "./components/UploadedImage";
import { selectTheme } from "../../components/SelectTags/theme";




export type IPreviewItems = {
  url: string;
  filename: string;
  isFirebaseUrl: boolean;
};

export type IThumbnail = {
  url: string;
  filename: string;
};

const CreatePost = () => {
  const [mediaUpload, setMediaUpload] = useState<File[]>([]);
  const [searchTagsKeyword, setSearchTagsKeyword] = useState<string>("");
  const { data, refetch, isLoading } = useSearchTags(searchTagsKeyword);
  const [selectedTags, setSelectedTags] = useState<SelectOption[]>([]);
  const [preview, setPreview] = useState<IPreviewItems[]>([]);
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [editorValue, setEditorValue] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [thumbnail, setThumbnail] = useState<IThumbnail>();
  const { checkEmptyFields } = useFormValidator();
  const params = new URLSearchParams(useLocation().search);
  const refer = React.useRef<HTMLInputElement>(null);

  const { mutateAsync: createMedia } = useCreateMedia();
  const { mutateAsync: createPost } = useCreatePost();
  const { mutateAsync: assignPostTags } = useAssignPostTags();
  const { mutateAsync: deletePostMedia } = useDeletePostMedia();

  const { data: postData, isSuccess: getPostSuccess } = useGetPost(
    parseInt(params.get("postId") as string)
  );
  const { data: postTags } = useGetPostTags(
    parseInt(params.get("postId") as string)
  );
  const { data: tags, isSuccess: getTagsSuccess } = useGetTagWithId(
    postTags?.map((pt: { tagId: number }) => pt.tagId)
  );
  const { data: media, isSuccess: getMediaSuccess } = useGetPostMedia(
    parseInt(params.get("postId") as string)
  );

  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [searchTagsKeyword]);

  useEffect(() => {
    if (getPostSuccess && postData) {
      setTitle(postData.title);
      setAuthor(postData.author);
      setEditorValue(postData.desc);
    }
  }, [getPostSuccess]);

  useEffect(() => {
    if (getTagsSuccess && tags) {
      setSelectedTags(
        tags.map((t: { id: number; name: string }) => ({
          value: t.id,
          label: t.name,
        }))
      );
    }
  }, [getTagsSuccess]);

  useEffect(() => {
    if (getMediaSuccess && media) {
      setPreview(
        media.map((m: Media) => ({
          url: m.mediaUrl,
          filename: "",
          isFirebaseUrl: true,
        }))
      );
      initThumbnail();
    }
  }, [getMediaSuccess]);

  const validateForm = () => {
    if (
      !checkEmptyFields([title, author, editorValue]) ||
      preview.length == 0 ||
      selectedTags.length <= 0
    ) {
      toast.error("All required fields are not filled up.");
      return false;
    }
    if (!thumbnail || thumbnail.url.trim() == "") {
      toast.error("Please select an image as thumbnail");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    let postId;
    const newPost: Post = {
      id: params?.get("postId") ? parseInt(params.get("postId") as string) : 0,
      title: title,
      author: author,
      desc: editorValue,
    };
    try {
      const res = await createPost(newPost);
      await assignPostTags({
        tagIds: selectedTags.map((o) => o.value),
        postId: res.data.id,
      });
      if (params.get("postId")) {
        const postId = parseInt(params.get("postId") as string);
        await deletePostMedia({ postId });
        await sendPreExistingMedia(postId);
      }
      await uploadFile(res.data.id);
      postId = res.data.id
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      toast.success("Post published");
      navigate(`/post/${postId}`)
    }
  };

  const initThumbnail = () => {
    if (params.get("postId")) {
      media.map((m:Media) => {
        if (m.isThumbnail) {
          setThumbnail({url:m.mediaUrl,filename:""})
        }
      })
    }
  }

  const sendPreExistingMedia = async (postId: number) => {
    preview.map(async (p) => {
      if (p.isFirebaseUrl) {
        if (p.url == thumbnail?.url) {
          await sendMediaData(p.url, true, postId);
        } else {
          await sendMediaData(p.url, false, postId);
        }
      }
    });
  };

  const loadOptions = () => {
    if (!isLoading && data) {
      const tags = data as Tag[];
      return tags.map((tag) => ({
        value: tag.id,
        label: tag.name,
      }));
    }
  };

  const onChange = (
    selectedOptions: MultiValue<{
      value: number;
      label: string;
    }>
  ) => {
    setSelectedTags([...selectedOptions]);
  };

  const sendMediaData = async (
    url: string,
    isThumbnail: boolean,
    postId: number
  ) => {
    let media: Media = {
      mediaUrl: url,
      postId,
      isThumbnail,
    };
    await createMedia(media);
  };

  const uploadFile = async (postId: number) => {
    if (mediaUpload !== undefined && mediaUpload?.length) {
      for (let i = 0; i < mediaUpload?.length; i++) {
        const mediaRef = ref(
          storage,
          `${auth.currentUser?.uid}/${mediaUpload[i].name}` + uuidv4()
        );
        const snapshot = await uploadBytes(mediaRef, mediaUpload[i]);
        const url = await getDownloadURL(snapshot.ref);
        if (mediaUpload[i].name == thumbnail?.filename) {
          await sendMediaData(url, true, postId);
        } else {
          await sendMediaData(url, false, postId);
        }
      }
    }
  };

  const checkDuplicateFile = (name: string) =>
    mediaUpload.some((media) => {
      if (media.name === name) {
        return true;
      }
      return false;
    });

  const selectFiles = ({
    currentTarget: { files },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (files && files.length) {
      if (checkDuplicateFile(files[0].name)) {
        toast.error("File already Uploaded !");
      } else {
        setMediaUpload((existing) => [...existing, ...files]);
        let url = URL.createObjectURL(files[0]);
        setPreview((e) => [
          ...e,
          { url, filename: files[0].name, isFirebaseUrl: false },
        ]);
      }
    }
  };

  const removeImage = (url: string, filename: string) => {
    if (thumbnail?.url == url || thumbnail?.filename == filename) {
      setThumbnail({ url: "", filename: "" });
    }
    setPreview(preview.filter((x) => x.url !== url));
    setMediaUpload(mediaUpload.filter((x) => x.name !== filename));
  };

  const renderUploadBtn = () => {
    if (preview.length < 4) {
      return (
        <div>
          <FileInput
            ref={refer}
            type="file"
            onChange={selectFiles}
            hidden
            accept="image/*"
          />
          <Button
            styles="mt-5 w-fit rounded-md"
            onClick={() => refer.current?.click()}
          >
            <PlusIcon className="h-8 w-8 " />
          </Button>
        </div>
      );
    }
  };

  const renderThumbnailInfoMessage = () => {
    if (!thumbnail || thumbnail.url.trim() == "") {
      return (
        <div className="flex flex-col w-full justify-center text-sm text-gray-700 text-center bg-gray-100 rounded-md p-3 mb-2">
          <InformationCircleIcon className="w-5 h-5 mx-auto mb-2" />
          Pick a thumbnail by hovering/clicking on the image and clicking on the
          bookmark icon.
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col flex-grow w-full justify-center items-center mb-10">
      <div className="flex flex-col w-full px-5 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="lg:sticky lg:top-0 items-start justify-center p-5 border-2 border-gray-400 border-dashed rounded-md lg:h-[660px]">
              <div className="h-full flex flex-col justify-center items-center">
                <UploadImgEmptyState preview={preview} />
                <div className="flex flex-col justify-center items-center">
                  {preview.length > 0 && (
                    <>
                      {renderThumbnailInfoMessage()}
                      <div className="grid grid-cols-2 gap-2">
                        {preview.map((img, key) => (
                          <UploadedImage
                            img={img}
                            thumbnail={thumbnail}
                            removeImage={removeImage}
                            setThumbnail={setThumbnail}
                            key={key}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="flex justify-center">{renderUploadBtn()}</div>
              </div>
          </div>
          <div className="flex-grow mt-5">
            <Input
              type="text"
              label="Post Title"
              placeholder="Title here!"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              styles={"focus:outline-umeed-tangerine-300"}
            />

            <Input
              type="text"
              label="Author"
              placeholder="Author of the post"
              onChange={(e) => setAuthor(e.target.value)}
              value={author}
              styles={"focus:outline-umeed-tangerine-300"}
            />

            <label className="font-bold font-cormorant text-xl text-gray-600 pb-1 block">
              Tags
            </label>
            <Select
              closeMenuOnSelect={false}
              isMulti
              options={loadOptions()}
              onInputChange={(keyword) =>
                setSearchTagsKeyword(keyword as string)
              }
              onChange={onChange}
              value={[...selectedTags]}
              theme={selectTheme}
              className="font-sans font-light"
            />
            <div className="mt-10">
              <Editor
                valueState={{ value: editorValue, setValue: setEditorValue }}
              />
            </div>
            <Button styles="mt-5 w-full text-lg" onClick={handleSubmit}>
              {params.get("postId") ? (
                loading ? (
                  <Spinner />
                ) : (
                  "Edit Post"
                )
              ) : loading ? (
                <Spinner />
              ) : (
                "Post"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
