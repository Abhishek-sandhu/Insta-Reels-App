import { useEffect, useRef, useState } from 'react';
import EmojiPicker from '../components/EmojiPicker.jsx';
import casualFaq from '../assets/casual-faq.json';

// Mock user data for demonstration
const CURRENT_USER = {
  id: 'u1',
  username: 'reels_creator',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
};
const OTHER_USER = {
  id: 'u2',
  username: 'friend',
  avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
};

export default function Messages() {
  const [messages, setMessages] = useState([
    { id: 1, sender: OTHER_USER, text: 'Hey! 👋', time: '10:00 AM' },
    { id: 2, sender: CURRENT_USER, text: 'Hi! How are you?', time: '10:01 AM' },
    { id: 3, sender: OTHER_USER, text: 'I am good! Working on some reels.', time: '10:02 AM' },
  ]);
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = {
      id: messages.length + 1,
      sender: CURRENT_USER,
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setShowEmoji(false);
    setTyping(false);

    // Bot reply logic
    const lower = input.trim().toLowerCase();
    const match = casualFaq.find(faq => lower === faq.question || lower.includes(faq.question));
    if (match) {
      setTimeout(() => {
        setMessages(msgs => [
          ...msgs,
          {
            id: msgs.length + 2,
            sender: OTHER_USER,
            text: match.answer,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 800);
    } else {
      // Optionally, generic fallback
      setTimeout(() => {
        setMessages(msgs => [
          ...msgs,
          {
            id: msgs.length + 2,
            sender: OTHER_USER,
            text: "I'm just a bot, but I love to chat!",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 1200);
    }
  }

  function handleInput(e) {
    setInput(e.target.value);
    setTyping(!!e.target.value);
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-fuchsia-50 to-amber-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-amber-400/10 dark:from-indigo-900/30 dark:via-slate-900/30 dark:to-amber-200/10">
        <img src={OTHER_USER.avatar} alt="avatar" className="h-10 w-10 rounded-full object-cover border-2 border-indigo-400 dark:border-fuchsia-500" />
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">{OTHER_USER.username} <span className="text-xs bg-indigo-100 dark:bg-fuchsia-900 text-indigo-500 dark:text-fuchsia-200 px-2 py-0.5 rounded-full">Creator</span></div>
          <div className="text-xs text-slate-400 flex items-center gap-1">Online <span className="animate-pulse h-2 w-2 bg-green-400 rounded-full"></span></div>
        </div>
        <div className="ml-auto flex gap-2">
          <button className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800" title="Call"><span role="img" aria-label="call">📞</span></button>
          <button className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800" title="Video Call"><span role="img" aria-label="video">🎥</span></button>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-gradient-to-br from-white via-indigo-50 to-amber-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender.id === CURRENT_USER.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl shadow text-sm ${
                msg.sender.id === CURRENT_USER.id
                  ? 'bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-amber-400 text-white rounded-br-none'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none'
              }`}
            >
              {msg.text}
              <div className="text-[10px] text-right mt-1 opacity-60">{msg.time}</div>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="max-w-xs px-4 py-2 rounded-2xl shadow text-sm bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none animate-pulse">
              typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <form onSubmit={sendMessage} className="flex items-center gap-2 px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 relative">
        <button
          type="button"
          className="rounded-full p-2 text-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => setShowEmoji(e => !e)}
          tabIndex={-1}
          aria-label="Emoji"
        >😊</button>
        {showEmoji && (
          <div className="absolute bottom-14 left-2 z-20">
            <EmojiPicker onSelect={emoji => { setInput(input + emoji); setShowEmoji(false); setTyping(true); }} />
          </div>
        )}
        <input
          className="flex-1 rounded-full border border-slate-300 dark:border-slate-700 px-4 py-2 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Type a message..."
          value={input}
          onChange={handleInput}
        />
        <button
          type="submit"
          className="rounded-full bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-amber-400 text-white px-5 py-2 font-semibold shadow hover:from-indigo-600 hover:to-pink-500 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
