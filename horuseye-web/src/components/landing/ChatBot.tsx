// components/landing/ChatBot.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Bot, Send, Loader2 } from "lucide-react";

const chatbotResponses = {
  greeting: "Hello! I'm the HorusEye assistant. How can I help you today?",
  default:
    "I'm not sure how to answer that. Would you like to learn more about our penetration testing services?",
  pricing:
    "We offer flexible pricing plans based on the number of scans and features needed. Would you like me to send you our pricing sheet?",
  features:
    "HorusEye includes automated vulnerability scanning, AI-powered analysis, comprehensive reporting, and enterprise-grade security. Is there a specific feature you're interested in?",
  trial:
    "You can start a free trial with 5 complimentary scans. No credit card required! Would you like me to help you set up an account?",
  integration:
    "We integrate with popular tools like Nmap, Metasploit, OpenVAS, and more. Our API also allows custom integrations.",
  support:
    "We provide 24/7 support for enterprise customers and business-hour support for all other plans. You can also check our documentation for self-help resources.",
};

const getBotResponse = (message: string) => {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hey")
  ) {
    return chatbotResponses.greeting;
  } else if (
    lowerMessage.includes("price") ||
    lowerMessage.includes("cost") ||
    lowerMessage.includes("plan")
  ) {
    return chatbotResponses.pricing;
  } else if (
    lowerMessage.includes("feature") ||
    lowerMessage.includes("what can") ||
    lowerMessage.includes("do")
  ) {
    return chatbotResponses.features;
  } else if (
    lowerMessage.includes("trial") ||
    lowerMessage.includes("free") ||
    lowerMessage.includes("demo")
  ) {
    return chatbotResponses.trial;
  } else if (
    lowerMessage.includes("integrat") ||
    lowerMessage.includes("api") ||
    lowerMessage.includes("tool")
  ) {
    return chatbotResponses.integration;
  } else if (
    lowerMessage.includes("support") ||
    lowerMessage.includes("help") ||
    lowerMessage.includes("contact")
  ) {
    return chatbotResponses.support;
  } else {
    return chatbotResponses.default;
  }
};

interface Message {
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: chatbotResponses.greeting, sender: "bot", timestamp: new Date() },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    // Add user message
    const userMessage = {
      text: inputMessage,
      sender: "user" as const,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate bot thinking and response
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      setMessages((prev) => [
        ...prev,
        {
          text: botResponse,
          sender: "bot" as const,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="border-border bg-background fixed right-6 bottom-24 z-50 flex h-96 w-80 flex-col overflow-hidden rounded-2xl border shadow-xl"
          >
            <div className="bg-primary text-primary-foreground flex items-center justify-between p-4">
              <div className="flex items-center space-x-2">
                <Bot className="h-6 w-6" />
                <h3 className="font-semibold">HorusEye Assistant</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground h-6 w-6 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-4 py-2 ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    {message.text}
                    <div
                      className={`mt-1 text-xs ${message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="mb-4 flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-border border-t p-3">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e: any) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={inputMessage.trim() === ""}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed right-6 bottom-6 z-50"
      >
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </Button>
      </motion.div>
    </>
  );
}
