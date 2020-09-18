// Testing Pure Functions
import cases from 'jest-in-case'
import {isPasswordAllowed} from '../auth'

function casify(obj) {
  return Object.entries(obj).map(([name, password]) => {
    return {
      name: `${name} - ${password}`,
      password,
    }
  })
}

describe('Password validation', () => {
  cases(
    'isPasswordAllowed: valid passwords',
    (options) => {
      expect(isPasswordAllowed(options.password)).toBeTruthy()
    },
    casify({
      'valid password': '!aBc123',
    }),
  )

  cases(
    'isPasswordAllowed: invalid passwords',
    (options) => {
      expect(isPasswordAllowed(options.password)).toBeFalsy()
    },
    casify({
      'too short': 'a2c!',
      'no alphabet characters': '123456!',
      'no numbers': 'ABCdef!',
      'no uppercase letters': 'abc123!',
      'no lowercase letters': 'ABC123!',
      'no non-alphanumeric characters': 'ABCdef123',
    }),
  )
})
