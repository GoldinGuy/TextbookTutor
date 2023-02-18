import React, { useEffect, useState } from 'react';
import { PDFViewer, PDFDownloadLink, Document, Page, Text } from '@react-pdf/renderer';

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
    const fetchPdfData = async () => {
      const response = await fetch(pdfUrl);
      const data = await response.text();
      setPdfData(data);
    };

    fetchPdfData();
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
          <PDFDownloadLink document={<Document><Page><Text>{pdfData}</Text></Page></Document>} fileName="document.pdf">
            {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
          </PDFDownloadLink>
        </>
      )}
    </>
  );
};

export default PDFComponent;
