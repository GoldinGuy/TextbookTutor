import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import FileDropzone from "../components/FileDropzone";

const navigation = [
	{ name: "Product", href: "#" },
	{ name: "Features", href: "#" },
	{ name: "Marketplace", href: "#" },
	{ name: "Company", href: "#" },
];

const HomePage = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [sampleFiles, setSampleFiles] = useState<string[]>([]);

	useEffect(() => {
		if (sampleFiles.length === 0) {
			fetch("/api/get_samples")
				.then((res) => res.json())
				.then((data) => {
					if (data) {
						// console.log("data", data);
						data.map((file: any) => {
							setSampleFiles((prev) => [...prev, file.Key.replace(" ", "+")]);
						});
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [sampleFiles]);

	return (
		<div className="bg-white isolate">
			<div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
				<svg
					className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
					viewBox="0 0 1155 678"
				>
					<path
						fill="url(#9b2541ea-d39d-499b-bd42-aeea3e93f5ff)"
						fillOpacity=".3"
						d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
					/>
					<defs>
						<linearGradient
							id="9b2541ea-d39d-499b-bd42-aeea3e93f5ff"
							x1="1155.49"
							x2="-78.208"
							y1=".177"
							y2="474.645"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#9089FC" />
							<stop offset={1} stopColor="#FF80B5" />
						</linearGradient>
					</defs>
				</svg>
			</div>
			<div className="px-6 pt-6 lg:px-8">
				<nav className="flex items-center justify-between" aria-label="Global">
					<div className="flex lg:flex-1">
						<a href="#" className="-m-1.5 p-1.5">
							<span className="sr-only">Your Company</span>
							<img
								className="h-8"
								src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
								alt=""
							/>
						</a>
					</div>
					<div className="flex lg:hidden">
						<button
							type="button"
							className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
							onClick={() => setMobileMenuOpen(true)}
						>
							<span className="sr-only">Open main menu</span>
							<Bars3Icon className="w-6 h-6" aria-hidden="true" />
						</button>
					</div>
					<div className="hidden lg:flex lg:gap-x-12">
						{navigation.map((item) => (
							<a
								key={item.name}
								href={item.href}
								className="text-sm font-semibold leading-6 text-gray-900"
							>
								{item.name}
							</a>
						))}
					</div>
					<div className="hidden lg:flex lg:flex-1 lg:justify-end">
						<a
							href="#"
							className="text-sm font-semibold leading-6 text-gray-900"
						>
							Log in <span aria-hidden="true">&rarr;</span>
						</a>
					</div>
				</nav>
			</div>
			<main>
				<div className="relative py-16 sm:py-24 lg:pb-40">
					<div className="px-6 mx-auto max-w-7xl lg:px-8">
						<div className="max-w-2xl mx-auto text-center">
							<h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-6xl">
								Reading textbooks just got easier
							</h1>
							<p className="mt-6 text-lg leading-8 text-gray-600">
								Easily understand your textbooks with our AI-powered, chat-based
								explanations and semantic search.
							</p>
						</div>
						<div className="flex flex-col items-center justify-center mt-16 sm:mt-24">
							<FileDropzone />

							{sampleFiles.length > 0 && (
								<div className="flex mt-20 mb-8 text-center">
									Or try a textbook others have uploaded:
								</div>
							)}

							<div className="flex flex-row">
								{sampleFiles.map((file, i) => {
									return (
										<a
											key={i}
											href={process.env.NEXT_PUBLIC_AWS_BUCKET_URL + file}
											target="_blank"
											data-attr="textbook"
											rel="noreferrer"
											title={file}
											id={file}
											className="flex justify-center"
										>
											<div className="relative flex flex-row items-center m-2 text-sm font-normal rounded w-36 h-52 bg-fuchsia-50 hover:scale-105 hover:shadow-xl">
												<div className="absolute top-0 right-0 ml-5 text-col">
													<h3 className="float-left w-full px-3 py-3 font-semibold">
														{file.replace("+", " ").replace(".pdf", "")}
													</h3>
													<p className="float-left w-full px-3 pb-2 text-xs italic ">
														Uploaded by Dewey user on 2/18/23
													</p>
												</div>
												<div
													className="h-full px-1 py-1 text-xs font-semibold text-gray-700 capitalize bg-gray-200 whitespace-nowrap overflow-ellipsis"
													style={{ writingMode: "vertical-lr" }}
												>
													#dewey
												</div>
											</div>
										</a>
									);
								})}
							</div>
						</div>
					</div>
					<div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
						<svg
							className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
							viewBox="0 0 1155 678"
						>
							<path
								fill="url(#b9e4a85f-ccd5-4151-8e84-ab55c66e5aa1)"
								fillOpacity=".3"
								d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
							/>
							<defs>
								<linearGradient
									id="b9e4a85f-ccd5-4151-8e84-ab55c66e5aa1"
									x1="1155.49"
									x2="-78.208"
									y1=".177"
									y2="474.645"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="#9089FC" />
									<stop offset={1} stopColor="#FF80B5" />
								</linearGradient>
							</defs>
						</svg>
					</div>
				</div>
			</main>
		</div>
	);
};
export default HomePage;
