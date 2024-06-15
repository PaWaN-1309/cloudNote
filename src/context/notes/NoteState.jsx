import { useState, useEffect } from "react"
import NoteContext from "./noteContext"
const NoteState = (props) => {
    const host = 'http://localhost:3000'
    const notesInitial = []
    const [notes, setNotes] = useState(notesInitial)

    // ? Get all notes
    const getAllNotes = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
        });
        const responseJson = await response.json();
        setNotes(responseJson)
    }

    // ? Add note
    const addNote = async (title, description, tag) => {
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({
                title, description, tag
            }),
        });


        // await getAllNotes();
        // ! Can either do ↑ or ↓
        const responseData = await response.json();
        const newNote = responseData.savedNote;

        setNotes(prevNotes => [...prevNotes, newNote]);
    }

    //? Delete note
    const deleteNote = async (id) => {
        await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
        });
        const newNotes = notes.filter((note) => {
            return note._id !== id
        })
        setNotes(newNotes)
    }

    //? Edit Note
    const editNote = async (id, title, description, tag) => {
        await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag }),
        });

        let newNotes = JSON.parse(JSON.stringify(notes))
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }
        }

        setNotes(newNotes)
    }

    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getAllNotes }}>
            {props.children}
        </NoteContext.Provider>
    )
}
export default NoteState;