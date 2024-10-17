import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set the workerSrc for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;

const UpdatePdfReactPdf = () => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);

  const onFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(URL.createObjectURL(selectedFile));
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={onFileChange} />
      {file && (
        <div>
          <Document
            file={file}
            renderMode={'canvas'}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={1} />
          </Document>
        </div>
      )}
    </div>
  );
};

export default UpdatePdfReactPdf;
