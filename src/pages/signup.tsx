import { useState } from 'react'
import { firebaseAuth } from "src/utils/firebaseAuth";
import {
	useAuthState,
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
		<div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Make an account to start reading</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Before you continue, please make an account!
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div>
          <a
            href="#"
            onClick={formSubmit}
            className="inline-flex items-center w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 space-x-3"
          >
            <img className="w-6 h-6" src="https://freesvg.org/img/1534129544.png" alt="google" />
            <span className="text-md">Sign in with Google</span>
          </a>
        </div>
      </div>
    </div>
	);
};
export default HomePage;
