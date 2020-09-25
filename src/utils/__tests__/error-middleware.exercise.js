import {UnauthorizedError} from 'express-jwt'
import errorMiddleware from '../error-middleware'

function getTestObject(overrides = {}) {
  const error = overrides.error || new Error('Error')
  const req = {}
  const res = {
    json: jest.fn(() => res),
    status: jest.fn(() => res),
  }
  const next = overrides.next || jest.fn()

  return {
    error,
    req: overrides.req ? {...req, ...overrides.req} : req,
    res: overrides.res ? {...res, ...overrides.res} : res,
    next,
  }
}

describe('Error Middleware', () => {
  it('handles express-jwt unauthorized error', () => {
    const code = 'some_error_code'
    const message = 'Some message'
    const {error, req, res, next} = getTestObject({
      error: new UnauthorizedError(code, {message}),
    })

    errorMiddleware(error, req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({
      code: error.code,
      message: error.message,
    })
  })

  it("doesn't send an error if it was already sent", () => {
    const {error, req, res, next} = getTestObject({res: {headersSent: true}})

    errorMiddleware(error, req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(error)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  it('handles an unknown error', () => {
    const {error, req, res, next} = getTestObject()

    errorMiddleware(error, req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({
      message: error.message,
      stack: error.stack,
    })
    expect(res.json).toHaveBeenCalledTimes(1)
  })
})
