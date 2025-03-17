import mongoose, { Schema } from "mongoose";
import { ConnectionStatus, IConnectionRequest } from "../../types/types";

const connectionRequestSchema = new Schema<IConnectionRequest>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User", // making relations with user model
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: Object.values(ConnectionStatus),
        message: "{VALUE} is not supported",
      },
    },
  },
  {
    timestamps: true,
  }
);
// ? compound index , make our query very fast
connectionRequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

const ConnectionRequest = mongoose.model(
  "connectionRequests",
  connectionRequestSchema
);

export default ConnectionRequest;
