// modules/user/services/googleAuthService.js
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/core/firebase/firebaseClient";

export const loginWithGoogleFirebase = async () => {
  const result = await signInWithPopup(auth, googleProvider);

  const user = result.user;

  const idToken = await user.getIdToken();

  return {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    photo: user.photoURL,
    idToken,
  };
};
