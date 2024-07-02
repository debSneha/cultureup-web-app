import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";


const Signout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    signOut(auth)
    sessionStorage.clear()
    navigate('/login')
  },[])

  return ( <>Signing out...</> );
}
 
export default Signout;