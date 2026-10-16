const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (req, res) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.body;

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
  }

  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }

  const timestamp = new Date().toISOString();
  const id = nanoid();
  const book = {
    id,
    name: name.trim(),
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: pageCount === readPage,
    reading,
    insertedAt: timestamp,
    updatedAt: timestamp,
  };

  books.push(book);

  return res.status(201).json({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: { bookId: id },
  });
};

const getAllBooks = (req, res) => {
  const { name, reading, finished } = req.query;
  let result = books;

  if (name !== undefined) {
    const keyword = name.toLocaleLowerCase();
    result = result.filter((book) => book.name.toLocaleLowerCase().includes(keyword));
  }

  if (reading === '0' || reading === '1') {
    const readingValue = reading === '1';
    result = result.filter((book) => book.reading === readingValue);
  }

  if (finished === '0' || finished === '1') {
    const finishedValue = finished === '1';
    result = result.filter((book) => book.finished === finishedValue);
  }

  const resultBooks = result.map(({ id, name: bookName, publisher }) => ({
    id,
    name: bookName,
    publisher,
  }));

  return res.status(200).json({
    status: 'success',
    data: { books: resultBooks },
  });
};

const getBookById = (req, res) => {
  const { bookId } = req.params;
  const book = books.find((item) => item.id === bookId);

  if (!book) {
    return res.status(404).json({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
  }

  return res.status(200).json({
    status: 'success',
    data: { book },
  });
};

const editBookById = (req, res) => {
  const { bookId } = req.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.body;

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
  }

  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }

  const bookIndex = books.findIndex((item) => item.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
  }

  const oldBook = books[bookIndex];
  books[bookIndex] = {
    ...oldBook,
    name: name.trim(),
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: pageCount === readPage,
    reading,
    updatedAt: new Date().toISOString(),
  };

  return res.status(200).json({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
};

const deleteBookById = (req, res) => {
  const { bookId } = req.params;
  const bookIndex = books.findIndex((item) => item.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
  }

  books.splice(bookIndex, 1);
  return res.status(200).json({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  editBookById,
  deleteBookById,
};
