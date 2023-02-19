import React, { useEffect, useState } from 'react';
import { PDFViewer, PDFDownloadLink, Document, Page, Text } from '@react-pdf/renderer';
import axios from "axios"

interface PDFProps {
  pdfUrl: string;
}

const PDFComponent: React.FC<PDFProps> = ({ pdfUrl }) => {
  const [pdfData, setPdfData] = useState('');
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsBrowser(true);
    }
  }, []);

  useEffect(() => {
    const fetchPdfData = async function fetchPdfData(url: string): Promise<ArrayBuffer> {
      const response = await axios.get(url, {
        responseType: "arraybuffer",
      });
      return response.data;
    }

    fetchPdfData(pdfUrl);
  }, [pdfUrl]);

  return (
    <>
      {isBrowser && (
        <>
          <PDFViewer>
            <Document>
              <Page>
                <Text>{pdfData}</Text>
              </Page>
            </Document>
          </PDFViewer>
        </>
      )}
    </>
  );
};

export default PDFComponent;
