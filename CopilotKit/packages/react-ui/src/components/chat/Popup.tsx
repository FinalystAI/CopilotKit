/**
 * <br/>
 * <img src="https://cdn.copilotkit.ai/docs/copilotkit/images/CopilotPopup.gif" width="500" />
 *
 * A chatbot popup component for the CopilotKit framework. The component allows for a high degree
 * of customization through various props and custom CSS.
 *
 * See [CopilotSidebar](/reference/components/chat/CopilotSidebar) for a sidebar version of this component.
 *
 * ## Install Dependencies
 *
 * This component is part of the [@finalyst/react-ui](https://npmjs.com/package/@finalyst/react-ui) package.
 *
 * ```shell npm2yarn \"@finalyst/react-ui"\
 * npm install @finalyst/react-core @finalyst/react-ui
 * ```
 * ## Usage
 *
 * ```tsx
 * import { CopilotPopup } from "@finalyst/react-ui";
 * import "@finalyst/react-ui/styles.css";
 *
 * <CopilotPopup
 *   labels={{
 *     title: "Your Assistant",
 *     initial: "Hi! 👋 How can I assist you today?",
 *   }}
 * />
 * ```
 *
 * ### With Observability Hooks
 *
 * To monitor user interactions, provide the `observabilityHooks` prop.
 * **Note:** This requires a `publicApiKey` in the `<CopilotKit>` provider.
 *
 * ```tsx
 * <CopilotKit publicApiKey="YOUR_PUBLIC_API_KEY">
 *   <CopilotPopup
 *     observabilityHooks={{
 *       onChatExpanded: () => {
 *         console.log("Popup opened");
 *       },
 *       onChatMinimized: () => {
 *         console.log("Popup closed");
 *       },
 *     }}
 *   />
 * </CopilotKit>
 * ```
 *
 * ### Look & Feel
 *
 * By default, CopilotKit components do not have any styles. You can import CopilotKit's stylesheet at the root of your project:
 * ```tsx title="YourRootComponent.tsx"
 * ...
 * import "@finalyst/react-ui/styles.css"; // [!code highlight]
 *
 * export function YourRootComponent() {
 *   return (
 *     <CopilotKit>
 *       ...
 *     </CopilotKit>
 *   );
 * }
 * ```
 * For more information about how to customize the styles, check out the [Customize Look & Feel](/guides/custom-look-and-feel/customize-built-in-ui-components) guide.
 */

import { CopilotModal, CopilotModalProps } from "./Modal";

export function CopilotPopup(props: CopilotModalProps) {
  props = {
    ...props,
    className: props.className ? props.className + " copilotKitPopup" : "copilotKitPopup",
  };
  return <CopilotModal {...props}>{props.children}</CopilotModal>;
}
