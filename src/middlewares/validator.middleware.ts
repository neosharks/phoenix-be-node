import * as joi from "joi";
import { Request, Response, NextFunction } from "express";

export interface IValidation {
  options?: IValidationOptions;
  body?: joi.SchemaLike;
  headers?: joi.SchemaLike;
  query?: joi.SchemaLike;
  cookies?: joi.SchemaLike;
  params?: joi.SchemaLike;
}

export interface IValidationOptions {
  allowUnknownBody?: boolean;
  allowUnknownQuery?: boolean;
  allowUnknownHeaders?: boolean;
  allowUnknownParams?: boolean;
  allowUnknownCookies?: boolean;
  joiOptions?: joi.ValidationOptions;
}

const props = ["body", "query", "headers", "params", "cookies"];

export const validate = (settings: IValidation) => {
  let errors: any = [];
  settings.options = settings.options || {};

  return (req: Request, res: Response, next: NextFunction) => {
    for (const p of props) {
      if (settings.hasOwnProperty(p)) {
        const options = settings.options.hasOwnProperty("joiOptions")
          ? settings.options.joiOptions
          : {};
        const name = `allowUnknown${p[0].toUpperCase()}${p.slice(1)}`;
        options.allowUnknown = settings.options.hasOwnProperty(name)
          ? settings.options[name]
          : true;

        const result = joi.validate(req[p], settings[p], options);

        if (result.hasOwnProperty("error") && result.error) {
          errors = errors.concat(result.error.details);
        }
      }
    }

    if (errors.length) {
      return next({
        isJoi: true,
        errors: errors,
      });
    }

    next();
  };
};
