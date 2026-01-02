import React, { ChangeEvent } from 'react';
import { ClientData } from '../types';
import { parseCSV } from '../utils/csvParser';

interface FileUploadProps {
  onDataLoaded: (data: ClientData[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsedData = parseCSV(text);
      onDataLoaded(parsedData);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-indigo-300 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer relative">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="text-indigo-600 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <p className="font-semibold text-indigo-700">Carregar CSV de Clientes</p>
      <p className="text-xs text-indigo-500 mt-1">Clique ou arraste o arquivo aqui</p>
    </div>
  );
};

export default FileUpload;
