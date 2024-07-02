import { useEffect, useState } from "react";
import { Button, SelectTags, Input, SecretInput, Spinner } from "../../components";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useAssignUserTags, useCreateEContact, useGetUser, useGetUserEContact, useGetUserTags, useUpdateUser } from "../../api/user";
import { toast } from "react-toastify";
import { Tag } from "../../types/Tag";
import { useGetTagWithId } from "../../api/tag";

const EditProfile = () => {
  const { data: userData, isSuccess: successUserData } = useGetUser();
  const { data: getEContact, isSuccess: getEContactSuccess } = useGetUserEContact();

  const [username, setUsername] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [eContactName, setEContactName] = useState<string>("");
  const [eContact, setEContact] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const { data: userTags } = useGetUserTags();
  const { data: tags, isSuccess: getTagsSuccess } = useGetTagWithId(userTags?.map((ut:{tagId: number}) => ut.tagId));

  const navigate = useNavigate();
  
  const { mutateAsync: updateUser, isSuccess: updateUserSuccess } = useUpdateUser();
  const { mutateAsync: upsertEContact, isSuccess: upsertEContactSuccess } = useCreateEContact();
  const { mutateAsync: assignUserTags, isSuccess: assignUserTagsSuccess } = useAssignUserTags();

  useEffect(() => {
    if (tags) {
      setSelectedTags(tags);
    }
  }, [getTagsSuccess]);

  useEffect(() => {
    if (successUserData && !!userData) {
      setUsername(userData.username)
      setContact(userData.contact)
    }
  }, [successUserData])

  useEffect(() => {
    console.log(getEContact)
    if (getEContactSuccess && !!getEContact) {
      setEContactName(getEContact?.name)
      setEContact(getEContact?.phoneNumber)
    }
  }, [getEContactSuccess])

  const checkUserChanged = () => {
    if (username !== userData?.username) return true
    if (contact !== userData?.contact) return true
    return false
  }

  const checkEContactChanged = () => {
    if (eContact !== getEContact?.phoneNumber) return true
    if (eContactName !== getEContact?.name) return true
    return false
  }

  const checkTagsChanged = () => {
    const oldTagIds = tags.map((t: Tag) => t.id)
    const postTagIds = selectedTags.map(t => t.id)
    console.log(oldTagIds.sort().toString())
    console.log(postTagIds.sort().toString())
    return oldTagIds.sort().toString() != postTagIds.sort().toString()
  }

  const handleSubmit = async () => {
    setLoading(true)
    try{
      if (checkUserChanged()){
        await updateUser({contact, username})
        toast.success("User succesfully updated")
      }
      if (checkEContactChanged()) {
        await upsertEContact({name: eContactName, phoneNumber: eContact})
        toast.success("Emergency Contact succesfully updated")
      }
      if(checkTagsChanged()) {
        await assignUserTags(selectedTags.map(t => t.id))
        toast.success("Tags succesfully updated")
      }
      if (!checkUserChanged() && !checkEContactChanged() && !checkTagsChanged()) {
        toast.info("No information was modified!")
      }
    } catch (error) {
      toast.error(error as any)
      console.error(error)
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="flex flex-col flex-grow">
      <div className="bg-white justify-center">
        <div className="md:p-10 p-3 mx-0 md:mx-auto md:w-3/5 flex flex-col justify-center rounded-xl border ">
          <div className="flex items-center ml-5 w-full text-gray-700 hover:text-umeed-tangerine-500 cursor-pointer" onClick={() => navigate("/profile")}>
            <ArrowUturnLeftIcon className="w-5 h-5" />
            <div className="text-sm pl-3">Back to Profile</div>
          </div>
          <div className="px-10 py-7">
            <div className="text-center font-cormorant italic text-5xl font-bold text-gray-900">
              Edit Profile
            </div>
            <div className="text-center font-sans text-sm font-light text-gray-600 mt-2 mb-5">
              Once you are happy with your changes, click on save!
            </div>
            <Input
              type="text"
              label="Username"
              onChange={(e) => setUsername(e.target.value)}
              placeholder="john doe"
              value={username}
            />
            <Input
              type="text"
              label="Contact Number"
              onChange={(e) => setContact(e.target.value)}
              placeholder="0412346789"
              value={contact}
            />
            <Input
              type="text"
              label="Emergency Contact Name"
              onChange={(e) => setEContactName(e.target.value)}
              placeholder="Jane Doe"
              value={eContactName}
            />
            <Input
              type="text"
              label="Emergency Contact Number"
              onChange={(e) => setEContact(e.target.value)}
              placeholder="0412346789"
              value={eContact}
            />
            <label className="font-bold font-cormorant text-xl text-gray-600 pb-1 block">
              Tags
            </label>
            <SelectTags selectedTagsState={{ selectedTags, setSelectedTags }} />
            <Button onClick={handleSubmit} styles="mt-5 text-lg w-full">
              {loading ? <Spinner /> : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
