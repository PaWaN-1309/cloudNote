const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const fetchUser = require("../middleware/fetchUser");
const { body, validationResult } = require("express-validator");

// TODO: Get all the notes from the database using: GET "/api/notes/fetchallnotes".. Login required

router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error..");
  }
});

// TODO: Add a new note to the database using: POST "/api/notes/addnote".. Login required
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const savedNote = await note.save();
      res.json({ savedNote });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error..");
    }
  }
);

// TODO: Update existing note to the database using: PUT "/api/notes/updatenote".. Login required
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    // Create a new note object as a copy
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //? Find note to be updated and update it
    let existingNote = await Note.findById(req.params.id);
    if (!existingNote) {
      return res.status(404).send("Not found!");
    }
    //? Allow only if the the user is the owner of the note
    if (existingNote.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed!");
    }

    existingNote = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    res.json({ existingNote });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error..");
  }
});

// TODO: Delete an existing note to the database using: DELETE "/api/notes/updatenote".. Login required
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  try {
    let existingNote = await Note.findById(req.params.id);
    if (!existingNote) {
      return res.status(404).send("Not found!");
    }
    if (existingNote.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed!");
    }

    existingNote = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: " Note has been deleted", deletedNote: existingNote });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error..");
  }
});

module.exports = router;
