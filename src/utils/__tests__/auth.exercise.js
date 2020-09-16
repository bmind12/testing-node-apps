// Testing Pure Functions

// 💣 remove this todo test (it's only here so you don't get an error about missing tests)

// 🐨 import the function that we're testing
import {isPasswordAllowed} from '../auth'

describe('Password validation', () => {
  const allowedPasswords = ['!aBc123']
  const disallowedPasswords = [
    'a2c!',
    '123456!',
    'ABCdef!',
    'abc123!',
    'ABC123!',
    'ABCdef123',
  ]

  allowedPasswords.forEach((password) =>
    test(`allows ${password}`, () => {
      const isValid = isPasswordAllowed(password)

      expect(isValid).toBeTruthy()
    }),
  )

  disallowedPasswords.forEach((password) =>
    test(`disallows ${password}`, () => {
      const isValid = isPasswordAllowed(password)

      expect(isValid).toBeFalsy()
    }),
  )
})
