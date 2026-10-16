const express = require('express');
const routes = require('./routes');

const app = express();
const PORT = 9000;

app.disable('x-powered-by');
app.use(express.json());
app.use(routes);

// JSON fallback untuk rute yang tidak tersedia.
app.use((req, res) => res.status(404).json({
  status: 'fail',
  message: 'Rute tidak ditemukan',
}));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Bookshelf API berjalan pada http://localhost:${PORT}`);
});
