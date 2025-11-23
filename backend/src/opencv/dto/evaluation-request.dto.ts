import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsObject,
} from "class-validator";
import { Type } from "class-transformer";

/**
 * Values inside a step configuration.
 *
 * A value can be:
 * - string
 * - number
 * - boolean
 * - array of strings
 */
export class PipelineParamValueDto {
  @IsString()
  valueString?: string;

  @IsNumber()
  valueNumber?: number;

  @IsBoolean()
  valueBoolean?: boolean;

  @IsArray()
  @IsString({ each: true })
  valueArray?: string[];
}

/**
 * A step configuration:
 * {
 *     paramName: string | number | boolean | string[]
 * }
 */
export class StepConfigDto {
  @IsObject()
  params: Record<
    string,
    string | number | boolean | string[]
  >;
}

/**
 * The full pipeline configuration:
 * {
 *    "Metadata Analysis": { ...params },
 *    "Visual Forensics": { ...params },
 *    ...
 * }
 */
export class EvaluationRequestDto {
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => StepConfigDto)
  config: Record<string, StepConfigDto>;
  file: Express.Multer.File;
}
