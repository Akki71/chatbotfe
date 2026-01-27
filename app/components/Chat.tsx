"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../chat.css";
import { JSX } from "react/jsx-runtime";

type ChatMessage = {
    role: "user" | "assistant";
    content: string;
};

export default function Chat(): JSX.Element {
    const [question, setQuestion] = useState<string>("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const params =
        typeof window !== "undefined"
            ? new URLSearchParams(window.location.search)
            : null;
    const [projectName, setProjectName] = useState("SEO AI Assistant");
    const [projectId, setProjectId] = useState("default");
    const [primaryColor, setPrimaryColor] = useState("#000000");


    useEffect(() => {
        const saved = localStorage.getItem("seo_chat_history");
        if (saved) {
            setMessages(JSON.parse(saved));
        }
    }, []);
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        setProjectName(params.get("projectName") || "SEO AI Assistant");
        setProjectId(params.get("projectId") || "default");
        setPrimaryColor(params.get("color") || "#000000");
    }, []);

    useEffect(() => {
        localStorage.setItem("seo_chat_history", JSON.stringify(messages));
    }, [messages]);

    const askAI = async (): Promise<void> => {
        if (!question.trim()) return;

        setMessages(prev => [...prev, { role: "user", content: question }]);
        setQuestion("");
        setLoading(true);

        try {
            const res = await fetch("https://chatapi.preproductiondemo.com/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question,projectId,projectName}),
            });

            const data: { answer: string } = await res.json();

            setMessages(prev => [
                ...prev,
                { role: "assistant", content: data.answer },
            ]);
        } catch {
            setMessages(prev => [
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

    return (
        <>

            <div className="chat-container">
                <div
                    className="chat-header"
                    style={{ background: primaryColor }}
                >

                    <h2 className="chat-title">{projectName}</h2>


                </div>

                <div className="chat-box">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            style={{ background: primaryColor }}
                            className={`chat-bubble ${msg.role === "user" ? "user" : "assistant"
                                }`}
                        >
                            {msg.role === "assistant" ? (
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        a: ({ node, ...props }) => (
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
                        <div className="chat-bubble assistant">Thinking...</div>
                    )}
                </div>

                <div className="chat-input">
                    <textarea
                        rows={2}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask about products, medicines, offers..."
                    />
                    <button style={{ background: primaryColor }} onClick={askAI} disabled={loading}>
                        Send
                    </button>
                </div>
            </div>

        </>
    );
}
