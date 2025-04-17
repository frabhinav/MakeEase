import { useState } from "react";
import useChatStore from "../store/chatStore";
// import useAuthStore from "../store/authStore";
import "./ChatBot.css";

const ChatInput = ({ currentChatId }) => {
  const [input, setInput] = useState("");
  const { addMessage } = useChatStore();
  // const currentUser = useAuthStore((state) => state.user?.uid);

  // const handleSend = () => {
  //   if (input.trim() && currentUser) {
  //     addMessage(currentUser, input); // Add to chat store

  //     setTimeout(() => {
  //       addMessage(currentUser, "Bot reply to: " + input);
  //     }, 500);

  //     setInput(""); // Clear input
  //   }

  const handleSend = async () => {
    if (!input.trim() || !currentChatId) return;
    await addMessage(currentChatId, input.trim());

    setTimeout(() => {
      addMessage(currentChatId, "Bot reply to: " + input.trim());
    }, 500);
    setInput("");
  };

  return (
    <div className="chat-input-container">
      <input
        className="chat-input"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="Type your message..."
      />
      <button onClick={handleSend} className="send-button">
        Send
      </button>
    </div>
  );
};

export default ChatInput;
