import axios from 'axios'
import {resetDb} from 'utils/db-utils'
import * as generate from 'utils/generate'
import startServer from '../start'

let server

beforeAll(async () => {
  server = await startServer({port: 8000})
})

beforeEach(() => {
  resetDb()
})

afterAll(() => server.close())

test('auth flow', async () => {
  const {username, password} = generate.loginForm()

  const registerResult = await axios.post(
    'http://localhost:8000/api/auth/register',
    {
      username,
      password,
    },
  )

  expect(registerResult.data.user.username).toEqual(expect.any(String))

  const loginResult = await axios.post('http://localhost:8000/api/auth/login', {
    username,
    password,
  })

  expect(loginResult.data).toEqual(registerResult.data)

  // authenticated request
  // 🐨 use axios.get(url, config) to GET the user's information
  // 💰 http://localhost:8000/api/auth/me
  // 💰 This request must be authenticated via the Authorization header which
  // you can add to the config object: {headers: {Authorization: `Bearer ${token}`}}
  // Remember that you have the token from the registration and login requests.
  //
  // 🐨 assert that the result you get back is correct
  // 💰 (again, this should be the same data you get back in the other requests,
  // so you can compare it with that).
})
