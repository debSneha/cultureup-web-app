import { auth } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Button, Input, SecretInput, Spinner } from "../../components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { useCreateUser } from "../../api/user";
import { RegUser } from "../../types/User";
import { useFirebaseAuthErrorHandler, useFormValidator } from "../../hooks";
import CheckboxInput from "../../components/Input/CheckboxInput";
import AllHandsIn from '../../assets/all_hands_in.png'
import LogoAlpha from '../../assets/cup-logo-alpha.png'

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { handleFirebaseAuthError } = useFirebaseAuthErrorHandler();
  const { checkEmptyFields, checkMatchingFields } = useFormValidator();

  const { mutate: registerUser } = useCreateUser();

  const handleError = (error: FirebaseError) => {
    toast.error(handleFirebaseAuthError(error));
  };

  const validateForm = () => {
    if (!checkEmptyFields([email, username, contact, password, confirmPassword])) {
      toast.error("All required fields are not filled up.");
      return false;
    }
    if (!checkMatchingFields(password, confirmPassword)) {
      toast.error("Make sure your password match up!");
      return false;
    }
    return true;
  };

  const handleSuccess = () => {
    const newUser : RegUser = {
      email: email,
      contact: contact,
      username: username,
      userType: "USER",
      firebaseUid: auth.currentUser!.uid
    }
    registerUser(newUser);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => handleSuccess())
      .catch((e) => handleError(e))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 grid md:grid-cols-2">
      <div className="md:p-10 p-3 mx-0 md:mx-auto md:w-full md:max-w-md flex flex-col justify-center">
        <div className="flex justify-center">
          <img src={LogoAlpha} alt="Cultured Up All Logo" className="object-cover w-24 h-20"/>
        </div>
        <div className="px-5 pb-7">
          <div className="text-center font-cormorant italic text-5xl font-bold text-gray-900">
            Welcome!
          </div>
          <div className="text-center font-sans text-sm font-light text-gray-600 mt-2 mb-5">
            Enter your details to get started.
          </div>
          <Input
            type="text"
            label="Email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@doe.com"
          />
          <Input
            type="text"
            label="Username"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="john doe"
          />
          <Input
            type="text"
            label="Contact Number"
            onChange={(e) => setContact(e.target.value)}
            placeholder="0412346789"
          />
          <SecretInput
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters."
          />
          <SecretInput
            label="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Make sure it matches!"
          />
          <div className="mb-5">
            <div className="text-left whitespace-nowrap">
              <CheckboxInput label="I agree to the terms of service"/>
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            styles="mt-5 text-lg w-full"
          >
            {loading ? <Spinner /> : "Register"}
          </Button>
        </div>
        <div className="text-center font-cormorant text-md text-gray-900 mt-5">
          Already have an account? <span className="font-bold hover:underline cursor-pointer" onClick={() => navigate("/login")}>Login</span>
        </div>
      </div>
      <div className="hidden md:block">
        <img src={AllHandsIn} alt="all hands in" className="object-cover w-full h-full"/>
      </div>
    </div>
  );
};

export default Register;
