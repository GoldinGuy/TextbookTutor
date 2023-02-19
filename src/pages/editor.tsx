import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ChatDisplay from "../components/Editor/ChatDisplay";
import { useRouter } from "next/router";
import PDFViewer from "src/components/Editor/PDFViewer";

interface Thread {
  id: number;
  text: string;
  sender: {
    avatar: string;
    name: string;
  };
}

interface Highlight {
  text: string;
  thread: Thread[];
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function Editor() {
	const [mode, setMode] = useState<string>("highlighting");
	const [highlights, setHighlights] = useState<Highlight[]>([]);
	const [currentHighlight, setCurrentHighlight] = useState<Highlight | null>(
		null
  );
  const [fileName, setFileName] = useState("");
	const router = useRouter();

	// Set search query from URL
	useEffect(() => {
		if (router.isReady) {
			const name = router.query.file as string;
			setFileName(name.replaceAll(" ", "+"));
		}
	}, [router.query, router.isReady]);

	const tabs = [
		{ name: "Highlighting", href: "#", current: mode === "highlighting" },
		{ name: "Search", href: "#", current: mode === "search" },
	];

	function handleHighlight() {
		const selection = window.getSelection();
		if (selection?.toString()) {
			if (currentHighlight && selection.toString() === currentHighlight.text) {
				return;
			}

			const newHighlight = {
				text: selection.toString(),
				thread: [
					{
						id: 1,
						text: "Explain highlight",
						sender: {
							avatar:
								"https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y",
							name: "sender 1",
						},
					},
					{
						id: 2,
						text: "[highlight explanation]",
						sender: {
							avatar:
								"https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y",
							name: "sender 1",
						},
					},
				],
			};

			setHighlights((highlights) => [...highlights, newHighlight]);
			setCurrentHighlight(newHighlight);
		}
	}

	return (
		<div
			onMouseUp={handleHighlight}
			className="absolute inset-0 flex flex-col w-full h-screen max-h-screen bg-gray-100 min-w-fit"
		>
			{/* <Navbar /> */}
			<div className="flex-1 py-6">
				<div className="h-full max-w-3xl mx-auto sm:px-6 md:grid md:max-w-7xl md:grid-cols-12 md:gap-8 md:px-8">
					<main className="col-span-7">
						{/* <h1>Highlight me</h1> */}
						{/* <PDFViewer pdfUrl="https://filebin.net/5a0n92utjzuztsis/dummy.pdf" /> */}
						{/* {process.env.NEXT_PUBLIC_AWS_BUCKET_URL + fileName} */}
						{fileName?.length > 0 && (
							<PDFViewer
								pdfUrl={process.env.NEXT_PUBLIC_AWS_BUCKET_URL + fileName}
							/>
						)}
					</main>
					<aside className="col-span-5 overflow-hidden xl:block">
						<div className="sticky flex flex-col justify-between h-full p-5 space-y-4 bg-white rounded-md shadow-md top-6">
							<div className="space-y-6">
								<div className="hidden sm:block">
									<nav className="flex -mb-px space-x-8 ">
										{tabs.map((tab) => (
											<a
												key={tab.name}
												href={tab.href}
												onClick={(e) => {
													e.preventDefault();
													setMode(tab.name.toLowerCase());
												}}
												className={classNames(
													tab.current
														? "border-indigo-500 text-indigo-600"
														: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
													"whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
												)}
												aria-current={tab.current ? "page" : undefined}
											>
												{tab.name}
											</a>
										))}
									</nav>
								</div>

								{mode === "highlighting" &&
									(currentHighlight ? (
										<>
											<div></div>

											<span
												className="text-sm text-gray-600 cursor-pointer"
												onClick={() => setCurrentHighlight(null)}
											>
												&larr; Back
											</span>

											<div>
												<span className="block mb-1 text-xs font-medium text-gray-800">
													Current Highlight
												</span>
												<span className="inline bg-yellow-300 py-0.5 px-2 rounded-sm">
													{currentHighlight.text}
												</span>
											</div>
										</>
									) : (
										<>
											<h3 className="text-lg font-semibold">Highlights</h3>
											{highlights.length > 0 ? (
												<div className="space-y-2">
													{highlights.map((highlight) => (
														<div
															className="px-3 py-2 transition border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
															onClick={() => setCurrentHighlight(highlight)}
															key={highlight.text}
														>
															<h3 className="font-medium text-md">
																{highlight.text}
															</h3>
															<p className="text-sm text-gray-500">
																{highlight.thread.length} messages
															</p>
														</div>
													))}
												</div>
											) : (
												<div className="py-4 text-sm text-center text-gray-500">
													No highlights yet.
												</div>
											)}
										</>
									))}
							</div>

							{mode === "highlighting" && currentHighlight && (
								<div>
									<div>
										<ChatDisplay threadData={currentHighlight?.thread} />

										<div className="flex items-center space-x-2">
											<input
												type="text"
												className="block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm sm:text-sm"
												placeholder="Type your question here"
											/>
											<button
												type="button"
												className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 border border-transparent rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
											>
												Send
											</button>
										</div>
									</div>
								</div>
							)}
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
}
