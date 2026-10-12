
const express = require('express');
const router = express.Router();

const { Booking, Customer, Car } = require('../models');

// GET all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: Customer, as: 'customer' },
        { model: Car, as: 'car' }
      ]
    });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching bookings',
      error: error.message
    });
  }
});

// GET booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: Customer, as: 'customer' },
        { model: Car, as: 'car' }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching booking',
      error: error.message
    });
  }
});

// CREATE a booking

// CREATE a booking
router.post('/', async (req, res) => {
  try {
    const { customerId, carId, startDate, endDate } = req.body;

    // Check whether the car exists
    const car = await Car.findByPk(carId);

    if (!car) {
      return res.status(404).json({
        message: 'Car not found'
      });
    }

    // Check whether the car is available
    if (!car.isAvailable) {
      return res.status(400).json({
        message: 'Car is not available for booking'
      });
    }

    // Create the booking
    const booking = await Booking.create(req.body);

    // Mark the car as unavailable
    await car.update({ isAvailable: false });

    res.status(201).json({
      message: 'Booking created successfully. Car is now unavailable.',
      booking
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating booking',
      error: error.message
    });
  }
});


// UPDATE a booking
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    await booking.update(req.body);

    res.status(200).json({
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating booking',
      error: error.message
    });
  }
});

// DELETE a booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    await booking.destroy();

    res.status(200).json({
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error deleting booking',
      error: error.message
    });
  }
});

module.exports = router;
