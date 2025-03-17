import { Expose, Transform, Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class UserFeedQueryStringDto {
  @Expose()
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => (isNaN(value) ? undefined : Number(value)))
  @IsInt()
  @Min(1, {
    message: "Page must be at least 1",
  })
  page?: number;

  @Expose()
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => (isNaN(value) ? undefined : Number(value)))
  @IsInt()
  @Min(1, {
    message: "Limit must be at least 1",
  })
  @Max(50, {
    message: "Limit maximum you can pass is 50",
  })
  limit?: number;
}
