import {UnauthorizedError} from 'express-jwt'
import errorMiddleware from '../error-middleware'

describe('Error Middleware', () => {
  it('handles express-jwt unauthorized error', () => {
    const code = 'some_error_code'
    const message = 'Some message'
    const error = new UnauthorizedError(code, {message})
    const req = {}
    const res = {json: jest.fn(() => res), status: jest.fn(() => res)}
    const next = jest.fn()

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
    const code = 'some_error_code'
    const message = 'Some message'
    const error = new UnauthorizedError(code, {message})
    const req = {}
    const res = {headersSent: {}, json: jest.fn(() => res)}
    const next = jest.fn()

    errorMiddleware(error, req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(error)
    expect(res.json).not.toHaveBeenCalled()
  })
})

// 🐨 Write a test for the else case (responds with a 500)
