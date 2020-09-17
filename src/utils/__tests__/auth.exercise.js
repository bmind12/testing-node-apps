// Testing Pure Functions
import cases from 'jest-in-case'
import {isPasswordAllowed} from '../auth'

describe('Password validation', () => {
  cases(
    'isPasswordAllowed: valid passwords',
    (options) => {
      expect(isPasswordAllowed(options.password)).toBeTruthy()
    },
    {
      'valid password': {password: '!aBc123'},
    },
  )

  cases(
    'isPasswordAllowed: invalid passwords',
    (options) => {
      expect(isPasswordAllowed(options.password)).toBeFalsy()
    },
    {
      'too short': {password: 'a2c!'},
      'no alphabet characters': {password: '123456!'},
      'no numbers': {password: 'ABCdef!'},
      'no uppercase letters': {password: 'abc123!'},
      'no lowercase letters': {password: 'ABC123!'},
      'no non-alphanumeric characters': {password: 'ABCdef123'},
    },
  )
})
