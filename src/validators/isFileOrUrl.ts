import {
  isURL,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";
import { isMulterFile } from "../utils/helpers";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export function IsFileOrUrl(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    return registerDecorator({
      name: "IsFileOrUrl",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(
          value: Express.Multer.File | string,
          validationArguments: ValidationArguments
        ) {
          //? check is a file
          const isFile =
            isMulterFile(value) &&
            ACCEPTED_IMAGE_TYPES.includes(value.mimetype) &&
            value.size < 2 * 1024 * 1024;

          //? is url
          const isUrl = typeof value === "string" && isURL(value);

          return isFile || isUrl;
        },
        defaultMessage: () =>
          "Image must be a valid URL or a file (jpeg, png, webp) under 2MB.",
      },
    });
  };
}
