import { useGetUser } from "../../api/user";
import UserPosts from "./components/UserPosts";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { data, isSuccess } = useGetUser();
  const navigate = useNavigate();
  
  const renderAdminLink = () => {
    if ( isSuccess && data?.userType == "ADMIN" ) {
      return (
        <button
          onClick={() => navigate("/admin")}
          className="border-gray-400 border w-1/3 px-4 py-1 hover:bg-black hover:text-white hover:border-black duration-300"
        >
          Admin
        </button>
      )
    }
  }

  return (
    <div className="flex flex-col items-center justify-center flex-grow bg-white w-full px-4 md:px-0">
      <div className="bg-white border w-full md:max-w-lg rounded-xl mb-5">
        <div className="py-6">
          <div className=" text-center">
            <h3 className="mb-1 text-2xl font-bold leading-normal text-black">
              @{isSuccess && data.username}
            </h3>
            <div className="flex flex-row justify-center w-full mx-auto space-x-2 text-center">
              <div className="text-sm font-bold tracking-wide text-gray-60 font-mono">
                {isSuccess && data.roleType == "ADMIN"
                  ? "Cultured UP Admin"
                  : "Cultured UP User"}
              </div>
            </div>
          </div>
          <div className="pt-6 mx-6 mt-6 text-center border-t border-gray-200">
            <div className="flex flex-wrap justify-center">
              <div className="px-6">
                <div className="grid grid-cols-2">
                  <div className="font-semibold ">Contact</div>
                  <div>{isSuccess && data.contact}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="font-semibold">Email</div>
                  <div>{isSuccess && data.email}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full items-center mt-6">
              <button
                onClick={() => navigate("/profile/edit")}
                className="border-gray-400 w-1/3 border px-4 py-1 hover:bg-black hover:text-white hover:border-black duration-300"
              >
                Edit Profile
              </button>
              {renderAdminLink()}
            </div>
          </div>
        </div>
      </div>
      <UserPosts />
    </div>
  );
};

export default Profile;
