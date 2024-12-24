import React, { useEffect, useState, useRef } from "react";
import { RetellWebClient } from "retell-client-js-sdk";
import "./Help.css";

const agentId = "agent_3f83642486bb9073b1d2e36ca2";
const retellWebClient = new RetellWebClient();

const Help = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showInitialBot, setShowInitialBot] = useState(true);
  const [initialMessage, setInitialMessage] = useState(""); // For typing effect
  const [isGenerating, setIsGenerating] = useState(false); // For tracking message generation
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Typing effect for "Hello, I am Myra"
  useEffect(() => {
    if (showInitialBot) {
      let typingIndex = 0;
      const fullMessage = "Hello, I am Myra, your personal assistant. Please click on me to initiate a call.";
      setInitialMessage(""); // Clear previous message

      const typingInterval = setInterval(() => {
        setInitialMessage((prev) => prev + fullMessage[typingIndex]);
        typingIndex++;
        if (typingIndex >= fullMessage.length) {
          clearInterval(typingInterval);
        }
      }, 50); // Typing speed in milliseconds

      return () => clearInterval(typingInterval);
    }
  }, [showInitialBot]);

  useEffect(() => {
    retellWebClient.on("call_started", () => {
      console.log("call started");
    });

    retellWebClient.on("call_ended", () => {
      console.log("call ended");
      setIsCalling(false);
      setShowInitialBot(true); // Show hover bot after call ends
    });

    retellWebClient.on("update", (update) => {
      if (update.transcript && Array.isArray(update.transcript)) {
        const updatedMessages = update.transcript.map((line) => ({
          role: line.role,
          content: line.content,
        }));
        setMessages(updatedMessages);
        setIsGenerating(false); // Stop showing generating state
      }
    });

    retellWebClient.on("error", (error) => {
      console.error("An error occurred:", error);
      retellWebClient.stopCall();
    });
  }, []);

  const toggleConversation = async () => {
    if (isCalling) {
      retellWebClient.stopCall();
    } else {
      try {
        const registerCallResponse = await registerCall(agentId);
        if (registerCallResponse.access_token) {
          await retellWebClient.startCall({
            accessToken: registerCallResponse.access_token,
          });
          setIsCalling(true);
          setShowInitialBot(false); // Hide initial bot during call
          setIsGenerating(true); // Start showing generating state
        }
      } catch (error) {
        console.error("Error starting the call:", error);
      }
    }
  };

  async function registerCall(agentId) {
    try {
      const response = await fetch("http://localhost:5000/create-web-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agent_id: agentId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (err) {
      console.error("Error during registration:", err);
      throw new Error(err);
    }
  }

  return (
    <div className="help-container">
      {/* Chat Messages */}
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.role}`}>
            {message.role === "assistant" && <div className="bot-avatar" />}
            <div className="message-content">{message.content}</div>
          </div>
        ))}

        {/* Display AI generating message state */}
        {isGenerating && (
          <div className="chat-message assistant">
            <div className="bot-avatar" />
            <div className="message-content">
              <span className="typing-indicator">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bot Hover Prompt */}
      {showInitialBot && (
        <div className="initial-bot">
          <div className="bot-avatar" onClick={toggleConversation} />
          <div className="bot-message-box">
            {initialMessage || "Click here to initiate a call."}
          </div>
        </div>
      )}

      {/* End Call Button */}
      {isCalling && (
        <button className="end-call-btn" onClick={toggleConversation}>
          <i className="fas fa-phone-slash"></i> Hang Up
        </button>
      )}
    </div>
  );
};

export default Help;
