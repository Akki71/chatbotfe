// services/api.ts

export type ChatRequest = {
  question: string;
  projectId: string;
  projectName: string;
};

export type ChatResponse = {
  answer: string;
};

const CHAT_API_URL = "https://chatapi.preproductiondemo.com/api/chat";
// const CHAT_API_URL = "http://localhost:3001/api/chat";



/**
 * Call Chat API
 */
export async function askChatAPI(
  payload: ChatRequest
): Promise<ChatResponse> {
  const response = await fetch(CHAT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
