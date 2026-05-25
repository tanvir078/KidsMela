import { useState } from 'react';

export default function LiveChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hi! How can I help you today?', sender: 'agent', time: 'Just now' },
    ]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            text: message,
            sender: 'user',
            time: 'Just now',
        };

        setMessages([...messages, newMessage]);
        setMessage('');

        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    text: 'Thanks for your message! Our support team will get back to you shortly.',
                    sender: 'agent',
                    time: 'Just now',
                },
            ]);
        }, 1000);
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="fixed bottom-20 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl shadow-lg shadow-blue-300 transition-all duration-200 hover:scale-110 active:scale-95"
            >
                💬
            </button>

            {isOpen && (
                <div className="fixed bottom-36 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-3xl bg-white shadow-2xl shadow-slate-300 ring-1 ring-slate-200">
                    <div className="flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 text-white">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-400" />
                            <span className="text-sm font-black">Live Support</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="grid h-8 w-8 place-items-center rounded-full bg-white/20 text-white transition-all duration-200 hover:bg-white/30 active:scale-95"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="h-80 overflow-y-auto p-4 space-y-3">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                                        msg.sender === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-100 text-slate-700'
                                    }`}
                                >
                                    <p className="font-medium">{msg.text}</p>
                                    <p className={`mt-1 text-[10px] ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                                        {msg.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="border-t border-slate-200 p-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 rounded-full border-slate-200 px-4 py-2 text-sm font-semibold focus:border-blue-500 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-white transition-all duration-200 hover:bg-blue-700 active:scale-95"
                            >
                                →
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
