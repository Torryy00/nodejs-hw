import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    // ❗ ДОБАВИТЬ ЭТО ПОЛЕ
    avatar: {
      type: String,
      default:
        'https://ac.goit.global/fullstack/react/default-avatar.jpg',
    },
  },
  {
    timestamps: true,
  },
);

// username = email если нет username
userSchema.pre('save', function (next) {
  if (!this.username) {
    this.username = this.email;
  }
  next();
});

// убрать пароль из ответа
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = mongoose.model('User', userSchema);