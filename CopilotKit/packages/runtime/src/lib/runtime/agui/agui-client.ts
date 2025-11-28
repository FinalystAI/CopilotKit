import { randomUUID } from "@copilotkit/shared";

type AgUiMessage = {
  id: string;
  content: string;
  role: string;
};

type AgUiSnapshotResponse = {
  MESSAGES_SNAPSHOT: AgUiMessage[];
};

export class AguiClient {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  private async fetchBlocking(body?: object): Promise<string> {
    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify(body || {}),
    });

    if (!response.body) {
      throw new Error("No response body.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = "";
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        result += decoder.decode(value, { stream: true });
      }
    }

    return result;
  }


  private mapResponseToMessages(response: string): AgUiMessage[] {
    try {
      const parsed: AgUiSnapshotResponse = JSON.parse(response);
      return parsed.MESSAGES_SNAPSHOT || [];
    } catch (err) {
      console.error("Failed to parse response:", err);
      return [];
    }
  }

  async fetchMessagesByThreadId(threadId: string): Promise<AgUiMessage[]> {
    const initialState = await this.fetchBlocking({
      threadId: threadId,
      runId: randomUUID(),
      messages: [],
      tools: [],
      context: [],
      forwardedProps: {},
    });

    return this.mapResponseToMessages(initialState);
  }

}
