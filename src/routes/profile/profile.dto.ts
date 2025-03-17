import { Expose, Transform, Type } from "class-transformer";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from "class-validator";
import sanitizeHtml from "sanitize-html";
import { Gender, StringValue } from "../../types/types";

/**
 * The UpdateDto class is used to validate the request body of the update user
 * route.
 *
 * The properties of the class are optional, because the user can update only a
 * subset of his/her information.
 */
export class UpdateDto {
  /**
   * The first name of the user.
   */
  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ value }: StringValue) =>
    value && value.length > 0
      ? sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        }).trim()
      : value
  )
  @MinLength(3, {
    message: "first Name is too short, it must contain more than 3 characters",
  })
  firstName?: string;

  /**
   * The last name of the user.
   */
  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ value }: StringValue) =>
    value && value.length > 0
      ? sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        }).trim()
      : value
  )
  @MinLength(1, {
    message: "last Name not provided, it must contain at least 1 character",
  })
  lastName?: string;

  /**
   * The age of the user.
   */
  @Expose()
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => (isNaN(value) ? undefined : Number(value)))
  @Min(18)
  @IsNumber()
  age?: number;

  /**
   * The gender of the user.
   */
  @Expose()
  @IsOptional()
  @Transform(({ value }: StringValue) =>
    value && value.length > 0
      ? sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        })
          .trim()
          .toLowerCase()
      : value
  )
  @IsEnum(Gender)
  gender?: Gender;
}

export class UpdatePasswordDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: StringValue) =>
    value && value.length > 0
      ? sanitizeHtml(value, { allowedAttributes: {}, allowedTags: [] }).trim()
      : value
  )
  @MinLength(1, { message: "please provide the old password" })
  oldPassword: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: StringValue) =>
    value && value.length > 0
      ? sanitizeHtml(value, { allowedAttributes: {}, allowedTags: [] }).trim()
      : value
  )
  @MinLength(6, { message: "new password must be 6 character's long" })
  newPassword: string;
}

/**
 * The delete dto class is used to validate the id passed in the delete user route.
 */
export class DeleteDto {
  /**
   * The id of the user to be deleted.
   */
  @Expose()
  @IsString()
  @Transform(({ value }: StringValue) =>
    value && value.length > 0
      ? sanitizeHtml(value, { allowedAttributes: {}, allowedTags: [] })
      : value
  )
  @MinLength(1, { message: "please provide the valid id" })
  id: string;
}
