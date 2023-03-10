import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import Loader from "./Loader";
import axios from "axios";

function FileDropzone({ setFile }: { setFile: Function }) {
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const [uploading, setUploadingStatus] = useState(false);
  const [fileMsg, setFileMsg] = useState("Uploading");

  const uploadFile = async (file: File) => {
    if (!uploading) {
      console.log("file to upload", JSON.stringify(file));
      // For UX Info
      if (!file || !file.name.includes(".pdf")) {
				// || file.size > 10000000
				return;
			}
      setUploadingStatus(true);
      // Making a POST request to created earlier API route
      let { data } = await axios.post("/api/upload_file", {
        name: file.name,
        type: file.type,
      });
      setFileMsg("Fetching URL of")
      // Fetching out an URL
      const url = data.url;
      console.log("url: ", url);
      // Uploading a file
      let { data: newData } = await axios.put(url, file, {
        headers: {
          "Content-type": file.type,
          "Access-Control-Allow-Origin": "*",
        },
      });
      setFileMsg("Processing embeddings for");
      const res = await fetch(`/api/upload_embeddings?file=${file.name}`);
      setFileMsg("Loading in");
      const json = await res.json();
      console.log("json", json);
      setUploadingStatus(false);
      console.log("file", file.name, data.name);
      setFile(file.name);
      setFileMsg("Uploading");
    }
  }

	useEffect(() => {
		console.log(acceptedFiles);
		uploadFile(acceptedFiles[0]);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [acceptedFiles]);

	return (
		<section className="container">
			<div
				{...getRootProps({ className: "dropzone" })}
				className="relative block w-full pt-5 pb-7 px-12 text-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-gray-400 focus:outline-none"
			>
				<input {...getInputProps()} />

        <span className="text-xs font-medium bg-yellow-300 rounded-sm py-0.5 px-2">BETA</span>

				<div className="my-5 flex items-center justify-center text-center">
					{!uploading && (
						<ArrowUpTrayIcon
							className="mx-auto"
							width={30}
							height={30}
							color="#555"
						/>
					)}
					{uploading && <Loader />}
				</div>

				{uploading && (
					<>
						<div className="block mt-2 text-sm font-medium text-gray-900">
							{acceptedFiles[0].name}
						</div>
						<div className="block mt-2 text-sm text-gray-600">
							{fileMsg} {acceptedFiles[0].size} bytes...
						</div>
					</>
				)}

				{!uploading && (
					<div className="block mt-2 text-sm font-medium text-gray-900">
						<span>Drop your textbook here or click to upload</span>
						<br />
						<span className="text-sm font-normal text-gray-600 ">
							Only PDF files {"<"} 25MB. Please be patient! 
						</span>
					</div>
				)}
			</div>
		</section>
	);
}

export default FileDropzone;
