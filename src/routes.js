const express = require('express');
const handler = require('./handler');

const router = express.Router();

router.post('/books', handler.addBook);
router.get('/books', handler.getAllBooks);
router.get('/books/:bookId', handler.getBookById);
router.put('/books/:bookId', handler.editBookById);
router.delete('/books/:bookId', handler.deleteBookById);

module.exports = router;
