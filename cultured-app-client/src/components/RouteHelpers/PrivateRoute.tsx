import { useAuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useGetUser } from "../../api/user";

type Props = {
    children: JSX.Element
}

const PrivateRoute = ({children} : Props) => {
    const authToken = useAuthContext();
    const {data: resUser, isLoading} = useGetUser();

    if (!authToken) {
        return <Navigate to='/login'/>
    }

    if (isLoading || !resUser) 
        return <></>

    if (!resUser.onboarded){
        return <Navigate to='/onboarding'/>
    } 

    return children
}
 
export default PrivateRoute;