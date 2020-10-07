import * as generate from 'utils/generate'
import * as booksDB from '../../db/books'
import * as listItemsDB from '../../db/list-items'
import * as listItemsController from '../list-items-controller'

const {
  buildUser,
  buildBook,
  buildListItem,
  buildReq,
  buildRes,
  buildNext,
} = generate

jest.mock('../../db/books')
jest.mock('../../db/list-items')

beforeEach(() => {
  jest.clearAllMocks()
})

test('getListItem returns the req.listItem', async () => {
  const user = buildUser()
  const book = buildBook()
  const listItem = buildListItem({ownerId: user.id, bookId: book.id})

  booksDB.readById.mockResolvedValueOnce(book)

  const req = buildReq({listItem})
  const res = buildRes()

  await listItemsController.getListItem(req, res)

  expect(booksDB.readById).toHaveBeenCalledTimes(1)
  expect(res.json).toHaveBeenCalledTimes(1)
  expect(booksDB.readById).toHaveBeenCalledWith(book.id)
  expect(res.json).toHaveBeenCalledWith({listItem: {...listItem, book}})
})

test('createListItem returns a 400 error if no bookId is provided', async () => {
  const req = buildReq()
  const res = buildRes()

  await listItemsController.createListItem(req, res)

  expect(res.json).toHaveBeenCalledTimes(1)
  expect(res.status).toHaveBeenCalledWith(400)
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "No bookId provided",
      },
    ]
  `)
})

test('setListItem returns a 404 error if no listItem is provided', async () => {
  const req = buildReq()
  const res = buildRes()

  await listItemsController.setListItem(req, res)

  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.status).toHaveBeenCalledWith(404)
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "No list item was found with the id of undefined",
      },
    ]
  `)
})

test('setListItem returns a 403 error if a user is not authorized', async () => {
  const listItem = buildListItem()
  const req = buildReq({listItem, params: {listItem: {id: listItem.id}}})
  const res = buildRes()

  listItemsDB.readById.mockResolvedValueOnce(listItem)

  await listItemsController.setListItem(req, res)

  expect(res.status).toHaveBeenCalledWith(403)
  expect(res.status).toHaveBeenCalledTimes(1)
})

test('setListItem returns req.listItem', async () => {
  const user = buildUser()
  const listItem = buildListItem({ownerId: user.id})
  const req = buildReq({listItem, params: {listItem: {id: listItem.id}}, user})
  const res = buildRes()
  const next = buildNext()

  listItemsDB.readById.mockResolvedValueOnce(listItem)

  await listItemsController.setListItem(req, res, next)

  expect(req.listItem).toEqual(listItem)
})

test('getListItems returns req.listItems', async () => {})

test('createListItem returns a 400 error if already item exists', async () => {})

test('createListItem returns listItem', async () => {})

test('updateListItem returns an updated listItem', async () => {})

test('deleteListItem deletes listItem', async () => {})
