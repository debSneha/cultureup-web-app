import { createContext, useContext } from "react";
import { User } from "firebase/auth";

const AuthContext = createContext<string | null>(null)

export function useAuthContext() {
    return useContext(AuthContext);
}

export default AuthContext;