import Viewer, { Worker } from "@phuocng/react-pdf-viewer";
import "@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css";

const PDFComponent = ({ pdfUrl }: { pdfUrl: string }) => {
	return (
		<Worker
      workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js"
    >
			<div style={{ height: "720px" }}>
				<Viewer fileUrl={pdfUrl} />
			</div>
		</Worker>
	);
};
export default PDFComponent;
