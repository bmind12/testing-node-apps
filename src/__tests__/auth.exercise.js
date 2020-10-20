import axios from 'axios'
import {resetDb} from 'utils/db-utils'
import * as generate from 'utils/generate'
import startServer from '../start'
import {getData, handleRequestFailure} from '../../test/utils/async'

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

api.interceptors.response.use(getData, handleRequestFailure)

test('auth flow', async () => {
  const {username, password} = generate.loginForm()

  const registerData = await api.post('/auth/register', {
    username,
    password,
  })

  expect(registerData.user).toEqual({
    token: expect.any(String),
    id: expect.any(String),
    username,
  })

  const loginData = await api.post('/auth/login', {
    username,
    password,
  })

  expect(loginData).toEqual(registerData)

  const token = loginData.user.token
  const authData = await api.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
      fake: 'erase',
    },
  })

  expect(authData).toEqual(registerData)
})
