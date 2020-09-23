import {UnauthorizedError} from 'express-jwt'
import errorMiddleware from '../error-middleware'

describe('Error Middleware', () => {
  it('handles express-jwt unauthorized error', () => {
    const error = new UnauthorizedError('some_error_code', {
      message: 'Some message',
    })
    const nextMock = jest.fn(() => {})
    const res = {json: jest.fn(() => res), status: jest.fn(() => res)}
    const req = {}

    errorMiddleware(error, req, res, nextMock)

    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({
      code: 'some_error_code',
      message: 'Some message',
    })
  })
})

// 🐨 Write a test for the else case (responds with a 500)
