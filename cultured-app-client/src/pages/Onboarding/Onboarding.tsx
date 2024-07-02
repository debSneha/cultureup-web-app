import { useEffect, useState } from "react";
import InterestsStep from "./InterestsStep";
import EContactStep from "./EContactStep";
import AllHandsIn from "../../assets/all_hands_in.png";
import {
  useAssignUserTags,
  useCreateEContact,
  useGetUserEContact,
  useGetUserTags,
  useUpdateUser,
} from "../../api/user";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { auth } from "../../config/firebase";
import { SelectOption } from "./InterestsStep";
import { useGetTagWithId } from "../../api/tag";
import { useFormValidator } from "../../hooks";

const Onboarding = () => {
  const [pageNum, setPageNum] = useState<number>(0);

  //input field states are managed here to disguise a single form as 2 pages
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync: registerEContact } = useCreateEContact();
  const { mutateAsync: assignUserTags } = useAssignUserTags();
  const { mutateAsync: updateUser } = useUpdateUser();

  const { data: eContact, isSuccess: getEContactSuccess } = useGetUserEContact();
  const { data: userTags } = useGetUserTags();
  const { data: tags, isSuccess: getTagsSuccess } = useGetTagWithId(userTags?.map((ut:{tagId: number}) => ut.tagId));

  const { checkEmptyFields } = useFormValidator()


  const handleSubmit = async () => {
    if (!checkEmptyFields([name, phoneNumber])) {
      toast.error("All required fields are not filled up.");
      return;
    }
    if (selectedTags.length <= 0) {
      toast.error("Please pick your interests.")
      return;
    }

    try {
      // using mutateAsync makes sure that one does not happen before the other.
      await registerEContact({
        name: name,
        phoneNumber: phoneNumber,
      });
      await assignUserTags(selectedTags.map(o => o.value));
      await updateUser({
        onboarded: true,
      });
      toast.success("You're onboarded!");
      navigate("/");
      // needs to be invalidated for dashboard to load properly
      queryClient.removeQueries(["user-tags"])
      queryClient.removeQueries(["tags"])
    } catch (err: any) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  // used to prefill values if any were present
  useEffect(() => {
    if (getEContactSuccess && eContact) {
      setName(eContact.name)
      setPhoneNumber(eContact.phoneNumber)
    }
  }, [getEContactSuccess])

  useEffect(() => {
    if (getTagsSuccess && tags) {
      console.log("TAGS", tags)
      setSelectedTags(tags.map((t:{id:number, name:string}) => ({value: t.id, label: t.name})))
    }
  }, [getTagsSuccess])

  const onboardingSteps = [
    {
      component: (
        <EContactStep
          setPageNum={setPageNum}
          nameState={{ name, setName }}
          phoneNumberState={{ phoneNumber, setPhoneNumber }}
        />
      ),
      label: "Emergency Contact",
    },
    {
      component: (
        <InterestsStep
          handleSubmit={handleSubmit}
          loading={loading}
          selectedTagsState={{ selectedTags, setSelectedTags }}
        />
      ),
      label: "Interests",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 grid md:grid-cols-2">
      <div className="p-10 mx-0 md:mx-auto md:w-full md:max-w-md top-0">
        <nav className="flex">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {onboardingSteps.map((step, idx) => (
              <li key={idx}>
                <div className="flex items-center">
                  {idx != 0 && (
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  )}
                  <div
                    onClick={() => setPageNum(idx)}
                    className={`ml-1 text-sm font-medium ${
                      pageNum == idx
                        ? "text-gray-400 cursor-default"
                        : "text-gray-700 hover:text-umeed-tangerine-500 cursor-pointer"
                    } md:ml-2`}
                  >
                    {step.label}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </nav>
        <div className="h-full md:p-10 p-3 mx-0 md:mx-auto md:w-full md:max-w-md flex flex-col justify-center">
          {onboardingSteps[pageNum].component}
        </div>
      </div>
      <div className="hidden md:block">
        <img
          src={AllHandsIn}
          alt="all hands in"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default Onboarding;
