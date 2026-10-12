const {
  sequelize,
  FleetType,
  Car,
  Customer,
  Booking
} = require('./models');

async function testAssociations() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully!');

    const [fleetType] = await FleetType.findOrCreate({
      where: { name: 'SUV' },
      defaults: {
        name: 'SUV',
        description: 'Sports Utility Vehicle'
      }
    });

    const [car] = await Car.findOrCreate({
      where: { registrationNumber: 'GA01TEST01' },
      defaults: {
        brand: 'Toyota',
        model: 'Fortuner',
        registrationNumber: 'GA01TEST01',
        pricePerDay: 3000,
        isAvailable: true,
        fleetTypeId: fleetType.id
      }
    });

    const [customer] = await Customer.findOrCreate({
      where: { email: 'testcustomer@example.com' },
      defaults: {
        name: 'Test Customer',
        email: 'testcustomer@example.com',
        phone: '9876543210',
        licenseNumber: 'TEST12345'
      }
    });

    const booking = await Booking.create({
      customerId: customer.id,
      carId: car.id,
      startDate: '2026-10-15',
      endDate: '2026-10-17',
      totalAmount: 6000,
      status: 'completed'
    });

    console.log('Fleet type created:', fleetType.name);
    console.log('Car created:', car.brand, car.model);
    console.log('Customer created:', customer.name);
    console.log('Booking created:', booking.id);

    const result = await Booking.findByPk(booking.id, {
      include: [
        { model: Customer, as: 'customer' },
        { model: Car, as: 'car' }
      ]
    });

    console.log('Booking with associated details:');
    console.log(JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await sequelize.close();
  }
}

testAssociations();