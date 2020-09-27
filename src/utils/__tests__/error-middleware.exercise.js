import {UnauthorizedError} from 'express-jwt'
import errorMiddleware from '../error-middleware'

function buildRes(overrides) {
  const res = {
    json: jest.fn(() => res),
    status: jest.fn(() => res),
    ...overrides,
  }

  return res
}

describe('Error Middleware', () => {
  it('handles express-jwt unauthorized error', () => {
    const code = 'some_error_code'
    const message = 'Some message'
    const error = new UnauthorizedError(code, {message})
    const req = {}
    const next = jest.fn()
    const res = buildRes()

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
    const error = new Error('Error')
    const req = {}
    const next = jest.fn()
    const res = buildRes({headersSent: true})

    errorMiddleware(error, req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(error)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  it('handles an unknown error', () => {
    const error = new Error('Error')
    const req = {}
    const next = jest.fn()
    const res = buildRes()

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
