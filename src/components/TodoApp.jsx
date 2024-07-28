import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const TodoApp = () => {
  const [notes, setNotes] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteAdded, setNoteAdded] = useState(false); // State to track new note addition
  const [isAddingNote, setIsAddingNote] = useState(false); // State to track if note is being added
  const username = localStorage.getItem('username');
  const history = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('https://genai-todob.onrender.com/api/notes', {
        headers: {
          'x-auth-token': token,
        },
      });
      const data = await response.json();
      setNotes(data.map(note => ({ ...note, tags: note.tags || [], priority: note.priority || 'Normal' })));
    };

    fetchNotes();
  }, [noteAdded]); // Refetch notes when noteAdded changes

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddNote = async () => {
    if (inputValue.trim() !== '') {
      setIsAddingNote(true); // Set state to indicate note is being added
      const token = localStorage.getItem('token');
      const response = await fetch('https://genai-todob.onrender.com/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ content: inputValue }),
      });

      const newNote = await response.json();

      // Check the new note structure
      console.log('Response from backend:', newNote);

      setNoteAdded(!noteAdded); // Toggle the state to trigger useEffect
      setInputValue('');
      setIsAddingNote(false); // Reset state after note is added
    }
  };

  const handleNoteClick = (index) => {
    setSelectedNote({ ...notes[index], tags: notes[index].tags || [], priority: notes[index].priority || 'Normal' });
  };

  const handleCloseNote = () => {
    setSelectedNote(null);
  };

  const handleDeleteNote = async (index) => {
    const noteToDelete = notes[index];
    const token = localStorage.getItem('token');
    await fetch(`https://genai-todob.onrender.com/api/notes/${noteToDelete._id}`, {
      method: 'DELETE',
      headers: {
        'x-auth-token': token,
      },
    });
    const updatedNotes = notes.filter((_, noteIndex) => noteIndex !== index);
    setNotes(updatedNotes);
    if (selectedNote === noteToDelete) {
      setSelectedNote(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    history('/login');
  };

  return (
    <div className="main-container">
      <h1 className="heading">Todo App</h1>
      <div className="user-details">
        <span>Welcome, {username}</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      {selectedNote === null ? (
        <>
          <div className="input-area">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter a note"
              className="text-input"
            />
            <button onClick={handleAddNote} className="add-btn" disabled={isAddingNote}>
              {isAddingNote ? 'Generating Note...' : 'Add'}
            </button>
          </div>
          <div className="grid-container">
            {notes.map((note, index) => (
              <div key={index} className="card">
                <div className="card-content" onClick={() => handleNoteClick(index)}>
                  <p className="ellipses">{note.content}</p>
                  <p>Tags: {note.tags.length > 0 ? note.tags.join(', ') : 'No tags'}</p>
                  <p>Priority: {note.priority}</p>
                </div>
                <button
                  onClick={() => handleDeleteNote(index)}
                  className="remove-btn"
                  style={{ backgroundColor: note.priority === 'Normal' ? 'blue' : 'red' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="overlay">
          <div className="card modal">
            <button onClick={handleCloseNote} className="close-btn">X</button>
            <div className="card-content">
              <p>{selectedNote.content}</p>
              <p>Tags: {selectedNote.tags.length > 0 ? selectedNote.tags.join(', ') : 'No tags'}</p>
              <p>Priority: {selectedNote.priority}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoApp;