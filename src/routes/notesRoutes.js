import { Router } from 'express';
import { celebrate } from 'celebrate';

import { authenticate } from '../middleware/authenticate.js';

import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';

import {
  createNoteSchema,
  updateNoteSchema,
  noteIdSchema,
} from '../validations/notesValidation.js';

const notesRouter = Router();

notesRouter.use(authenticate);

notesRouter.get('/', getAllNotes);

notesRouter.get(
  '/:noteId',
  celebrate({ params: noteIdSchema }),
  getNoteById,
);

notesRouter.post(
  '/',
  celebrate({ body: createNoteSchema }),
  createNote,
);

notesRouter.patch(
  '/:noteId',
  celebrate({
    params: noteIdSchema,
    body: updateNoteSchema,
  }),
  updateNote,
);

notesRouter.delete(
  '/:noteId',
  celebrate({ params: noteIdSchema }),
  deleteNote,
);

export default notesRouter;