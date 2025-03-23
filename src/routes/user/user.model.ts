import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";
import { Gender, IUserDocument } from "../../types/types";

const userSchema: Schema<IUserDocument> = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    about: {
      type: String,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: Object.values(Gender),
        message: `{VALUE} is not supported`,
      },
    },
  },
  {
    timestamps: true,
  }
);

//? generate jwt token
userSchema.methods.getJwt = function () {
  const secretKey = process.env.AUTH_SECRET || this.password;
  const token = jwt.sign({ _id: this._id, email: this.emailId }, secretKey, {
    expiresIn: "1d",
  });
  return token;
};

// ? validate password
userSchema.methods.validatePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

//? hash password
userSchema.methods.hashPassword = function (password: string) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model<IUserDocument>("User", userSchema);

export default User;
