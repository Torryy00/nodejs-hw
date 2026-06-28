import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;

  const skip = (Number(page) - 1) * Number(perPage);

  let query = Note.find({ userId: req.user._id });
  let countQuery = Note.find({ userId: req.user._id });

  if (tag) {
    query = query.where('tag').equals(tag);
    countQuery = countQuery.where('tag').equals(tag);
  }

  if (search) {
    const searchCondition = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ],
    };

    query = query.where(searchCondition);
    countQuery = countQuery.where(searchCondition);
  }

  const [notes, totalNotes] = await Promise.all([
    query.skip(skip).limit(Number(perPage)),
    countQuery.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalNotes / Number(perPage));

  res.status(200).json({
    page: Number(page),
    perPage: Number(perPage),
    totalNotes,
    totalPages,
    notes,
  });
};

export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.noteId,
      userId: req.user._id,
    });

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (e) {
    next(e);
  }
};

export const createNote = async (req, res) => {
  const note = await Note.create({
    ...req.body,
    userId: req.user._id,
  });

  res.status(201).json(note);
};

export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.noteId,
      userId: req.user._id,
    });

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (e) {
    next(e);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.noteId,
        userId: req.user._id,
      },
      req.body,
      {
        returnDocument: 'after',
        runValidators: true,
      }
    );

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (e) {
    next(e);
  }
};