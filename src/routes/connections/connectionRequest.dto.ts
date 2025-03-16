import { Expose, Transform } from "class-transformer";
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import sanitizeHtml from "sanitize-html";
import { ConnectionStatus, StringValue } from "./../../types/types";

export class ConnectionRequestParamsDto {
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
  @IsEnum(ConnectionStatus, {
    message: `${Object.values(ConnectionStatus)
      .slice(0, 2)
      .join(",")} these values are valid`,
  })
  status: ConnectionStatus;

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
