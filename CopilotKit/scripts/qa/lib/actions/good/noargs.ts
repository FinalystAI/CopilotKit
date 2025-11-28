import { useCopilotAction } from "@finalyst/react-core";

useCopilotAction({
  name: "noargs",
  handler: async () => {
    console.log("No args action");
  },
});
