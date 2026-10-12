const express = require('express');

const app = express();

app.use(express.json());

// Import car routes
const carsRouter = require('./routes/car');
app.use('/api/car', carsRouter);

const customersRouter = require('./routes/customers');
app.use('/api/customers', customersRouter);

const bookingsRouter = require('./routes/booking');
app.use('/api/bookings', bookingsRouter);

const fleetTypesRouter = require('./routes/fleettype');
app.use('/api/fleettypes', fleetTypesRouter);

// Home route
app.get('/', (req, res) => {
  res.send('Vehicle Rental Platform API is running!');
});

module.exports = app;