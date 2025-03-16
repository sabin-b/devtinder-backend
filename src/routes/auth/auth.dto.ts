import { Expose, Transform } from "class-transformer";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";
import sanitizeHtml from "sanitize-html";
import { StringValue } from "../../types/types";

/**
 * The signup dto class is used to validate the user signup inputs.
 */
export class SignupDto {
  /**
   * The first name of the user.
   * Must contain more than 3 characters.
   */
  @Expose()
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
    message: "first Name is too short , contain more than 3 characters long",
  })
  firstName: string;

  /**
   * The last name of the user.
   * Can be empty.
   */
  @Expose()
  @IsString()
  @Transform(({ value }: StringValue) =>
    value && value.length > 0
      ? sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        }).trim()
      : value
  )
  @IsOptional()
  lastName?: string;

  /**
   * The email address of the user.
   * Must be in valid email format.
   */
  @Expose()
  @IsString()
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
  @IsEmail()
  emailId: string;

  /**
   * The password of the user.
   * Must contain at least 6 characters.
   */
  @Expose()
  @IsString()
  @Transform(({ value }: StringValue) =>
    value && value.length > 0
      ? sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        }).trim()
      : value
  )
  @MinLength(6, { message: "password should contain 6 characters long" })
  password: string;
}

/**
 * The signin dto class is used to validate the user signin inputs.
 */
export class SiginInDto {
  /**
   * The email address of the user.
   */
  @Expose()
  @IsString()
  @Transform(({ value }: StringValue) =>
    value && value.length
      ? sanitizeHtml(value, { allowedAttributes: {}, allowedTags: [] })
          .trim()
          .toLowerCase()
      : value
  )
  @IsEmail()
  emailId: string;

  /**
   * The password of the user.
   */
  @Expose()
  @IsString()
  @Transform(({ value }: StringValue) =>
    value && value.length
      ? sanitizeHtml(value, { allowedAttributes: {}, allowedTags: [] })
          .trim()
          .toLowerCase()
      : value
  )
  @MinLength(1, { message: "please enter the password" })
  password: string;
}
