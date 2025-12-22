import { randomUUID, type Message } from "@finalyst/shared";
import { AGUIEndpoint } from "../remote-actions";

type SSEPayload = {
  type: string;
  [key: string]: any;
};

export class AguiClient {
  private endpoint: AGUIEndpoint;

  constructor(endpoint: AGUIEndpoint) {
    this.endpoint = endpoint;
  }

  /**
   * Parse ALL SSE events and return them as a list of parsed JSON payloads.
   */
  private async fetchSSE(body?: object): Promise<SSEPayload[]> {
    const response = await fetch(this.endpoint.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        ...(this.endpoint.getRequestHeaders?.() ?? {})
      },
      body: JSON.stringify(body || {}),
    });

    if (!response.body) {
      throw new Error("No response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    const allEvents: SSEPayload[] = [];

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Split into complete SSE events
      const rawEvents = buffer.split("\n\n");

      // Keep last partial event
      buffer = rawEvents.pop() ?? "";

      for (const raw of rawEvents) {
        const line = raw.trim();
        if (!line.startsWith("data:")) continue;

        const jsonStr = line.slice(5).trim();

        try {
          const parsed: SSEPayload = JSON.parse(jsonStr);
          allEvents.push(parsed);
        } catch (error) {
          console.error("Failed to parse SSE payload:", error, jsonStr);
        }
      }
    }

    return allEvents;
  }

  /**
   * Extract the MESSAGES_SNAPSHOT event and return its messages.
   */
  async fetchMessagesByThreadId(threadId: string): Promise<Message[]> {
    const events = await this.fetchSSE({
      threadId,
      runId: randomUUID(),
      messages: [],
      state: {},
      tools: [],
      context: [],
      forwardedProps: {},
    });

    const snapshot = events.find((e) => e.type === "MESSAGES_SNAPSHOT");

    if (snapshot && Array.isArray(snapshot.messages)) {
      return snapshot.messages as Message[];
    }

    return [];
  }
}
