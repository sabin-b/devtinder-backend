import { Expose, Transform } from "class-transformer";
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import sanitizeHtml from "sanitize-html";
import {
  ReviewConnectionStatus,
  SendConnectionStatus,
  StringValue,
} from "./../../types/types";

export class SendConnectionRequestParamsDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: StringValue) =>
    value && value.length > 0
      ? sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        }).trim()
      : value
  )
  @IsEnum(SendConnectionStatus, {
    message: `${Object.values(SendConnectionStatus).join(
      ","
    )} these values are valid`,
  })
  status: SendConnectionStatus;

  @Expose()
  @IsNotEmpty()
  @IsMongoId({ message: "receiver id must be valid mongodb id" })
  @Transform(({ value }: StringValue) =>
    value && value.length > 0
      ? sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        }).trim()
      : value
  )
  receiverId: string;
}

export class ReviewConnectionRequestParamsDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: StringValue) =>
    value && value.length > 0
      ? sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        }).trim()
      : value
  )
  @IsEnum(ReviewConnectionStatus, {
    message: `${Object.values(ReviewConnectionStatus).join(
      ","
    )} these values are valid`,
  })
  status: ReviewConnectionStatus;

  @Expose()
  @IsNotEmpty()
  @IsMongoId({ message: "receiver id must be valid mongodb id" })
  @Transform(({ value }: StringValue) =>
    value && value.length > 0
      ? sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        }).trim()
      : value
  )
  requestId: string;
}
