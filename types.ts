export interface ClientData {
  ID_Cliente: string;
  Segmento?: string;
  Gerente?: string;
  [key: string]: string | undefined;
}

export interface ExtractedData {
  atendimento: {
    id_cliente: string;
    timestamp: string;
  };
  dados_extraidos: {
    indicadores: {
      perfil_investidor: string | null;
      rating: string | null;
      margem_anual: number | null;
      icx: number | null;
      nicho?: string | null;
      afinidade?: string | null;
    };
    produtos_caixa: {
      cartao_credito: boolean | null;
      poupanca: boolean | null;
      cesta: boolean | null;
      adesao_ibc?: boolean | null;
      [key: string]: boolean | null | undefined;
    };
    volumes: {
      habitacao: number | null;
      credito: number | null;
      [key: string]: number | null | undefined;
    };
  };
}

export enum AppStep {
  UPLOAD_CSV = 'UPLOAD_CSV',
  SELECT_CLIENT = 'SELECT_CLIENT',
  CAPTURE_IMAGE = 'CAPTURE_IMAGE',
  PROCESSING = 'PROCESSING',
  RESULTS = 'RESULTS',
}
