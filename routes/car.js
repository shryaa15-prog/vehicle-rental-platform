
const express = require('express');
const router = express.Router();

const { Car, FleetType } = require('../models');

// GET all cars with optional availability filtering
// Example: GET /api/cars?isAvailable=true
// Example: GET /api/cars?isAvailable=false
router.get('/', async (req, res) => {
  try {
    const where = {};

    if (req.query.isAvailable !== undefined) {
      if (!['true', 'false'].includes(req.query.isAvailable)) {
        return res.status(400).json({
          message: 'isAvailable must be true or false'
        });
      }

      where.isAvailable = req.query.isAvailable === 'true';
    }

    const cars = await Car.findAll({
      where,
      include: [
        {
          model: FleetType,
          as: 'fleetType'
        }
      ]
    });

    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching cars',
      error: error.message
    });
  }
});

// GET a car by ID
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id, {
      include: [
        {
          model: FleetType,
          as: 'fleetType'
        }
      ]
    });

    if (!car) {
      return res.status(404).json({
        message: 'Car not found'
      });
    }

    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching car',
      error: error.message
    });
  }
});

// CREATE a car
router.post('/', async (req, res) => {
  try {
    const car = await Car.create(req.body);

    res.status(201).json({
      message: 'Car created successfully',
      car
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating car',
      error: error.message
    });
  }
});

// UPDATE a car
router.put('/:id', async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);

    if (!car) {
      return res.status(404).json({
        message: 'Car not found'
      });
    }

    await car.update(req.body);

    res.status(200).json({
      message: 'Car updated successfully',
      car
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating car',
      error: error.message
    });
  }
});

// DELETE a car
router.delete('/:id', async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);

    if (!car) {
      return res.status(404).json({
        message: 'Car not found'
      });
    }

    await car.destroy();

    res.status(200).json({
      message: 'Car deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error deleting car. It may be linked to existing bookings.',
      error: error.message
    });
  }
});

module.exports = router;
