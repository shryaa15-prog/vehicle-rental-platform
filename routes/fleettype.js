
const express = require('express');
const router = express.Router();

const { FleetType, Car } = require('../models');

// GET all fleet types
router.get('/', async (req, res) => {
  try {
    const fleetTypes = await FleetType.findAll({
      include: [{ model: Car, as: 'cars' }]
    });

    res.status(200).json(fleetTypes);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching fleet types',
      error: error.message
    });
  }
});

// GET fleet type by ID
router.get('/:id', async (req, res) => {
  try {
    const fleetType = await FleetType.findByPk(req.params.id, {
      include: [{ model: Car, as: 'cars' }]
    });

    if (!fleetType) {
      return res.status(404).json({
        message: 'Fleet type not found'
      });
    }

    res.status(200).json(fleetType);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching fleet type',
      error: error.message
    });
  }
});

// CREATE fleet type
router.post('/', async (req, res) => {
  try {
    const fleetType = await FleetType.create(req.body);

    res.status(201).json({
      message: 'Fleet type created successfully',
      fleetType
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating fleet type',
      error: error.message
    });
  }
});

// UPDATE fleet type
router.put('/:id', async (req, res) => {
  try {
    const fleetType = await FleetType.findByPk(req.params.id);

    if (!fleetType) {
      return res.status(404).json({
        message: 'Fleet type not found'
      });
    }

    await fleetType.update(req.body);

    res.status(200).json({
      message: 'Fleet type updated successfully',
      fleetType
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating fleet type',
      error: error.message
    });
  }
});

// DELETE fleet type
router.delete('/:id', async (req, res) => {
  try {
    const fleetType = await FleetType.findByPk(req.params.id);

    if (!fleetType) {
      return res.status(404).json({
        message: 'Fleet type not found'
      });
    }

    await fleetType.destroy();

    res.status(200).json({
      message: 'Fleet type deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error deleting fleet type. It may be linked to cars.',
      error: error.message
    });
  }
});

module.exports = router;
