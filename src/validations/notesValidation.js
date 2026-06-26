import Joi from 'joi';
import mongoose from 'mongoose';
import { TAGS } from '../constants/tags.js';

const isValidObjectId = (value, helpers) => {
  if (!mongoose.isValidObjectId(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

export const getAllNotesSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  perPage: Joi.number().integer().min(5).max(20).default(10),
  tag: Joi.string().valid(...TAGS),
  search: Joi.string().allow('').optional(),
});

export const noteIdSchema = Joi.object({
  noteId: Joi.string().custom(isValidObjectId),
});

export const createNoteSchema = Joi.object({
  title: Joi.string().min(1).required(),
  content: Joi.string().allow('').optional(),
  tag: Joi.string().valid(...TAGS).optional(),
});

export const updateNoteSchema = Joi.object({
  title: Joi.string().min(1),
  content: Joi.string().allow(''),
  tag: Joi.string().valid(...TAGS),
}).or('title', 'content', 'tag');