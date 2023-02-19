import { useEffect } from 'react'
import { useRouter } from "next/router"
import { firebaseAuth } from "src/utils/firebaseAuth";
import { useAuthState } from "react-firebase-hooks/auth";

const SignOut = () => {
  const router = useRouter();
  const [user] = useAuthState(firebaseAuth);

  useEffect(() => {
    console.log("sign out")
    router.push("/");
  }, [router]);

	return (
		<div>Signing out...</div>
	);
};
export default SignOut;
