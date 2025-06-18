import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import EditorToolbar from '../components/EditorToolbar';
import AIPanel from '../components/AIPanel';
import { useAuth } from '../contexts/AuthContext';
import { useNotes } from '../contexts/NotesContext';
import { debounce } from '../utils/helpers';

const Editor = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { 
    getNoteById, 
    createNote, 
    updateNote, 
    uploadImage, 
    currentNote, 
    setCurrentNote 
  } = useNotes();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const editorRef = useRef(null);
  
  // Check if we're creating a new note
  const isNewNote = noteId === 'new';
  
  // Load note when component mounts
  useEffect(() => {
    const loadNote = async () => {
      if (isNewNote) {
        // Set default values for a new note
        setTitle('Untitled Note');
        setContent('');
        return;
      }
      
      try {
        const note = await getNoteById(noteId);
        if (note) {
          setTitle(note.title);
          setContent(note.content);
        } else {
          // Note not found, redirect to dashboard
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error loading note:', error);
        navigate('/dashboard');
      }
    };
    
    loadNote();
    
    // Clean up when component unmounts
    return () => {
      setCurrentNote(null);
    };
  }, [noteId, getNoteById, navigate, isNewNote, setCurrentNote]);

  // Save note with debounce to prevent too many saves
  const saveNote = useCallback(
    debounce(async (noteData) => {
      try {
        setIsSaving(true);
        
        if (isNewNote) {
          // Create new note
          const newNote = await createNote({
            title: noteData.title,
            content: noteData.content
          });
          
          // Update URL to include the new note ID
          navigate(`/editor/${newNote.id}`, { replace: true });
        } else {
          // Update existing note
          await updateNote(noteId, {
            title: noteData.title,
            content: noteData.content
          });
        }
      } catch (error) {
        console.error('Error saving note:', error);
      } finally {
        setIsSaving(false);
      }
    }, 1000),
    [createNote, updateNote, noteId, isNewNote, navigate]
  );

  // Auto-save when title or content changes
  useEffect(() => {
    if (title && content) {
      saveNote({ title, content });
    }
  }, [title, content, saveNote]);

  // Handle title change
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // Handle content change from the editor
  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  // Get selected text from the editor
  const getSelectedText = () => {
    if (window.getSelection) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedContent = range.cloneContents();
        const div = document.createElement('div');
        div.appendChild(selectedContent);
        return div.innerHTML;
      }
    }
    return '';
  };

  // Check for selected text in the editor
  useEffect(() => {
    const checkSelection = () => {
      const selected = getSelectedText();
      if (selected !== selectedText) {
        setSelectedText(selected);
      }
    };

    document.addEventListener('selectionchange', checkSelection);
    return () => document.removeEventListener('selectionchange', checkSelection);
  }, [selectedText]);

  // Handle image upload
  const handleImageUpload = async (file) => {
    try {
      // If it's a new note, we need to create it first to get an ID
      let currentNoteId = noteId;
      
      if (isNewNote) {
        const newNote = await createNote({
          title,
          content
        });
        currentNoteId = newNote.id;
        navigate(`/editor/${newNote.id}`, { replace: true });
      }
      
      const imageUrl = await uploadImage(file, currentNoteId);
      
      // Insert the image at cursor position
      const selection = window.getSelection();
      if (selection.rangeCount) {
        const range = selection.getRangeAt(0);
        const img = document.createElement('img');
        img.src = imageUrl;
        img.className = 'max-w-full h-auto my-2 rounded';
        img.style.maxHeight = '400px';
        range.insertNode(img);
        
        // Move cursor after the image
        range.setStartAfter(img);
        range.setEndAfter(img);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Update content state with new image
        if (editorRef.current) {
          setContent(editorRef.current.innerHTML);
        }
      }
      
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };
  
  // Toggle AI panel
  const toggleAIPanel = () => {
    setIsAIPanelOpen(!isAIPanelOpen);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark flex">
      <Sidebar />
      
      <motion.div 
        className="flex-grow relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Editor header with title and actions */}
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-light sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center space-x-2 flex-grow">
              <button 
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-2xl" role="img" aria-label="Note emoji">
                  {currentNote?.emoji || '📝'}
                </span>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Note title"
                  className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0 w-full"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {isSaving ? 'Saving...' : 'Saved'}
              </span>
              
              <button 
                onClick={toggleAIPanel}
                className="p-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20"
                title="AI tools"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </button>
            </div>
          </div>
          
          <EditorToolbar 
            editorRef={editorRef}
            onContentChange={handleContentChange}
            onImageUpload={handleImageUpload}
          />
        </header>
        
        {/* Main editor content */}
        <div className="flex h-[calc(100vh-120px)]">
          <div className="flex-grow overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto">
              <div
                ref={editorRef}
                contentEditable
                className="min-h-[calc(100vh-180px)] outline-none prose dark:prose-invert prose-sm sm:prose-base prose-headings:font-bold prose-a:text-primary"
                onInput={(e) => handleContentChange(e.target.innerHTML)}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </div>
          
          {/* AI sidebar panel */}
          <AIPanel 
            isOpen={isAIPanelOpen} 
            onClose={toggleAIPanel} 
            selectedText={selectedText}
            noteContent={content}
            title={title}
            noteId={!isNewNote ? noteId : null}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Editor;
