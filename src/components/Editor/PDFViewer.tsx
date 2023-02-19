import Viewer, { Worker } from "@phuocng/react-pdf-viewer";
import "@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css";

const PDFComponent = ({ pdfUrl }: { pdfUrl: string }) => {
	return (
		<Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
			<div style={{ height: "720px" }} className="">
				<Viewer fileUrl={pdfUrl} />
			</div>
		</Worker>
	);
};
export default PDFComponent;
// import { useState } from "react";
// import { Document, Outline, Page, pdfjs } from "react-pdf";
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// const PDFComponent = ({ pdfUrl }: { pdfUrl: string }) => {
//   const [numPages, setNumPages] = useState<number>();
//    const [pageNumber, setPageNumber] = useState(1);

// 	function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
// 		setNumPages(numPages);
//   }

//   function onItemClick({ pageNumber: itemPageNumber }) {
//       setPageNumber(itemPageNumber);
//   }

//   console.log(pdfUrl);

// 	return (
// 		<Document
// 			file={pdfUrl}
// 			onLoadSuccess={onDocumentLoadSuccess}
// 			onItemClick={onItemClick}
// 		>
// 			<Outline onItemClick={onItemClick} />
// 			{Array.from(new Array(numPages), (el, index) => (
// 				<Page key={`page_${index + 1}`} pageNumber={index + 1} />
// 			))}
// 		</Document>
// 	);
// };
// export default PDFComponent;
