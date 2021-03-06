// Testing CRUD API Routes

import axios from 'axios'
import {resetDb, insertTestUser} from 'utils/db-utils'
import {getData, handleRequestFailure, resolve} from 'utils/async'
import * as generate from 'utils/generate'
import * as booksDB from '../db/books'
import startServer from '../start'

let baseURL, server

beforeAll(async () => {
  server = await startServer()
  baseURL = `http://localhost:${server.address().port}/api`
})

afterAll(() => server.close())

beforeEach(() => resetDb())

async function setup() {
  const testUser = await insertTestUser()
  const authAPI = axios.create({baseURL})
  authAPI.defaults.headers.common.authorization = `Bearer ${testUser.token}`
  authAPI.interceptors.response.use(getData, handleRequestFailure)
  return {testUser, authAPI}
}

test('listItem CRUD', async () => {
  const {testUser, authAPI} = await setup()
  const book = generate.buildBook()

  await booksDB.insert(book)

  const createData = await authAPI.post('/list-items', {bookId: book.id})

  expect(createData.listItem).toMatchObject({
    ownerId: testUser.id,
    bookId: book.id,
    book,
  })

  const listItemId = createData.listItem.id
  const listItemIdUrl = `list-items/${listItemId}`
  const readData = await authAPI.get(listItemIdUrl)

  expect(readData.listItem).toEqual(createData.listItem)

  const updates = {notes: generate.notes()}
  const updateData = await authAPI.put(listItemIdUrl, updates)

  expect(updateData.listItem).toMatchObject({...readData.listItem, ...updates})

  const deleteData = await authAPI.delete(listItemIdUrl)

  expect(deleteData).toEqual({success: true})

  const readDeletedError = await authAPI.get(listItemIdUrl).catch(resolve)

  expect(readDeletedError.status).toBe(404)
  expect(
    readDeletedError.data.message.replace(listItemId, 'FAKE_ID'),
  ).toMatchInlineSnapshot(`"No list item was found with the id of FAKE_ID"`)
})
