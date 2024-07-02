import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AllHandsIn from '../../assets/all_hands_in.png'
import { Button, Input, Spinner } from "../../components";
import LogoAlpha from '../../assets/cup-logo-alpha.png'
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase";
import { toast } from "react-toastify";
import { useFirebaseAuthErrorHandler } from "../../hooks";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { handleFirebaseResetPasswordError } = useFirebaseAuthErrorHandler();


  const handleSubmit = () => {
    setLoading(true)

    sendPasswordResetEmail(auth, email)
      .then(() => toast.success("Instructions sent to your inbox!"))
      .catch((e) => toast.error(handleFirebaseResetPasswordError(e)))
      .finally(() => setLoading(false))
  }

  return ( 
      <div className="min-h-screen bg-gray-50 grid md:grid-cols-2">
        <div className="md:p-10 p-3 mx-0 md:mx-auto md:w-full md:max-w-md flex flex-col justify-center">
          <div className="flex justify-center">
            <img src={LogoAlpha} alt="Cultured Up All Logo" className="object-cover w-24 h-20"/>
          </div>
          <div className="px-5 pb-7">
            <div className="text-center font-cormorant italic text-5xl font-bold text-gray-900">
              Forgot your password?
            </div>
            <div className="text-center font-sans text-sm font-light text-gray-600 mt-5 mb-5">
              Don't fret! We'll send you reset instructions.
            </div>
            <Input
              type="text"
              label="Email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@doe.com"
            />
            
            <Button
              onClick={handleSubmit}
              styles="mt-5 text-lg w-full"
            >
              {loading ? <Spinner /> : "Send"}
            </Button>
          </div>
          <div className="text-center font-cormorant text-md text-gray-900 mt-5">
            Reset done? <span className="font-bold hover:underline cursor-pointer" onClick={() => navigate("/login")}>Back to Login</span>
          </div>
        </div>
        <div className="hidden md:block">
          <img src={AllHandsIn} alt="all hands in" className="object-cover w-full h-full"/>
        </div>
      </div>
   );
}
 
export default ResetPassword;