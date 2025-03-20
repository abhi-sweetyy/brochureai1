"use client";

import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

interface PDFPreviewProps {
  pdfBytes: Uint8Array | null;
  onClose: () => void;
  onDownload: () => void;
}

export default function PDFPreview({ pdfBytes, onClose, onDownload }: PDFPreviewProps) {
  if (!pdfBytes) return null;
  
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    // Convert PDF bytes to URL
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [pdfBytes]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-[#0A0A0A] rounded-2xl border border-[#1D2839] w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-[#1D2839] flex justify-between items-center">
          <h3 className="text-white font-medium">PDF Preview</h3>
          <button
            onClick={onClose}
            className="text-[#8491A5] hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4 overflow-auto flex flex-col items-center">
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            className="max-w-full"
          >
            <Page 
              pageNumber={pageNumber} 
              className="max-w-full"
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
          
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => setPageNumber(page => Math.max(1, page - 1))}
              disabled={pageNumber <= 1}
              className="px-3 py-1 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-[#8491A5]">
              Page {pageNumber} of {numPages}
            </span>
            <button
              onClick={() => setPageNumber(page => Math.min(numPages, page + 1))}
              disabled={pageNumber >= numPages}
              className="px-3 py-1 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-[#1D2839] flex justify-end">
          <button
            onClick={onDownload}
            className="px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
} 