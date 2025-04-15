import {
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged as _onAuthStateChanged,
    onIdTokenChanged as _onIdTokenChanged,
    User,
    NextOrObserver,
    Unsubscribe
  } from "firebase/auth";
  
  import { auth } from "@/lib/firebase/client-app";
  
  export function onAuthStateChanged(cb: NextOrObserver<User>): Unsubscribe {
    return _onAuthStateChanged(auth, cb);
  }
  
  export function onIdTokenChanged(cb: NextOrObserver<User>): Unsubscribe {
    return _onIdTokenChanged(auth, cb);
  }
  
  export async function signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
  
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  }
  
  export async function signOut(): Promise<void> {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out with Google", error);
    }
  }
  