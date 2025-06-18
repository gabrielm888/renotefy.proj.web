import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNotes } from '../contexts/NotesContext';
import * as aiService from '../services/ai';
import { formatDate } from '../utils/helpers';

const StudyMode = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { getNoteById } = useNotes();
  
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const loadNote = async () => {
      try {
        const noteData = await getNoteById(noteId);
        if (noteData) {
          setNote(noteData);
        } else {
          // Note not found, redirect to dashboard
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error loading note:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    loadNote();
  }, [noteId, getNoteById, navigate]);

  // Handle sending messages to the AI
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const newUserMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, newUserMessage]);
    setChatInput('');
    
    setChatLoading(true);
    try {
      // Use note content as context
      const context = note ? `This conversation is about a note titled "${note.title}". The note content is: ${note.content.substring(0, 1000)}...` : '';
      
      const response = await aiService.chatWithAI(
        [...chatMessages, newUserMessage], 
        context
      );
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
      console.error('Chat error:', error);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark flex">
      {/* Main content area */}
      <div className={`flex-grow transition-all duration-300 ${chatOpen ? 'mr-80' : ''}`}>
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white dark:bg-dark-light border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/dashboard')}
                className="p-2 mr-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </button>
              <h1 className="text-xl font-medium">Study Mode</h1>
            </div>
            <button 
              onClick={() => setChatOpen(!chatOpen)}
              className={`p-2 rounded-md ${chatOpen ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              title="AI Study Assistant"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Note content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto bg-white dark:bg-dark-light rounded-lg shadow-sm p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <span className="text-3xl mr-3" role="img" aria-label="Note emoji">
                  {note?.emoji || '📝'}
                </span>
                <h1 className="text-2xl font-bold">{note?.title || 'Untitled Note'}</h1>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {note?.updatedAt ? formatDate(note.updatedAt) : 'Unknown'}
              </div>
            </div>

            <div className="prose dark:prose-invert prose-sm sm:prose-base max-w-none">
              <div dangerouslySetInnerHTML={{ __html: note?.content || '' }} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat sidebar */}
      <motion.div 
        className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-dark-light border-l border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden"
        initial={{ x: '100%' }}
        animate={{ x: chatOpen ? 0 : '100%' }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full">
          {/* Chat header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <h3 className="font-medium">AI Study Assistant</h3>
            <button 
              onClick={() => setChatOpen(false)} 
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Chat messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                <p>Ask me anything about this note!</p>
                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => setChatInput("Can you summarize this note?")}
                    className="block w-full text-left p-2 rounded bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Summarize this note
                  </button>
                  <button
                    onClick={() => setChatInput("What are the key concepts in this note?")}
                    className="block w-full text-left p-2 rounded bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Extract key concepts
                  </button>
                  <button
                    onClick={() => setChatInput("Create a quiz based on this note")}
                    className="block w-full text-left p-2 rounded bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Create a quiz
                  </button>
                </div>
              </div>
            ) : (
              chatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg max-w-[85%] ${
                    msg.role === 'user' 
                      ? 'bg-primary/10 text-primary ml-auto' 
                      : 'bg-gray-100 dark:bg-gray-800 mr-auto'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              ))
            )}
            {chatLoading && (
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg max-w-[85%] mr-auto">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Chat input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about this note..."
                className="flex-grow p-2 border rounded-l bg-white dark:bg-dark text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="bg-primary text-white px-3 py-2 rounded-r hover:bg-primary-dark transition-colors"
                disabled={chatLoading || !chatInput.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudyMode;
