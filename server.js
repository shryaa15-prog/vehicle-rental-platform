
const app = require('./app');
const db = require('./models');

const PORT = 3000;

db.sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully!');

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message);
  });
