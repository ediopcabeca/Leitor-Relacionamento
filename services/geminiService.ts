import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ExtractedData } from "../types";

const SYSTEM_INSTRUCTION = `
Você é um extrator de dados bancários especializado em JSON. Sua tarefa é analisar fotos de telas de CRM.

Receba o ID_Cliente fornecido pelo usuário.

Analise a imagem e identifique os símbolos: 
- ✅ ou checkmarks visuais significam true.
- ❌ ou x marks significam false.
- Se houver texto como "Sim"/"Não", converta para booleano.

Extraia todos os valores financeiros removendo 'R$', espaços e convertendo para formato decimal numérico (ponto para centavos). Exemplo: "R$ 20.009,50" vira 20009.50.

Classifique os dados nas categorias: 'produtos_caixa', 'indicadores' e 'volumes'.
- Indicadores incluem: Perfil Investidor, Rating, ICX, Nicho, Afinidade, Margem.
- Volumes incluem: Habitação, Crédito, Saldos.

Se um valor não estiver visível ou legível, retorne null.
O output deve ser estritamente o JSON definido no schema.
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    atendimento: {
      type: Type.OBJECT,
      properties: {
        id_cliente: { type: Type.STRING },
        timestamp: { type: Type.STRING },
      },
      required: ["id_cliente", "timestamp"],
    },
    dados_extraidos: {
      type: Type.OBJECT,
      properties: {
        indicadores: {
          type: Type.OBJECT,
          properties: {
            perfil_investidor: { type: Type.STRING, nullable: true },
            rating: { type: Type.STRING, nullable: true },
            margem_anual: { type: Type.NUMBER, nullable: true },
            icx: { type: Type.NUMBER, nullable: true },
            nicho: { type: Type.STRING, nullable: true },
            afinidade: { type: Type.STRING, nullable: true },
          },
        },
        produtos_caixa: {
          type: Type.OBJECT,
          properties: {
            cartao_credito: { type: Type.BOOLEAN, nullable: true },
            poupanca: { type: Type.BOOLEAN, nullable: true },
            cesta: { type: Type.BOOLEAN, nullable: true },
            adesao_ibc: { type: Type.BOOLEAN, nullable: true },
          },
        },
        volumes: {
          type: Type.OBJECT,
          properties: {
            habitacao: { type: Type.NUMBER, nullable: true },
            credito: { type: Type.NUMBER, nullable: true },
            investimentos: { type: Type.NUMBER, nullable: true },
          },
        },
      },
      required: ["indicadores", "produtos_caixa", "volumes"],
    },
  },
  required: ["atendimento", "dados_extraidos"],
};

export const extractDataFromImage = async (
  base64Image: string,
  clientId: string
): Promise<ExtractedData> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Clean base64 string if it contains the header
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-latest",
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: "image/jpeg",
            },
          },
          {
            text: `Analise esta imagem para o cliente ID: ${clientId}. Extraia os dados conforme instrução.`,
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2, // Low temperature for factual extraction
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini.");
    }

    return JSON.parse(text) as ExtractedData;
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw error;
  }
};
