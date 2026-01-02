import React from 'react';
import { ExtractedData } from '../types';

interface ResultsProps {
  data: ExtractedData;
  onReset: () => void;
}

const Results: React.FC<ResultsProps> = ({ data, onReset }) => {
  const { indicadores, produtos_caixa, volumes } = data.dados_extraidos;

  const formatCurrency = (val: number | null | undefined) => {
    if (val === null || val === undefined) return '-';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const BoolIcon = ({ val }: { val: boolean | null | undefined }) => {
    if (val === true) return <span className="text-green-500">✅ Sim</span>;
    if (val === false) return <span className="text-red-500">❌ Não</span>;
    return <span className="text-gray-400">?</span>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-600">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Atendimento</h3>
        <p className="text-lg font-semibold text-gray-900">ID: {data.atendimento.id_cliente}</p>
        <p className="text-xs text-gray-400">{new Date(data.atendimento.timestamp).toLocaleString('pt-BR')}</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <h3 className="font-semibold text-gray-700">📊 Indicadores</h3>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Perfil</p>
            <p className="font-medium">{indicadores.perfil_investidor || '-'}</p>
          </div>
          <div>
            <p className="text-gray-500">Rating</p>
            <p className="font-medium">{indicadores.rating || '-'}</p>
          </div>
          <div>
            <p className="text-gray-500">ICX</p>
            <p className="font-medium">{indicadores.icx || '-'}</p>
          </div>
           <div>
            <p className="text-gray-500">Margem Anual</p>
            <p className="font-medium text-blue-600">{formatCurrency(indicadores.margem_anual)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <h3 className="font-semibold text-gray-700">📦 Produtos</h3>
        </div>
        <div className="p-4 space-y-2 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span>Cartão de Crédito</span>
            <BoolIcon val={produtos_caixa.cartao_credito} />
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>Poupança</span>
            <BoolIcon val={produtos_caixa.poupanca} />
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>Cesta de Serviços</span>
            <BoolIcon val={produtos_caixa.cesta} />
          </div>
          {produtos_caixa.adesao_ibc !== undefined && (
             <div className="flex justify-between">
              <span>Adesão IBC</span>
              <BoolIcon val={produtos_caixa.adesao_ibc} />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <h3 className="font-semibold text-gray-700">💰 Volumes</h3>
        </div>
        <div className="p-4 space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Habitação</span>
            <span className="font-mono font-medium">{formatCurrency(volumes.habitacao)}</span>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-gray-600">Crédito Comercial</span>
             <span className="font-mono font-medium">{formatCurrency(volumes.credito)}</span>
          </div>
           {volumes.investimentos !== null && (
            <div className="flex justify-between items-center">
                <span className="text-gray-600">Investimentos</span>
                <span className="font-mono font-medium">{formatCurrency(volumes.investimentos)}</span>
            </div>
           )}
        </div>
      </div>

      <div className="pt-4">
        <button 
          onClick={onReset}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md"
        >
          Novo Atendimento
        </button>
      </div>

      {/* Raw JSON Debug View */}
      <details className="text-xs text-gray-400 mt-8">
        <summary className="cursor-pointer mb-2">Ver JSON Bruto</summary>
        <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default Results;
