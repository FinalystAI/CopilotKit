"use client";
import { CopilotKit, useCopilotAction, useCopilotReadable } from "@finalyst/react-core";
import { CopilotTextarea } from "@finalyst/react-textarea";
import { CopilotSidebar } from "@finalyst/react-ui";
import "@finalyst/react-ui/styles.css";
import { useState } from "react";
import "@finalyst/react-textarea/styles.css";
import "@finalyst/react-ui/styles.css";
function InsideHome() {
  const [message, setMessage] = useState("Hello World!");
  const [text, setText] = useState("");
  useCopilotReadable({
    description: "This is the current message",
    value: message,
  });
  useCopilotAction(
    {
      name: "displayMessage",
      description: "Display a message.",
      parameters: [
        {
          name: "message",
          type: "string",
          description: "The message to display.",
          required: true,
        },
      ],
      handler: async ({ message }) => {
        setMessage(message);
      },
    },
    [],
  );
  return <div className="h-screen w-full flex items-center justify-center text-2xl">{message}</div>;
}
export default function Home() {
  return (
    <CopilotKit url="http://127.0.0.1:5001/copilotkit-test-12345/us-central1/copilotKit">
      <CopilotSidebar
        defaultOpen={true}
        labels={{
          title: "Presentation Copilot",
          initial: "Hi you! 👋 I can give you a presentation on any topic.",
        }}
        clickOutsideToClose={false}
      >
        <InsideHome />
      </CopilotSidebar>
    </CopilotKit>
  );
}
