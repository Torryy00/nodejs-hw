import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const updateUserAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(createHttpError(400, 'No file'));
    }

    const userId = req.user._id;

    const result = await saveFileToCloudinary(req.file.buffer, userId);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: result.secure_url },
      { returnDocument: 'after' }, // ✅ FIX
    );

    return res.status(200).json({
      url: updatedUser.avatar,
    });
  } catch (err) {
    next(err);
  }
};