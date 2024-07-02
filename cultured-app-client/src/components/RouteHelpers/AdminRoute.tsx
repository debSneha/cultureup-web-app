import { useAuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useGetUser } from "../../api/user";

type Props = {
    children: JSX.Element
}

const AdminRoute = ({children} : Props) => {
    const authToken = useAuthContext();
    const {data: resUser, isLoading} = useGetUser();
    if (authToken && !isLoading && resUser?.userType == "USER"){
        return <Navigate to='/'/>
    } 

    return children
}
 
export default AdminRoute;