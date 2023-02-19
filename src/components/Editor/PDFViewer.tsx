import Viewer, { Worker } from "@phuocng/react-pdf-viewer";
// import { Worker } from "@phuocng/react-pdf-viewer";
// import { Viewer } from '@react-pdf-viewer/core';
// import { searchPlugin } from '@react-pdf-viewer/search';
import "@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css";
// import SearchSidebar from "./SearchSidebar"

const PDFViewer = ({ pdfUrl }: { pdfUrl: string }) => {
  // const searchPluginInstance = searchPlugin();

  return (
		<Worker
      workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js"
    >
			<div style={{ height: "720px" }}>
				<Viewer fileUrl={pdfUrl} />
			</div>
      {/* <div
        style={{
            borderRight: '1px solid rgba(0, 0, 0, .2)',
            flex: '0 0 15rem',
            width: '15rem',
        }}
      >
        <SearchSidebar searchPluginInstance={searchPluginInstance} />
      </div>

      <div style={{ flex: 1 }}>
        <Viewer fileUrl={pdfUrl} plugins={[searchPluginInstance]} />
      </div> */}
		</Worker>
	);
};
export default PDFViewer;
