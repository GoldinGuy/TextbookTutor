import { useEffect, useState } from "react";
import { Disclosure } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'
import Navbar from "../components/Navbar";
import ChatDisplay from "../components/Editor/ChatDisplay";
import { useRouter } from "next/router";
import PDFViewer from "src/components/Editor/PDFViewer";
import Loader from "src/components/Loader";
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
  results: string[];
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
  const [isSearching, setIsSearching] = useState(false);
  const [currentSearch, setCurrentSearch] = useState<Search | null>(
		null
  );
  const [searchContent, setSearchContext] = useState("");

  const [fileName, setFileName] = useState("");
  
  useEffect(() => {
    if (fileName.length > 0) {
      fetch(`/api/get_semantic?file=${fileName}&query=${'test'}`).then((res) => res.json()).then((data) => {
        console.log("data", data);
        if (data.length === 0) {
           fetch(`/api/upload_embeddings?file=${fileName}`);
        }
      }).catch((err) => {
        console.log(err);
      });
    }
  }, [fileName]);

  const handleSemanticSearch = (query: string) => {
    setIsSearching(true);
		if (fileName.length > 0) {
			fetch(`/api/get_semantic?file=${fileName}&query=${query}`)
				.then((res) => res.json())
				.then((data) => {
          const { results } = data;
          const newSearch = { text: query, results };
          setSearches((searches) => [...searches, newSearch]);
          setCurrentSearch(newSearch);
          setSearchContext("");
          setIsSearching(false);
				})
				.catch((err) => {
          console.log(err);
          setSearchContext("");
           setIsSearching(false);
				});
		}
	};

	// Set file query from URL
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

      sendMessage(`Explain the following highlighted text: "${selection.toString()}"`);
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
              `https://api.dicebear.com/5.x/fun-emoji/svg`,
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
            "/assets/logo.png",
          },
        },
      ],
    }));

    setResponseLoading(false);
  }

	return (
		<div
			onMouseUp={handleHighlight}
			className="absolute inset-0 flex flex-col w-full min-h-screen bg-gray-100 min-w-fit"
		>
			<Navbar />
			<div className="flex-1 py-6">
				<div className="h-full max-w-3xl mx-auto sm:px-6 md:grid md:max-w-7xl md:grid-cols-12 md:gap-8 md:px-8">
					<main className="col-span-7">
						{fileName?.length > 0 && (
							<PDFViewer
								pdfUrl={process.env.NEXT_PUBLIC_AWS_BUCKET_URL + fileName}
							/>
						)}
					</main>
					<aside className="col-span-5 xl:block">
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
												<div className="text-center">
                          <img src="/assets/empty.svg" className="mx-auto" style={{ width: "250px" }} />
                          <div className="py-4 text-sm text-center text-gray-500">
                            No highlights yet.
                          </div>
                        </div>
											)}
										</>
									))}

								{mode === "search" && (
                  (currentSearch ? (
										<>
											<div></div>

											<span
												className="text-sm text-gray-600 cursor-pointer"
												onClick={() => setCurrentSearch(null)}
											>
												&larr; Back
											</span>

											<div>
												<span className="block mb-1 text-xs font-medium text-gray-800">
													Search Query
												</span>
												<span className="inline text-lg">
													{currentSearch.text}
												</span>
											</div>

                      <div>
                        <div className="max-w-4xl mx-auto divide-y divide-gray-900/10">
                          <dl className="space-y-6 divide-y divide-gray-900/10">
                            <span className="text-sm italic text-gray-500">{currentSearch.results.length} results</span>
                            {currentSearch.results.map((result) => (
                              <Disclosure as="div" key={result} className="pt-6">
                                {({ open }) => (
                                  <>
                                    <dt>
                                      <Disclosure.Button className="flex items-start justify-between w-full text-left text-gray-900">
                                        <span className="text-base font-semibold leading-7">{result.substring(0,45)}...</span>
                                        <span className="flex items-center ml-6 h-7">
                                          {open ? (
                                            <PlusSmallIcon className="w-6 h-6" aria-hidden="true" />
                                          ) : (
                                            <MinusSmallIcon className="w-6 h-6" aria-hidden="true" />
                                          )}
                                        </span>
                                      </Disclosure.Button>
                                    </dt>
                                    <Disclosure.Panel as="dd" className="pr-12 mt-2">
                                      <p className="text-base leading-7 text-gray-600">{result}</p>
                                    </Disclosure.Panel>
                                  </>
                                )}
                              </Disclosure>
                            ))}
                          </dl>
                        </div>
                      </div>
										</>
									) : (
                    <>
                      <h3 className="text-lg font-semibold">Search</h3>

                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <MagnifyingGlassIcon
                            className="w-5 h-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                        <input
                          value={searchContent}
                          onChange={(e) => setSearchContext(e.target.value)}
                          readOnly={isSearching}
                          onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                              e.preventDefault();
                              handleSemanticSearch(searchContent);
                            }
                          }}
                          type="text"
                          className="block w-full py-2 pl-10 pr-4 border border-gray-400 rounded-md focus:border-gray-800 sm:text-sm"
                          placeholder="Search here"
                        />
                      </div>

                      {isSearching && (
                        <Loader />
                      )}

                      {searches.length > 0 ? (
                        <div className="space-y-2">
                          {searches.map((search) => (
                            <div
                              className="px-3 py-2 transition border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
                              onClick={() => setCurrentSearch(search)}
                              key={search.text}
                            >
                              <h3 className="font-medium text-md">
                                {search.text}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {search.results.length} results
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center">
                          <img src="/assets/empty.svg" className="mx-auto" style={{ width: "250px" }} />
                          <div className="py-4 text-sm text-center text-gray-500">
                            No searches yet.
                          </div>
                        </div>
                      )}
                    </>
                  )
								))}
							</div>

							{mode === "highlight" && currentHighlight && (
								<div>
									<div>
										<ChatDisplay
											threadData={currentHighlight?.thread}
											responseLoading={responseLoading}
										/>

										<div className="flex items-center space-x-2">
											<input
												onKeyDown={(e) => {
													if (e.keyCode === 13) {
														e.preventDefault();
														sendMessage(messageContent);
													}
												}}
												value={messageContent}
												onChange={(e) => setMessageContent(e.target.value)}
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
