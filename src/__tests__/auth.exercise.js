import axios from 'axios'
import {resetDb} from 'utils/db-utils'
import * as generate from 'utils/generate'
import startServer from '../start'

let server

beforeAll(async () => {
  server = await startServer({port: 8000})
})

beforeEach(() => resetDb())

afterAll(() => server.close())

describe('auth flow', () => {
  test('register', async () => {
    const {username, password} = generate.loginForm()

    const result = await axios.post('http://localhost:8000/api/auth/register', {
      username,
      password,
    })

    expect(result.data.user.username).toEqual(expect.any(String))
  })

  test('login', () => {
    // 🐨 use axios.post to post the username and password again, but to the login endpoint
    // 💰 http://localhost:8000/api/auth/login
    //
    // 🐨 assert that the result you get back is correct
    // 💰 tip: the data you get back is exactly the same as the data you get back
    // from the registration call, so this can be done really easily by comparing
    // the data of those results with toEqual
  })

  test('authenticated request', () => {
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
})
