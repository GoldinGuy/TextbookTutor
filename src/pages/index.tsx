import { firebaseAuth } from "src/utils/firebaseAuth";
import {
	useAuthState,
	useSignInWithApple,
	useSignInWithGoogle,
} from "react-firebase-hooks/auth";

const HomePage = () => {
const [signInWithGoogle, loading, error] = useSignInWithGoogle(firebaseAuth);
	const [user] = useAuthState(firebaseAuth);

  const formSubmit = async () => {
    await signInWithGoogle().then((res) => {
      console.log(JSON.stringify(res?.user));
			console.log(JSON.stringify(user));
    }).catch((e => console.log(e)));
    }


	return (
		<div>
			<h1>Home</h1>
			<button
				className="px-5 py-2 my-5 text-xl text-white bg-gray-700 border border-gray-50 border-opacity-50  rounded-full cursor-pointer bg-opacity-20 text-opacity-90 hover:bg-opacity-50 hover:bg-blue-500 transform hover:scale-[1.05] transition-all group "
				onClick={() => formSubmit()}
			>
				<span className="text-md filter grayscale group-hover:grayscale-0">
					test
				</span>
			</button>
		</div>
	);
};
export default HomePage;
