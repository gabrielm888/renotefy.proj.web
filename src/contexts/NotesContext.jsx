import { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../services/firebase';
import { useAuth } from './AuthContext';
import { generateEmojiForTitle } from '../services/ai';

// Create notes context
const NotesContext = createContext();

// Custom hook to use the notes context
export const useNotes = () => useContext(NotesContext);

// Notes provider component
export const NotesProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);
  const [publicNotes, setPublicNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentNote, setCurrentNote] = useState(null);
  const [error, setError] = useState('');

  // Fetch user's notes
  useEffect(() => {
    const fetchNotes = async () => {
      if (!currentUser) {
        setNotes([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Query notes owned by the current user
        const q = query(
          collection(firestore, 'notes'),
          where('userId', '==', currentUser.uid),
          orderBy('updatedAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const notesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setNotes(notesData);
        setError('');
      } catch (err) {
        console.error('Error fetching notes:', err);
        setError('Failed to load notes');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [currentUser]);

  // Fetch shared notes
  useEffect(() => {
    const fetchSharedNotes = async () => {
      if (!currentUser) {
        setSharedNotes([]);
        return;
      }
      
      try {
        // Query notes shared with the current user
        const q = query(
          collection(firestore, 'notes'),
          where('sharedWith', 'array-contains', currentUser.email),
          orderBy('updatedAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const sharedNotesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setSharedNotes(sharedNotesData);
      } catch (err) {
        console.error('Error fetching shared notes:', err);
      }
    };

    fetchSharedNotes();
  }, [currentUser]);

  // Fetch public notes
  useEffect(() => {
    const fetchPublicNotes = async () => {
      try {
        // Query public notes
        const q = query(
          collection(firestore, 'notes'),
          where('isPublic', '==', true),
          orderBy('updatedAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const publicNotesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPublicNotes(publicNotesData);
      } catch (err) {
        console.error('Error fetching public notes:', err);
      }
    };

    fetchPublicNotes();
  }, []);

  // Get a note by ID
  const getNoteById = async (noteId) => {
    try {
      const noteRef = doc(firestore, 'notes', noteId);
      const noteSnap = await getDoc(noteRef);
      
      if (noteSnap.exists()) {
        const noteData = { 
          id: noteSnap.id, 
          ...noteSnap.data() 
        };
        
        setCurrentNote(noteData);
        return noteData;
      } else {
        setError('Note not found');
        return null;
      }
    } catch (err) {
      console.error('Error getting note:', err);
      setError('Failed to get note');
      return null;
    }
  };

  // Create a new note
  const createNote = async (noteData) => {
    try {
      if (!currentUser) throw new Error('User must be logged in');
      
      const { title, content } = noteData;
      
      // Generate emoji for the title
      let emoji = '📝';
      try {
        emoji = await generateEmojiForTitle(title, content.substring(0, 200));
      } catch (err) {
        console.error('Error generating emoji:', err);
      }
      
      // Create note document
      const newNote = {
        title,
        content,
        emoji,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userEmail: currentUser.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isPublic: false,
        allowCopy: false,
        sharedWith: [],
      };
      
      const docRef = await addDoc(collection(firestore, 'notes'), newNote);
      
      const createdNote = {
        id: docRef.id,
        ...newNote,
      };
      
      setNotes(prev => [createdNote, ...prev]);
      
      return createdNote;
    } catch (err) {
      console.error('Error creating note:', err);
      setError('Failed to create note');
      throw err;
    }
  };

  // Update a note
  const updateNote = async (noteId, updates) => {
    try {
      const noteRef = doc(firestore, 'notes', noteId);
      
      // Get current note data
      const noteSnap = await getDoc(noteRef);
      if (!noteSnap.exists()) {
        throw new Error('Note not found');
      }
      
      // Check if user has permission to edit
      const noteData = noteSnap.data();
      if (noteData.userId !== currentUser.uid && !noteData.sharedWith.includes(currentUser.email)) {
        throw new Error('You do not have permission to edit this note');
      }
      
      // Update note with new data
      const updatedNoteData = {
        ...updates,
        updatedAt: serverTimestamp(),
      };
      
      await updateDoc(noteRef, updatedNoteData);
      
      // Update local state
      setNotes(prev => {
        return prev.map(note => {
          if (note.id === noteId) {
            return { ...note, ...updatedNoteData };
          }
          return note;
        });
      });
      
      if (currentNote && currentNote.id === noteId) {
        setCurrentNote(prev => ({ ...prev, ...updatedNoteData }));
      }
      
      return { id: noteId, ...updatedNoteData };
    } catch (err) {
      console.error('Error updating note:', err);
      setError('Failed to update note');
      throw err;
    }
  };

  // Delete a note
  const deleteNote = async (noteId) => {
    try {
      // Check if user owns the note
      const noteRef = doc(firestore, 'notes', noteId);
      const noteSnap = await getDoc(noteRef);
      
      if (!noteSnap.exists()) {
        throw new Error('Note not found');
      }
      
      const noteData = noteSnap.data();
      if (noteData.userId !== currentUser.uid) {
        throw new Error('You do not have permission to delete this note');
      }
      
      // Delete the note
      await deleteDoc(noteRef);
      
      // Update local state
      setNotes(prev => prev.filter(note => note.id !== noteId));
      
      if (currentNote && currentNote.id === noteId) {
        setCurrentNote(null);
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Failed to delete note');
      throw err;
    }
  };

  // Upload an image for a note
  const uploadImage = async (file, noteId) => {
    try {
      if (!currentUser) throw new Error('User must be logged in');
      
      // Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, `notes/${noteId}/images/${Date.now()}-${file.name}`);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image');
      throw err;
    }
  };

  // Share a note with another user
  const shareNote = async (noteId, email) => {
    try {
      const noteRef = doc(firestore, 'notes', noteId);
      
      // Get current note data
      const noteSnap = await getDoc(noteRef);
      if (!noteSnap.exists()) {
        throw new Error('Note not found');
      }
      
      // Check if user owns the note
      const noteData = noteSnap.data();
      if (noteData.userId !== currentUser.uid) {
        throw new Error('You do not have permission to share this note');
      }
      
      // Add email to sharedWith array if not already present
      const sharedWith = noteData.sharedWith || [];
      if (!sharedWith.includes(email)) {
        sharedWith.push(email);
      }
      
      // Update the note
      await updateDoc(noteRef, { sharedWith });
      
      // Update local state
      setNotes(prev => {
        return prev.map(note => {
          if (note.id === noteId) {
            return { ...note, sharedWith };
          }
          return note;
        });
      });
      
      if (currentNote && currentNote.id === noteId) {
        setCurrentNote(prev => ({ ...prev, sharedWith }));
      }
      
      return true;
    } catch (err) {
      console.error('Error sharing note:', err);
      setError('Failed to share note');
      throw err;
    }
  };

  // Make a note public or private
  const togglePublicStatus = async (noteId, isPublic) => {
    try {
      const noteRef = doc(firestore, 'notes', noteId);
      
      // Get current note data
      const noteSnap = await getDoc(noteRef);
      if (!noteSnap.exists()) {
        throw new Error('Note not found');
      }
      
      // Check if user owns the note
      const noteData = noteSnap.data();
      if (noteData.userId !== currentUser.uid) {
        throw new Error('You do not have permission to change this note');
      }
      
      // Update the note
      await updateDoc(noteRef, { isPublic });
      
      // Update local state
      setNotes(prev => {
        return prev.map(note => {
          if (note.id === noteId) {
            return { ...note, isPublic };
          }
          return note;
        });
      });
      
      if (currentNote && currentNote.id === noteId) {
        setCurrentNote(prev => ({ ...prev, isPublic }));
      }
      
      return true;
    } catch (err) {
      console.error('Error updating note visibility:', err);
      setError('Failed to update note visibility');
      throw err;
    }
  };

  // Allow or disallow copying of a note
  const toggleAllowCopy = async (noteId, allowCopy) => {
    try {
      const noteRef = doc(firestore, 'notes', noteId);
      
      // Update the note
      await updateDoc(noteRef, { allowCopy });
      
      // Update local state
      setNotes(prev => {
        return prev.map(note => {
          if (note.id === noteId) {
            return { ...note, allowCopy };
          }
          return note;
        });
      });
      
      if (currentNote && currentNote.id === noteId) {
        setCurrentNote(prev => ({ ...prev, allowCopy }));
      }
      
      return true;
    } catch (err) {
      console.error('Error updating copy permission:', err);
      setError('Failed to update copy permission');
      throw err;
    }
  };

  // Copy a note as template
  const copyNoteAsTemplate = async (noteId) => {
    try {
      if (!currentUser) throw new Error('User must be logged in');
      
      // Get the source note
      const noteRef = doc(firestore, 'notes', noteId);
      const noteSnap = await getDoc(noteRef);
      
      if (!noteSnap.exists()) {
        throw new Error('Note not found');
      }
      
      const noteData = noteSnap.data();
      
      // Check if copying is allowed
      if (!noteData.allowCopy && noteData.userId !== currentUser.uid) {
        throw new Error('Copying this note is not allowed');
      }
      
      // Create new note based on the template
      const newNote = {
        title: `Copy of ${noteData.title}`,
        content: noteData.content,
        emoji: noteData.emoji,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userEmail: currentUser.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isPublic: false,
        allowCopy: false,
        sharedWith: [],
        copiedFrom: noteId,
      };
      
      const docRef = await addDoc(collection(firestore, 'notes'), newNote);
      
      const createdNote = {
        id: docRef.id,
        ...newNote,
      };
      
      setNotes(prev => [createdNote, ...prev]);
      
      return createdNote;
    } catch (err) {
      console.error('Error copying note:', err);
      setError('Failed to copy note');
      throw err;
    }
  };

  // Context value
  const value = {
    notes,
    sharedNotes,
    publicNotes,
    currentNote,
    loading,
    error,
    setCurrentNote,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
    uploadImage,
    shareNote,
    togglePublicStatus,
    toggleAllowCopy,
    copyNoteAsTemplate,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};

export default NotesContext;
