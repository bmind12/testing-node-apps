// Testing Pure Functions

// 💣 remove this todo test (it's only here so you don't get an error about missing tests)

// 🐨 import the function that we're testing
import {isPasswordAllowed} from '../auth'

describe('Password validation', () => {
  it('validates password', () => {
    const isValid = isPasswordAllowed('!aBc123')

    expect(isValid).toBeTruthy()
  })

  describe('invalidates password', () => {
    it('which is too short', () => {
      const isValid = isPasswordAllowed('a2c!')

      expect(isValid).toBeFalsy()
    })

    it('without alphabet characters', () => {
      const isValid = isPasswordAllowed('123456!')

      expect(isValid).toBeFalsy()
    })

    it('without numbers', () => {
      const isValid = isPasswordAllowed('ABCdef!')

      expect(isValid).toBeFalsy()
    })

    it('without uppercase', () => {
      const isValid = isPasswordAllowed('abc123!')

      expect(isValid).toBeFalsy()
    })

    it('without lower case', () => {
      const isValid = isPasswordAllowed('ABC123!')

      expect(isValid).toBeFalsy()
    })

    it('without non-alphanumeric characters', () => {
      const isValid = isPasswordAllowed('ABCdef123')

      expect(isValid).toBeFalsy()
    })
  })
})
