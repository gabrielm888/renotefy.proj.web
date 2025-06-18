import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as aiService from '../services/ai';

const AIPanel = ({ isOpen, onClose, selectedText, noteContent, title, noteId }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [aiParameters, setAIParameters] = useState({
    summaryLength: 'medium',
    quizType: 'mcq',
    quizCount: 5,
    language: 'Spanish',
  });
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Reset results when closing panel or changing tabs
  useEffect(() => {
    if (!isOpen) {
      setResult('');
    }
  }, [isOpen]);

  useEffect(() => {
    setResult('');
  }, [activeTab]);

  // Process content for AI operations - use selected text if available, otherwise use entire note
  const getContentForProcessing = () => {
    // If user has selected text, use that
    if (selectedText && selectedText.trim().length > 0) {
      return selectedText;
    }
    
    // Otherwise use the entire note content
    return noteContent || '';
  };

  // Handle summarization
  const handleSummarize = async () => {
    const content = getContentForProcessing();
    if (!content) return;
    
    setLoading(true);
    try {
      const summary = await aiService.summarizeText(content, aiParameters.summaryLength);
      setResult(summary);
    } catch (error) {
      setResult('Error generating summary. Please try again.');
      console.error('Summary error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle mind map generation
  const handleMindMap = async () => {
    const content = getContentForProcessing();
    if (!content) return;
    
    setLoading(true);
    try {
      const mindMapData = await aiService.generateMindMap(content);
      setResult(JSON.stringify(mindMapData, null, 2));
      // In a real implementation, we would render this as a visual mind map
    } catch (error) {
      setResult('Error generating mind map. Please try again.');
      console.error('Mind map error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle quiz generation
  const handleQuizGeneration = async () => {
    const content = getContentForProcessing();
    if (!content) return;
    
    setLoading(true);
    try {
      let quiz;
      if (aiParameters.quizType === 'mcq') {
        quiz = await aiService.generateMCQQuiz(content, aiParameters.quizCount);
      } else {
        quiz = await aiService.generateShortAnswerQuiz(content, aiParameters.quizCount);
      }
      setResult(JSON.stringify(quiz, null, 2));
      // In a real implementation, we would render this as an interactive quiz
    } catch (error) {
      setResult('Error generating quiz. Please try again.');
      console.error('Quiz error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle grammar check
  const handleGrammarCheck = async () => {
    const content = getContentForProcessing();
    if (!content) return;
    
    setLoading(true);
    try {
      const reviewResult = await aiService.reviewText(content);
      setResult(reviewResult);
    } catch (error) {
      setResult('Error checking grammar. Please try again.');
      console.error('Grammar check error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle translation
  const handleTranslate = async () => {
    const content = getContentForProcessing();
    if (!content) return;
    
    setLoading(true);
    try {
      const translated = await aiService.translateText(content, aiParameters.language);
      setResult(translated);
    } catch (error) {
      setResult('Error translating text. Please try again.');
      console.error('Translation error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle emoji generation
  const handleEmojiGeneration = async () => {
    const contentToUse = title || noteContent.substring(0, 200);
    if (!contentToUse) return;
    
    setLoading(true);
    try {
      const emoji = await aiService.generateEmoji(contentToUse);
      setResult(emoji);
    } catch (error) {
      setResult('Error generating emoji. Please try again.');
      console.error('Emoji generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle chatbot message
  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    const newUserMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, newUserMessage]);
    setChatInput('');
    
    setLoading(true);
    try {
      const context = `This conversation is about a note titled "${title}". The note content is: ${noteContent.substring(0, 500)}...`;
      
      const response = await aiService.chatWithAI(
        [...chatMessages, newUserMessage], 
        context
      );
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Execute AI operation based on active tab
  const handleProcessContent = () => {
    switch (activeTab) {
      case 'summary':
        handleSummarize();
        break;
      case 'mindmap':
        handleMindMap();
        break;
      case 'quiz':
        handleQuizGeneration();
        break;
      case 'grammar':
        handleGrammarCheck();
        break;
      case 'translate':
        handleTranslate();
        break;
      case 'emoji':
        handleEmojiGeneration();
        break;
      default:
        break;
    }
  };

  return (
    <motion.div
      className={`fixed right-0 top-0 h-full w-80 bg-white dark:bg-dark-light border-l border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden ${isOpen ? 'block' : 'hidden'}`}
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <h3 className="font-medium">AI Tools</h3>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800 flex overflow-x-auto">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-3 py-2 text-sm ${activeTab === 'summary' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 dark:text-gray-400'}`}
        >
          Summarize
        </button>
        <button
          onClick={() => setActiveTab('mindmap')}
          className={`px-3 py-2 text-sm ${activeTab === 'mindmap' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 dark:text-gray-400'}`}
        >
          Mind Map
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-3 py-2 text-sm ${activeTab === 'quiz' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 dark:text-gray-400'}`}
        >
          Quiz
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-3 py-2 text-sm ${activeTab === 'chat' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 dark:text-gray-400'}`}
        >
          Chat
        </button>
      </div>
      
      {/* Tab content */}
      <div className="p-4">
        {activeTab === 'summary' && (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Summary Length</label>
              <select 
                className="w-full p-2 border rounded bg-white dark:bg-dark text-sm"
                value={aiParameters.summaryLength}
                onChange={(e) => setAIParameters({...aiParameters, summaryLength: e.target.value})}
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>
            <button 
              className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition-colors"
              onClick={handleProcessContent}
              disabled={loading}
            >
              {loading ? 'Summarizing...' : 'Summarize Content'}
            </button>
          </div>
        )}
        
        {activeTab === 'mindmap' && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Generate a mind map from your note content. This will analyze the key concepts and their relationships.
            </p>
            <button 
              className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition-colors"
              onClick={handleProcessContent}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Mind Map'}
            </button>
          </div>
        )}
        
        {activeTab === 'quiz' && (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Quiz Type</label>
              <select 
                className="w-full p-2 border rounded bg-white dark:bg-dark text-sm"
                value={aiParameters.quizType}
                onChange={(e) => setAIParameters({...aiParameters, quizType: e.target.value})}
              >
                <option value="mcq">Multiple Choice</option>
                <option value="shortAnswer">Short Answer</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Number of Questions</label>
              <input 
                type="number" 
                min="1" 
                max="10"
                className="w-full p-2 border rounded bg-white dark:bg-dark text-sm"
                value={aiParameters.quizCount}
                onChange={(e) => setAIParameters({...aiParameters, quizCount: parseInt(e.target.value)})}
              />
            </div>
            <button 
              className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition-colors"
              onClick={handleProcessContent}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Quiz'}
            </button>
          </div>
        )}
        
        {activeTab === 'grammar' && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Check your text for grammar, spelling, and style improvements.
            </p>
            <button 
              className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition-colors"
              onClick={handleProcessContent}
              disabled={loading}
            >
              {loading ? 'Checking...' : 'Check Grammar & Style'}
            </button>
          </div>
        )}
        
        {activeTab === 'translate' && (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Translate to</label>
              <select 
                className="w-full p-2 border rounded bg-white dark:bg-dark text-sm"
                value={aiParameters.language}
                onChange={(e) => setAIParameters({...aiParameters, language: e.target.value})}
              >
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Italian">Italian</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
              </select>
            </div>
            <button 
              className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition-colors"
              onClick={handleProcessContent}
              disabled={loading}
            >
              {loading ? 'Translating...' : 'Translate'}
            </button>
          </div>
        )}
        
        {activeTab === 'emoji' && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Generate a relevant emoji for your note based on its content.
            </p>
            <button 
              className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition-colors"
              onClick={handleProcessContent}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Emoji'}
            </button>
          </div>
        )}
        
        {activeTab === 'chat' && (
          <div className="h-[calc(100vh-180px)] flex flex-col">
            {/* Chat messages */}
            <div className="flex-grow overflow-y-auto mb-4 space-y-3">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                  <p>Ask me anything about your note</p>
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
                    <p className="text-sm">{msg.content}</p>
                  </div>
                ))
              )}
              {loading && (
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
            <div className="mt-auto flex">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about your note..."
                className="flex-grow p-2 border rounded-l bg-white dark:bg-dark text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
              />
              <button
                onClick={handleSendChatMessage}
                className="bg-primary text-white px-3 py-2 rounded-r"
                disabled={loading || !chatInput.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Results */}
      {result && activeTab !== 'chat' && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <h4 className="font-medium mb-2 text-sm">Results</h4>
          <div className="bg-gray-50 dark:bg-dark p-3 rounded-lg">
            <p className="text-sm whitespace-pre-wrap">{result}</p>
          </div>
          <div className="mt-2 flex justify-end">
            <button
              className="text-xs text-primary hover:underline"
              onClick={() => navigator.clipboard.writeText(result)}
            >
              Copy to clipboard
            </button>
            {activeTab !== 'emoji' ? (
              <button
                className="text-xs text-primary hover:underline ml-2"
                onClick={() => {
                  if (editorRef && editorRef.current) {
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                      const range = selection.getRangeAt(0);
                      range.deleteContents();
                      range.insertNode(document.createTextNode(result));
                    } else {
                      editorRef.current.innerHTML += result;
                    }
                  }
                }}
              >
                Insert into editor
              </button>
            ) : null}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AIPanel;
