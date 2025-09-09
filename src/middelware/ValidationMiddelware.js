import { StatusCodes } from "http-status-codes"


export const Validation = (schema) => {
    return (req, res, next) => {
        const data = {
          ...req.body,
          ...req.params,
          ...req.query,
        }
        const result = schema.validate(data,{ abortEarly: false })
        if (result.error) {
            throw new Error(result.error, { cause: 422})
        }
        next()
    }
   
}
