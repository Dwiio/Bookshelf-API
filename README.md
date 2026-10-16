# Bookshelf API — Dicoding Submission

**Nama:** Dwirizki Adithya Putra  
**Username Dicoding:** `dwi_rzkio0c8`  
**Teknologi:** Node.js, Express.js, nanoid v3, penyimpanan array in-memory  

**Ini merupakan Project Akhir Back End Pemula dengan JavaScript**
**https://www.dicoding.com/certificates/N9ZO0MR88XG5**

## 1. Persyaratan

- Node.js 18 atau lebih baru
- npm
- Postman (untuk menjalankan collection pengujian)

## 2. Instalasi dan menjalankan

Ekstrak ZIP, buka terminal pada folder proyek (`bookshelf-api-submission`), lalu jalankan:

```bash
npm install
npm start
```

Script `start` sudah ditetapkan persis sebagai `node src/server.js`. Server berjalan di `http://localhost:9000`. Biarkan terminal server tetap berjalan ketika menguji dengan Postman.

## 3. Endpoint

| Method | Endpoint | Fungsi |
|---|---|---|
| POST | `/books` | Menambahkan buku |
| GET | `/books` | Mendapatkan daftar ringkas buku |
| GET | `/books/:bookId` | Mendapatkan detail buku |
| PUT | `/books/:bookId` | Memperbarui buku |
| DELETE | `/books/:bookId` | Menghapus buku |

### Body untuk POST dan PUT

Gunakan `Body` → `raw` → `JSON` di Postman:

```json
{
  "name": "Buku A",
  "year": 2010,
  "author": "John Doe",
  "summary": "Lorem ipsum dolor sit amet",
  "publisher": "Dicoding Indonesia",
  "pageCount": 100,
  "readPage": 25,
  "reading": false
}
```

`id`, `finished`, `insertedAt`, dan `updatedAt` dibuat oleh server. `finished` bernilai `true` jika `pageCount === readPage`. Saat buku diperbarui, `updatedAt` berubah sedangkan `insertedAt` tetap.

### Filter GET `/books`

- `?name=dicoding` — pencarian nama tanpa membedakan huruf besar/kecil.
- `?reading=0` atau `?reading=1` — filter status membaca.
- `?finished=0` atau `?finished=1` — filter status selesai.
- Parameter filter dapat digabung, misalnya `/books?name=buku&reading=1&finished=0`.

Daftar buku hanya mengandung `id`, `name`, dan `publisher`, sesuai format submission. Detail buku mengembalikan semua properti.

## 4. Respons yang diharapkan

Sukses menambah buku (HTTP 201):

```json
{
  "status": "success",
  "message": "Buku berhasil ditambahkan",
  "data": { "bookId": "ID_BUKU_DARI_SERVER" }
}
```

Validasi nama kosong (HTTP 400):

```json
{
  "status": "fail",
  "message": "Gagal menambahkan buku. Mohon isi nama buku"
}
```

Buku tidak ditemukan saat detail (HTTP 404):

```json
{
  "status": "fail",
  "message": "Buku tidak ditemukan"
}
```

Pesan validasi dan operasi lain mengikuti spesifikasi submission.

## 5. Menjalankan pengujian Postman

Dua berkas Postman disertakan di folder utama:

- `Bookshelf-API-Test.postman_collection.json`
- `Bookshelf-API-Test.postman_environment.json`

1. Buka Postman, pilih **Import**, lalu impor kedua berkas JSON tersebut.
2. Pilih environment **Bookshelf API Test** dan pastikan variabel `port` bernilai `9000`.
3. Jalankan server dengan `npm start`.
4. Jalankan request collection secara berurutan dari awal. Beberapa request menggunakan ID yang disimpan otomatis oleh test sebelumnya.
5. Perhatikan bahwa pengujian collection resmi mengandalkan urutan request dan isi data yang telah dibuat oleh request sebelumnya.

## 6. Lint dan tes lokal

```bash
npm run lint
npm test
```

ESLint memakai konfigurasi flat (`eslint.config.js`). Tes Node bawaan tidak memerlukan framework pengujian eksternal.

## 7. Struktur folder

```text
bookshelf-api-submission/
├── src/
│   ├── books.js       # array in-memory
│   ├── handler.js     # logika endpoint dan validasi
│   ├── routes.js      # definisi rute
│   └── server.js      # konfigurasi Express dan port 9000
├── test/
│   └── api.test.js    # tes integrasi sederhana
├── Bookshelf-API-Test.postman_collection.json
├── Bookshelf-API-Test.postman_environment.json
├── eslint.config.js
├── package.json
└── README.md
```
