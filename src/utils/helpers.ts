import { ValidationError } from "class-validator";
import { MongooseError } from "mongoose";

export function globalErrorHandler(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  } else if (err instanceof MongooseError) {
    return err.message;
  }
  return "something went wrong";
}

export function validationErrorHandler(errors: ValidationError[]) {
  return errors.map((e) => ({
    property: e.property,
    constraints: e.constraints,
  }));
}

//? prevent request by same user
// export function validateMongoDbObjectId(
//   dbUserId: Types.ObjectId,
//   userId_2: string
// ) {
// const reqId = new Types.ObjectId(userId_2);
//   return dbUserId.equals(userId_2) ? true : false;
// }
