import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

function FileDropzone() {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();

  useEffect(() => {
    console.log(acceptedFiles);
  }, [acceptedFiles]);

  return (
    <section className="container">
      <div
        {...getRootProps({className: 'dropzone'})}
        className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center cursor-pointer hover:border-gray-400 focus:outline-none"
      >
        <input {...getInputProps()} />

        <div className="text-center">
          <ArrowUpTrayIcon className="mx-auto" width={30} height={30} color="#555" />
        </div>

        {acceptedFiles.length > 0 && (
          <>
            <div className="mt-2 block text-sm font-medium text-gray-900">
              {acceptedFiles[0].name}
            </div>
            <div className="mt-2 block text-sm text-gray-600">
              Uploading {acceptedFiles[0].size} bytes
            </div>
          </>
        )}

        {acceptedFiles.length === 0 && (
          <div className="mt-2 block text-sm font-medium text-gray-900">
            Drop your files here or click to upload
          </div>
        )}
      </div>
    </section>
  );
}

export default FileDropzone;
