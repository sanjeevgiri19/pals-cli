import chalk from "chalk";

/**
 * Validate request body against a Zod schema
 * @param {ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware
 */
export const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.validated = validated;
      next();
    } catch (error) {
      if (error.errors) {
        const messages = error.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", ");
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Request validation failed",
            details: messages,
          },
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
      }
      next(error);
    }
  };
};

/**
 * Validate request query params against a Zod schema
 * @param {ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware
 */
export const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.query);
      req.validatedQuery = validated;
      next();
    } catch (error) {
      if (error.errors) {
        const messages = error.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", ");
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Query validation failed",
            details: messages,
          },
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
      }
      next(error);
    }
  };
};

/**
 * Validate request params against a Zod schema
 * @param {ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware
 */
export const validateParams = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.params);
      req.validatedParams = validated;
      next();
    } catch (error) {
      if (error.errors) {
        const messages = error.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", ");
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Parameter validation failed",
            details: messages,
          },
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
      }
      next(error);
    }
  };
};
