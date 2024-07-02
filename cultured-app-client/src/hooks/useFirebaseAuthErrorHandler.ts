import { FirebaseError } from "firebase/app";

const useFirebaseAuthErrorHandler = () => {

    // if empty str returned then no error
    const handleFirebaseAuthError = (error: FirebaseError) => {
        if (
          error.code === "auth/wrong-password" ||
          error.code === "auth/user-not-found"
        ) {
          return "Incorrect username or password.";
        }
        if (error.code === "auth/invalid-email") {
          return "Please check your email";
        }
        if (error.code === "auth/weak-password") {
          return "Your password should at least be 6 characters long";
        }
        if (error.code === "auth/email-already-in-use") {
          return "That email is already associated with an account";
        }
        console.error(error)
        return "Internal error occured.";
    };

    const handleFirebaseResetPasswordError = (error: FirebaseError) => {
      if (error.code === "auth/user-not-found") {
        return "User not found. Please register with us.";
      }
      if (error.code === "auth/invalid-email") {
        return "Please check your email";
      }
      console.error(error);
      return "Internal error occured.";
    };

    return {
        handleFirebaseAuthError,
        handleFirebaseResetPasswordError
    }
}

export default useFirebaseAuthErrorHandler;