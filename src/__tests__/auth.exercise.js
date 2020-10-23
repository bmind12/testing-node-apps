import axios from 'axios'
import {resetDb} from 'utils/db-utils'
import * as generate from 'utils/generate'
import startServer from '../start'
import * as usersDB from '../db/users'
import {getData, handleRequestFailure, resolve} from '../../test/utils/async'

let api, server

beforeAll(async () => {
  server = await startServer({})
  const BASE_URL = `http://localhost:${server.address().port}/api`
  api = axios.create({baseURL: BASE_URL})

  api.interceptors.response.use(getData, handleRequestFailure)
})

beforeEach(() => {
  resetDb()
})

afterAll(() => server.close())

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

test('user name must be unique', async () => {
  const {username, password} = generate.loginForm()

  await usersDB.insert(generate.buildUser({username}))

  const result = await api
    .post('/auth/register', {
      username,
      password,
    })
    .catch(resolve)

  expect(result.status).toBe(400)
  expect(result.data.message).toMatchInlineSnapshot(`"username taken"`)
})
