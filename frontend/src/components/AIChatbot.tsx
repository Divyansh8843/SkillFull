import React, { useState, useRef } from 'react';
import axios from 'axios';
import apiService from "../services/api"
import { useAuth } from '../contexts/AuthContext';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  files?: string[];
}

const AIChatbot: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalVisible, setModalVisible] = useState(false);

  React.useEffect(() => {
    if (open) {
      setModalVisible(true);
    } else {
      // Wait for animation before removing from DOM
      const timeout = setTimeout(() => setModalVisible(false), 320);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  if (!user) return null; // Only show for authenticated users

  const handleSend = async () => {
     console.log('handleSend called', input, files);
    if (!input && files.length === 0) return;
    setMessages((msgs) => [...msgs, { sender: 'user', text: input, files: files.map(f => f.name) }]);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('prompt', input);
      files.forEach((file) => formData.append('files', file));
      const token = localStorage.getItem('authToken');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
      const res = await axios.post(`${API_BASE_URL}/ai-chatbot`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMessages((msgs) => [
        ...msgs,
        { sender: 'ai', text: res.data.aiResponse || 'No response from AI.' },
      ]);
      setInput('');
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { sender: 'ai', text: 'Error: Could not get a response from AI Chatbot.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <>
      {/* Floating Chatbot Icon at Bottom Right with Hover Animation */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: 'fixed',
          bottom: 40,
          right: 40,
          zIndex: 1000,
          background: 'rgba(255,255,255,0.92)',
          border: '2.5px solid #6366f1',
          borderRadius: '50%',
          width: 56,
          height: 56,
          boxShadow: '0 6px 32px rgba(99,102,241,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          cursor: 'pointer',
          transition: 'box-shadow 0.25s, background 0.25s, transform 0.25s',
          backdropFilter: 'blur(8px)',
        }}
        aria-label="Open Learning Chatbot"
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.12)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <span role="img" aria-label="Learning Chatbot">🤖</span>
      </button>
      {/* Large, Centered, Creative Chatbot Modal with Animation */}
      {modalVisible && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: open
              ? 'translate(-50%, -50%) scale(1)'
              : 'translate(-50%, -50%) scale(0.92)',
            opacity: open ? 1 : 0,
            width: '700px',
            maxWidth: '97vw',
            height: '700px',
            maxHeight: '97vh',
            background: 'rgba(245,247,255,0.96)',
            borderRadius: 36,
            boxShadow: '0 16px 64px 0 rgba(99,102,241,0.18)',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '2.5px solid #6366f1',
            backdropFilter: 'blur(16px)',
            transition: 'opacity 0.32s cubic-bezier(.4,1.3,.6,1), transform 0.32s cubic-bezier(.4,1.3,.6,1)',
          }}
        >
          {/* Header with Gradient and Unique Name */}
          <div style={{
            background: 'linear-gradient(90deg, #6366f1 0%, #a5b4fc 100%)',
            color: '#fff',
            padding: '28px 36px',
            fontWeight: 800,
            fontSize: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            letterSpacing: 1.2,
            boxShadow: '0 2px 16px rgba(99,102,241,0.10)',
          }}>
            <span style={{display: 'flex', alignItems: 'center', gap: 16}}>
              <span role="img" aria-label="Learning Chatbot" style={{fontSize: 36}}>🤖</span>
              Learning Chatbot
            </span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 36, cursor: 'pointer', fontWeight: 400, transition: 'color 0.2s' }}>&times;</button>
          </div>
          {/* Chat Area with Glassmorphism and Gradient Bubbles */}
          <div style={{ flex: 1, padding: 36, overflowY: 'auto', background: 'linear-gradient(135deg, #f1f5ff 0%, #e0e7ff 100%)', display: 'flex', flexDirection: 'column', gap: 22 }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '12px 0' }}>
                <span style={{
                  display: 'inline-block',
                  background: msg.sender === 'user' ? 'linear-gradient(90deg, #6366f1 0%, #a5b4fc 100%)' : 'rgba(255,255,255,0.85)',
                  color: msg.sender === 'user' ? '#fff' : '#222',
                  borderRadius: 22,
                  padding: '16px 26px',
                  maxWidth: '80%',
                  wordBreak: 'break-word',
                  boxShadow: msg.sender === 'user' ? '0 2px 12px rgba(99,102,241,0.12)' : '0 2px 12px rgba(160,160,200,0.10)',
                  fontSize: 19,
                  backdropFilter: 'blur(2px)',
                  border: msg.sender === 'user' ? '1.5px solid #a5b4fc' : '1.5px solid #e0e7ff',
                  transition: 'background 0.2s',
                }}>{msg.text}</span>
                {msg.files && msg.files.length > 0 && (
                  <div style={{ fontSize: 14, color: '#555', marginTop: 8 }}>
                    <b>Files:</b> {msg.files.join(', ')}
                  </div>
                )}
              </div>
            ))}
            {loading && <div style={{ textAlign: 'center', color: '#888', fontSize: 20 }}>Learning Chatbot is typing...</div>}
          </div>
          {/* Input Area */}
          <div style={{ padding: 28, borderTop: '1.5px solid #e0e7ff', background: 'rgba(255,255,255,0.98)', display: 'flex', gap: 16, alignItems: 'center' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..."
              style={{ flex: 1, borderRadius: 14, border: '1.5px solid #a5b4fc', padding: '18px 22px', fontSize: 20, background: 'rgba(245,245,255,0.92)', outline: 'none', boxShadow: '0 1px 6px rgba(160,160,200,0.08)', color: '#333' }}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              disabled={loading}
            />
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                borderRadius: 14,
                border: '1.5px solid #a5b4fc',
                background: 'linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 100%)',
                padding: '0 20px',
                fontSize: 28,
                color: '#6366f1',
                cursor: 'pointer',
                fontWeight: 700,
                boxShadow: '0 1px 6px rgba(160,160,200,0.08)',
                transition: 'background 0.2s, color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 56,
              }}
              disabled={loading}
              title="Attach files"
            >📎</button>
            <button
              onClick={handleSend}
              style={{
                borderRadius: 14,
                border: 'none',
                background: 'linear-gradient(90deg, #6366f1 0%, #a5b4fc 100%)',
                color: '#fff',
                padding: '0 44px',
                fontWeight: 900,
                fontSize: 24,
                boxShadow: '0 2px 12px rgba(99,102,241,0.12)',
                cursor: 'pointer',
                height: 56,
                transition: 'background 0.2s, color 0.2s',
                letterSpacing: 1.1,
              }}
              disabled={loading}
            >Send</button>
          </div>
          {files.length > 0 && (
            <div style={{ margin: '0 0 16px 0', fontSize: 15, color: '#555', paddingLeft: 36 }}>
              <b>Files:</b> {files.map(f => f.name).join(', ')}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AIChatbot; 