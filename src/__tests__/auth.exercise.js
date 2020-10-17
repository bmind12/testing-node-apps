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

  const token = loginResult.data.user.token
  const authResult = await axios.get('http://localhost:8000/api/auth/me', {
    headers: {Authorization: `Bearer ${token}`},
  })

  expect(authResult.data).toEqual(registerResult.data)
})
