import React, { useContext } from 'react'
import noteContext from '../context/notes/noteContext';
const NoteItem = (props) => {
  const note = props.note
  const updateNote = props.updateNote
  const { deleteNote } = useContext(noteContext);
  return (
    <div className="card mx-3 my-3" style={{ width: "18rem" }}>
      <div className="card-body">
        <h5 className="card-title">{note.title}</h5>
        <p className="card-text">{note.description}</p>
      </div>
      <div className='my-3'>
        <i style={{cursor: "pointer"}} className='mx-2' onClick={() => {deleteNote(note._id)}}>Delete</i>
        <i style={{cursor: "pointer"}} className='mx-2' onClick={() => {updateNote(note)}}>Edit</i>
      </div>
    </div>

  )
}

export default NoteItem
