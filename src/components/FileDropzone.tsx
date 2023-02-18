import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import axios from "axios";

function FileDropzone() {
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
	const [uploading, setUploadingStatus] = useState(false);

  const uploadFile = async (file: File) => {
    console.log("file to upload", JSON.stringify(file))
		// For UX Info
    if (!file) {
      return;
    }
		setUploadingStatus(true);
		// Making a POST request to created earlier API route
		let { data } = await axios.post("/api/upload_file", {
			name: file.name,
			type: file.type,
		});
		// Fetching out an URL
    const url = data.url;
    console.log('url: ', url);
		// Uploading a file
    let { data: newData } = await axios.put(url, file, {
        headers: {
          "Content-type": file.type,
          "Access-Control-Allow-Origin": "*",
        },
    });
		setUploadingStatus(false);
	};

	useEffect(() => {
		console.log(acceptedFiles);
		uploadFile(acceptedFiles[0]);
	}, [acceptedFiles]);

	return (
		<section className="container">
			<div
				{...getRootProps({ className: "dropzone" })}
				className="relative block w-full p-12 text-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-gray-400 focus:outline-none"
			>
				<input {...getInputProps()} />

				<div className="text-center">
					<ArrowUpTrayIcon
						className="mx-auto"
						width={30}
						height={30}
						color="#555"
					/>
				</div>

				{acceptedFiles.length > 0 && (
					<>
						<div className="block mt-2 text-sm font-medium text-gray-900">
							{acceptedFiles[0].name}
						</div>
						<div className="block mt-2 text-sm text-gray-600">
							Uploading {acceptedFiles[0].size} bytes
						</div>
					</>
				)}

				{acceptedFiles.length === 0 && (
					<div className="block mt-2 text-sm font-medium text-gray-900">
						Drop your files here or click to upload
					</div>
				)}
			</div>
		</section>
	);
}

export default FileDropzone;
