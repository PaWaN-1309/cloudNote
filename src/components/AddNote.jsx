import React, { useContext, useState, useEffect } from 'react'
import noteContext from '../context/notes/noteContext';
const AddNote = () => {
    const context = useContext(noteContext);
    const {addNote} = context;
    const [note, setNote] = useState({title: "", description: "", tag: ""})

    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        setNote({title: "", description: "", tag: ""})
    }

    const onChange = (e) => {
        setNote({...note, [e.target.name]: e.target.value})
    }

    return (
        <div className='container my-5'>
            <h1 className='my-4'>Add a Note</h1>
            <form>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title of Note</label>
                    <input type="text" name='title' className="form-control" id="title" aria-describedby="emailHelp" onChange={onChange} value={note.title} />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" name='description' className="form-control" id="description" onChange={onChange} value={note.description} />
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" name='tag' className="form-control" id="tag" onChange={onChange} value={note.tag} />
                </div>
                <button disabled={note.title.length < 5 || note.description.length < 5} onClick={handleClick} type="submit" className="btn btn-primary">Add Note</button>
            </form>
        </div>
    )
}

export default AddNote
