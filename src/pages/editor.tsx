import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ChatDisplay from "../components/Editor/ChatDisplay";
import { useRouter } from "next/router";
import PDFViewer from "src/components/Editor/PDFViewer";
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import axios from "axios";

interface Thread {
  id: number;
  text: string;
  sender: {
    avatar: string;
  };
}

interface Highlight {
  text: string;
  thread: Thread[];
}

interface Search {
  text: string;
  preview: string;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function Editor() {
	const router = useRouter();
	const [mode, setMode] = useState<string>("highlight");

	const [highlights, setHighlights] = useState<Highlight[]>([]);
	const [currentHighlight, setCurrentHighlight] = useState<Highlight | null>(
		null
  );
  const [responseLoading, setResponseLoading] = useState(false);
  const [messageContent, setMessageContent] = useState("");

  const [searches, setSearches] = useState<Search[]>([]);

  const [fileName, setFileName] = useState("");

	// Set search query from URL
	useEffect(() => {
		if (router.isReady) {
			const name = router.query.file as string;
			setFileName(name.replaceAll(" ", "+"));
		}
	}, [router.query, router.isReady]);

  useEffect(() => {
    setHighlights(highlights => highlights.map(highlight => {
      if (highlight.text === currentHighlight?.text) {
        return currentHighlight;
      }
      return highlight;
    }));
  }, [currentHighlight]);

	const tabs = [
		{ name: "Highlight", href: "#", current: mode === "highlight" },
		{ name: "Search", href: "#", current: mode === "search" },
	];

	const handleHighlight = async () => {
		const selection = window.getSelection();
		if (selection?.toString()) {
			if (currentHighlight && selection.toString() === currentHighlight.text) {
				return;
			}

      let newHighlight: Highlight = { text: selection.toString(), thread: [] }
      setHighlights((highlights) => [...highlights, newHighlight]);
			setCurrentHighlight(newHighlight);

      sendMessage(`Explain the following highlighted text in the context of the PDF text: "${selection.toString()}"`);
		}
	}

  const sendMessage = async (text: string) => {
    const prechain = currentHighlight?.thread.map((message: any) => message.text).join("\n");
    const context = ``;

    setCurrentHighlight((currentHighlight) => ({
      text: currentHighlight?.text || "",
      thread: [
        ...(currentHighlight?.thread || []),
        {
          id: (currentHighlight?.thread.length || 0) + 1,
          text: text,
          sender: {
            avatar:
              "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y",
          },
        },
      ],
    }));    

    setResponseLoading(true);
    setMessageContent("");

    const response = (await axios.post("/api/openai_completion", { prechain, context, prompt: text })).data;
    setCurrentHighlight((currentHighlight) => ({
      text: currentHighlight?.text || "",
      thread: [
        ...(currentHighlight?.thread || []),
        {
          id: (currentHighlight?.thread.length || 0) + 1,
          text: response,
          sender: {
            avatar:
            "https://pbs.twimg.com/profile_images/1603113436757389313/wpYDqrIf_400x400.jpg",
          },
        },
      ],
    }));

    setResponseLoading(false);
  }

	return (
		<div onMouseUp={handleHighlight} className="absolute inset-0 flex flex-col w-full h-screen max-h-screen bg-gray-100 min-w-fit">
			{/* <Navbar /> */}
			<div className="flex-1 py-6">
				<div className="h-full max-w-3xl mx-auto sm:px-6 md:grid md:max-w-7xl md:grid-cols-12 md:gap-8 md:px-8">
					<main className="col-span-7">
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

								{mode === "highlight" &&
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

                  {mode === "search" && (
                    <>
                      <h3 className="text-lg font-semibold">Search</h3>

                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                              e.preventDefault();
                            }
                          }}
                          type="text"
                          className="block w-full rounded-md border border-gray-400 pl-10 pr-4 py-2 focus:border-gray-800 sm:text-sm"
                          placeholder="Search here"
                        />
                      </div>

                      {searches.length > 0 ? (
                        <div className="space-y-2">
                          {searches.map((search) => (
                            <div
                              className="px-3 py-2 transition border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
                              key={search.text}
                            >
                              <h3 className="font-medium text-md">
                                {search.text}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {search.preview}...
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-4 text-sm text-center text-gray-500">
                          No searches yet.
                        </div>
                      )}
                    </>  
                  )}
							</div>

							{mode === "highlight" && currentHighlight && (
								<div>
									<div>
										<ChatDisplay threadData={currentHighlight?.thread} responseLoading={responseLoading} />

										<div className="flex items-center space-x-2">
											<input
                        onKeyDown={(e) => {
                          if (e.keyCode === 13) {
                            e.preventDefault();
                            sendMessage(messageContent);
                          }
                        }}
                        value={messageContent}
                        onChange={e => setMessageContent(e.target.value)}
												type="text"
												className="block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm sm:text-sm"
												placeholder="Type your question here"
											/>
											<button
												type="button"
												className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 border border-transparent rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={(e) => {
                          e.preventDefault();
                          sendMessage(messageContent);
                        }}
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
