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
  const next = buildNext()

  await listItemsController.setListItem(req, res)

  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.status).toHaveBeenCalledWith(404)
  expect(next).not.toHaveBeenCalled()
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "No list item was found with the id of undefined",
      },
    ]
  `)
  expect(res.json).toHaveBeenCalledTimes(1)
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

test('setListItem returns adds listItem to req', async () => {
  const user = buildUser()
  const listItem = buildListItem({ownerId: user.id})
  const req = buildReq({listItem, params: {id: listItem.id}, user})
  const res = buildRes()
  const next = buildNext()

  listItemsDB.readById.mockResolvedValueOnce(listItem)

  await listItemsController.setListItem(req, res, next)

  expect(listItemsDB.readById).toHaveBeenCalledTimes(1)
  expect(listItemsDB.readById).toHaveBeenCalledWith(listItem.id)
  expect(req.listItem).toEqual(listItem)
  expect(next).toHaveBeenCalledWith(/* nothing */)
  expect(next).toHaveBeenCalledTimes(1)
})

test('getListItems returns req.listItems', async () => {
  const user = buildUser()
  const book = buildBook()
  const books = [book]
  const listItems = [buildListItem({book})]
  const req = buildReq({user})
  const res = buildRes()

  listItemsDB.query.mockResolvedValueOnce(listItems)
  booksDB.readManyById.mockResolvedValueOnce(books)

  await listItemsController.getListItems(req, res)

  expect(listItemsDB.query).toHaveBeenCalledTimes(1)
  expect(listItemsDB.query).toHaveBeenCalledWith({ownerId: user.id})
  expect(booksDB.readManyById).toHaveBeenCalledTimes(1)
  expect(booksDB.readManyById).toHaveBeenCalledWith([book.id])
  expect(res.json).toHaveBeenCalledWith({listItems})
})

test('createListItem returns a 400 error if already item exists', async () => {
  const req = buildReq()
  const res = buildRes()

  await listItemsController.createListItem(req, res)

  expect(res.status).toHaveBeenCalledWith(400)
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "No bookId provided",
      },
    ]
  `)
})

test('createListItem returns a 400 error if no bookId provided', async () => {
  const user = buildUser()
  const book = buildBook({ownerId: user.id})
  const listItems = [buildListItem({bookId: book.id})]
  const req = buildReq({body: {bookId: book.id}, user})
  const res = buildRes()

  listItemsDB.query.mockResolvedValueOnce(listItems)

  await listItemsController.createListItem(req, res)

  expect(listItemsDB.query).toHaveBeenCalledTimes(1)
  expect(listItemsDB.query).toHaveBeenCalledWith({
    ownerId: user.id,
    bookId: book.id,
  })
  expect(res.status).toHaveBeenCalledWith(400)
  expect(res.json.mock.calls[0][0].message).not.toBe('No bookId provided')
})

test('createListItem returns listItem', async () => {
  const user = buildUser()
  const book = buildBook({ownerId: user.id})
  const listItem = buildListItem({bookId: book.id})
  const req = buildReq({body: {bookId: book.id}, user})
  const res = buildRes()

  listItemsDB.query.mockResolvedValueOnce([])
  listItemsDB.create.mockResolvedValueOnce(listItem)

  await listItemsController.createListItem(req, res)

  expect(listItemsDB.query).toHaveBeenCalledTimes(1)
  expect(listItemsDB.query).toHaveBeenCalledWith({
    ownerId: user.id,
    bookId: book.id,
  })
  expect(listItemsDB.create).toHaveBeenCalledTimes(1)
  expect(listItemsDB.create).toHaveBeenCalledWith({
    ownerId: user.id,
    bookId: book.id,
  })
  expect(res.json).toHaveBeenCalledWith({listItem})
})

test('updateListItem returns an updated listItem', async () => {
  const book = buildBook()
  const listItem = buildListItem({bookId: book.id})
  const req = buildReq({listItem})
  const res = buildRes()

  listItemsDB.update.mockResolvedValueOnce(listItem)

  await listItemsController.updateListItem(req, res)

  expect(listItemsDB.update).toHaveBeenCalledTimes(1)
  expect(listItemsDB.update).toHaveBeenCalledWith(listItem.id, req.body)
  expect(res.json).toHaveBeenCalledWith({listItem})
})

test('deleteListItem deletes listItem', async () => {
  const listItem = buildListItem()
  const req = buildReq({listItem})
  const res = buildRes()

  await listItemsController.deleteListItem(req, res)

  expect(res.json).toHaveBeenCalledWith({success: true})
})
