
const express = require('express');
const router = express.Router();

const { Customer } = require('../models');

// READ: Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching customers',
      error: error.message
    });
  }
});

// READ: Get one customer
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching customer',
      error: error.message
    });
  }
});

// CREATE: Add a customer
router.post('/', async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json({
      message: 'Customer created successfully',
      customer
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating customer',
      error: error.message
    });
  }
});

// UPDATE: Edit a customer
router.put('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await customer.update(req.body);

    res.status(200).json({
      message: 'Customer updated successfully',
      customer
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating customer',
      error: error.message
    });
  }
});

// DELETE: Remove a customer
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await customer.destroy();

    res.status(200).json({
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error deleting customer. The customer may have existing bookings.',
      error: error.message
    });
  }
});

module.exports = router;
