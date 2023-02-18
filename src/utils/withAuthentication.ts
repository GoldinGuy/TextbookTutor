import { useRouter } from "next/router";
import React, { useEffect, ComponentType } from "react";
import { firebaseAuth } from "./firebaseAuth";
import {
	useAuthState
} from "react-firebase-hooks/auth";

const withAuthentication = (Component: any) => {
  const AuthenticatedComponent = (props: any) => {
    const [user] = useAuthState(firebaseAuth);
    const router = useRouter();

    useEffect(() => {
      if (user?.displayName === null) {
        router.push("/login");
      }
    }, [user, router]);

    if (!user) {
      return null; // or a loading spinner, or a login component
    }

    return "";
  };

  return AuthenticatedComponent;
};

export default withAuthentication;
