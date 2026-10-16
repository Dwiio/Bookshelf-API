const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

const PORT = 9000;
const BASE_URL = `http://127.0.0.1:${PORT}`;
let server;

const sampleBook = (overrides = {}) => ({
  name: 'Dicoding JavaScript',
  year: 2024,
  author: 'John Doe',
  summary: 'Buku untuk belajar JavaScript',
  publisher: 'Dicoding Indonesia',
  pageCount: 100,
  readPage: 25,
  reading: true,
  ...overrides,
});

test('Bookshelf API endpoint integration', async (t) => {
  server = spawn(process.execPath, ['src/server.js'], {
    cwd: process.cwd(),
    stdio: 'ignore',
  });

  let ready = false;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`${BASE_URL}/books`);
      if (response.status === 200) {
        ready = true;
        break;
      }
    } catch (_error) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  assert.equal(ready, true, 'server should start on port 9000');

  t.after(() => {
    if (server && server.exitCode === null) server.kill();
  });

  const createResponse = await fetch(`${BASE_URL}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sampleBook()),
  });
  assert.equal(createResponse.status, 201);
  const created = await createResponse.json();
  assert.equal(created.status, 'success');
  const bookId = created.data.bookId;
  assert.ok(bookId);

  const detailResponse = await fetch(`${BASE_URL}/books/${bookId}`);
  assert.equal(detailResponse.status, 200);
  const detail = await detailResponse.json();
  assert.equal(detail.data.book.finished, false);
  assert.ok(detail.data.book.insertedAt);
  assert.ok(detail.data.book.updatedAt);

  const invalidResponse = await fetch(`${BASE_URL}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sampleBook({ name: '   ' })),
  });
  assert.equal(invalidResponse.status, 400);

  const listResponse = await fetch(`${BASE_URL}/books?name=DICODING&reading=1`);
  assert.equal(listResponse.status, 200);
  const list = await listResponse.json();
  assert.ok(list.data.books.some((book) => book.id === bookId));
  assert.deepEqual(Object.keys(list.data.books[0]).sort(), ['id', 'name', 'publisher']);

  const updateResponse = await fetch(`${BASE_URL}/books/${bookId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sampleBook({ name: 'Dicoding Updated', pageCount: 100, readPage: 100 })),
  });
  assert.equal(updateResponse.status, 200);

  const updatedDetail = await (await fetch(`${BASE_URL}/books/${bookId}`)).json();
  assert.equal(updatedDetail.data.book.finished, true);

  const deleteResponse = await fetch(`${BASE_URL}/books/${bookId}`, { method: 'DELETE' });
  assert.equal(deleteResponse.status, 200);
  const missingResponse = await fetch(`${BASE_URL}/books/${bookId}`);
  assert.equal(missingResponse.status, 404);
});
