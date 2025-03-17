import { PopulatedDoc, Types } from "mongoose";

export enum Gender {
  "Male" = "male",
  "FeMale" = "female",
}

export type StringValue = {
  value: string;
  [key: string]: any;
};

export interface IUser {
  _id?: Types.ObjectId;
  firstName: string;
  lastName?: string;
  emailId: string;
  password: string;
  age?: number;
  gender?: Gender;
  imageUrl?: string;
}

export interface IUserDocument extends IUser, Document {
  getJwt: () => string;
  validatePassword: (password: string) => Promise<boolean>;
  hashPassword: (password: string) => Promise<string>;
}

export enum ConnectionStatus {
  "interested" = "interested",
  "ignored" = "ignored",
  "rejected" = "rejected",
  "accepted" = "accepted",
}

export enum SendConnectionStatus {
  "interested" = "interested",
  "ignored" = "ignored",
}

export enum ReviewConnectionStatus {
  "rejected" = "rejected",
  "accepted" = "accepted",
}

export interface IConnectionRequest {
  senderId: PopulatedDoc<IUser>;
  receiverId: PopulatedDoc<IUser>;
  status: ConnectionStatus;
}
