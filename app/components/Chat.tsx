"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../chat.css";
import { JSX } from "react/jsx-runtime";
import { askChatAPI } from "../services/api";

type ChatMessage = {
    role: "user" | "assistant";
    content: string;
};

export default function Chat(): JSX.Element {
    const [question, setQuestion] = useState<string>("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [projectName, setProjectName] = useState("SEO AI Assistant");
    const [projectId, setProjectId] = useState("default");
    const [primaryColor, setPrimaryColor] = useState("#6366f1");

    const chatEndRef = useRef<HTMLDivElement | null>(null);

    /* ---------------------------------------------------
       🔁 LOAD CHAT HISTORY
    --------------------------------------------------- */
    useEffect(() => {
        const saved = localStorage.getItem("seo_chat_history");
        if (saved) {
            setMessages(JSON.parse(saved));
        }
    }, []);

    /* ---------------------------------------------------
       🔗 READ URL PARAMS
    --------------------------------------------------- */
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        setProjectName(params.get("projectName") || "SEO AI Assistant");
        setProjectId(params.get("projectId") || "default");
        setPrimaryColor(params.get("color") || "#6366f1");
    }, []);

    /* ---------------------------------------------------
       🎨 APPLY THEME COLORS (CSS VARIABLES)
    --------------------------------------------------- */
    useEffect(() => {
        document.documentElement.style.setProperty(
            "--primary-color",
            primaryColor
        );
        document.documentElement.style.setProperty(
            "--user-bg",
            primaryColor
        );
        document.documentElement.style.setProperty(
            "--assistant-bg",
            "#f1f5f9"
        );
    }, [primaryColor]);

    /* ---------------------------------------------------
       💾 SAVE CHAT HISTORY
    --------------------------------------------------- */
    useEffect(() => {
        localStorage.setItem("seo_chat_history", JSON.stringify(messages));
    }, [messages]);

    /* ---------------------------------------------------
       📜 AUTO SCROLL TO BOTTOM
    --------------------------------------------------- */
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    /* ---------------------------------------------------
       🤖 SEND MESSAGE
    --------------------------------------------------- */
    const askAI = async (): Promise<void> => {
        if (!question.trim()) return;

        const userQuestion = question;

        setMessages((prev) => [
            ...prev,
            { role: "user", content: userQuestion },
        ]);
        setQuestion("");
        setLoading(true);

        try {
            const data = await askChatAPI({
                question: userQuestion,
                // projectId: "8",
                projectId,
                projectName,
            });

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: data.answer },
            ]);
        } catch (error) {
            console.error("Chat API Error:", error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "❌ Something went wrong. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    /* ---------------------------------------------------
       🖥️ UI
    --------------------------------------------------- */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!loading) {
                askAI();
            }
        }
    };

    return (
        <div className="chat-container">
            {/* Header */}
            <div className="chat-header">
                <h2 className="chat-title">{projectName}</h2>
            </div>

            {/* Messages */}
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat-bubble ${msg.role}`}
                    >
                        {msg.role === "assistant" ? (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    a: ({ ...props }) => (
                                        <a
                                            {...props}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="chat-link"
                                        />
                                    ),
                                }}
                            >
                                {msg.content}
                            </ReactMarkdown>
                        ) : (
                            msg.content
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="chat-bubble assistant loading">
                        Thinking...
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input">
                <textarea
                    rows={2}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="How can I help you today?"
                />

                <button onClick={askAI} disabled={loading}>
                    Send
                </button>
            </div>
        </div>
    );
}
