import React, { useState } from 'react';
import { AppStep, ClientData, ExtractedData } from './types';
import FileUpload from './components/FileUpload';
import Camera from './components/Camera';
import Results from './components/Results';
import { extractDataFromImage } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD_CSV);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClientsLoaded = (data: ClientData[]) => {
    setClients(data);
    if (data.length > 0) {
      setStep(AppStep.SELECT_CLIENT);
    } else {
      setError("O arquivo CSV não contém dados válidos ou a coluna ID_Cliente não foi encontrada.");
    }
  };

  const handleClientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClientId(e.target.value);
  };

  const confirmSelection = () => {
    if (selectedClientId) {
      setStep(AppStep.CAPTURE_IMAGE);
    }
  };

  const handleCapture = async (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setStep(AppStep.PROCESSING);
    setLoading(true);
    setError(null);

    try {
      const result = await extractDataFromImage(imageSrc, selectedClientId);
      setExtractedData(result);
      setStep(AppStep.RESULTS);
    } catch (err) {
      console.error(err);
      setError("Falha ao processar imagem. Tente novamente garantindo que a foto esteja focada e legível.");
      setStep(AppStep.CAPTURE_IMAGE); // Go back to capture
    } finally {
      setLoading(false);
    }
  };

  const resetProcess = () => {
    setCapturedImage(null);
    setExtractedData(null);
    setSelectedClientId('');
    setStep(AppStep.SELECT_CLIENT);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M11.25 4.533A9.707 9.707 0 006 3.75c-6 0-6 12-6 12s0 6 6 6a9.77 9.77 0 005.25-.817v-8.4zM12.75 12.533a9.77 9.77 0 005.25.817c6 0 6-12 6-12s0-12-6-12a9.707 9.707 0 00-5.25.783v8.4z" />
            </svg>
            BankID Vision
          </h1>
          {step !== AppStep.UPLOAD_CSV && (
            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
              {clients.length} Clientes
            </span>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 pb-20">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {step === AppStep.UPLOAD_CSV && (
          <div className="mt-10 animate-fade-in-up">
            <h2 className="text-lg font-semibold mb-4 text-center">Gestão de Carteira</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">
              Carregue o arquivo CSV com os IDs dos clientes para iniciar.
            </p>
            <FileUpload onDataLoaded={handleClientsLoaded} />
            <div className="mt-8 text-xs text-gray-400 text-center">
              Formato esperado: ID_Cliente, Segmento, Gerente...
            </div>
          </div>
        )}

        {step === AppStep.SELECT_CLIENT && (
          <div className="mt-6 animate-fade-in">
             <h2 className="text-lg font-semibold mb-4">Selecione o Cliente</h2>
             <div className="mb-6">
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Buscar ID na Carteira
               </label>
               <select 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-2 border"
                value={selectedClientId}
                onChange={handleClientSelect}
               >
                 <option value="">-- Selecione --</option>
                 {clients.map((c, i) => (
                   <option key={i} value={c.ID_Cliente}>
                     {c.ID_Cliente} {c.Segmento ? `- ${c.Segmento}` : ''}
                   </option>
                 ))}
               </select>
             </div>
             
             <button
              disabled={!selectedClientId}
              onClick={confirmSelection}
              className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-md transition-all ${
                selectedClientId 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-gray-300 cursor-not-allowed'
              }`}
             >
               Iniciar Atendimento
             </button>
             
             <div className="mt-4 text-center">
               <button onClick={() => setStep(AppStep.UPLOAD_CSV)} className="text-indigo-600 text-sm hover:underline">
                 Carregar outro arquivo
               </button>
             </div>
          </div>
        )}

        {step === AppStep.CAPTURE_IMAGE && (
          <div className="h-[70vh] flex flex-col">
            <h2 className="text-sm font-semibold mb-2 text-gray-600">
              Capturar Tela: {selectedClientId}
            </h2>
            <div className="flex-1 rounded-xl overflow-hidden shadow-lg border border-gray-200">
               <Camera 
                 onCapture={handleCapture} 
                 onCancel={() => setStep(AppStep.SELECT_CLIENT)} 
               />
            </div>
            <p className="mt-3 text-center text-xs text-gray-500">
              Posicione a tela de Indicadores, Produtos ou Volumes.
            </p>
          </div>
        )}

        {step === AppStep.PROCESSING && (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-800">Processando Imagem...</h3>
            <p className="text-gray-500 mt-2 max-w-xs">
              O Gemini está analisando indicadores, booleanos e valores financeiros.
            </p>
            {capturedImage && (
              <img 
                src={capturedImage} 
                alt="Preview" 
                className="mt-8 w-32 h-32 object-cover rounded-lg border-2 border-gray-200 opacity-50 grayscale" 
              />
            )}
          </div>
        )}

        {step === AppStep.RESULTS && extractedData && (
          <Results 
            data={extractedData} 
            onReset={resetProcess} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
