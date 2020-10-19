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

const BASE_URL = 'http://localhost:8000/api'
const api = axios.create({baseURL: BASE_URL})

test('auth flow', async () => {
  const {username, password} = generate.loginForm()

  const registerResult = await api.post('/auth/register', {
    username,
    password,
  })

  expect(registerResult.data.user).toEqual({
    token: expect.any(String),
    id: expect.any(String),
    username,
  })

  const loginResult = await api.post('/auth/login', {
    username,
    password,
  })

  expect(loginResult.data).toEqual(registerResult.data)

  const token = loginResult.data.user.token
  const authResult = await api.get('/auth/me', {
    headers: {Authorization: `Bearer ${token}`},
  })

  expect(authResult.data).toEqual(registerResult.data)
})
