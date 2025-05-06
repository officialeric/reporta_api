const Customer = require('../models/Customer');

const getPaymentsByPhone = async (req, res) => {
    const phone = req.params.phone;
    try {
        const payments = await Customer.getPaymentsByPhone(phone);
       
        console.log(payments);
        res.status(200).json({
            message: 'Payments retrieved successfully',
            data: payments,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
  getPaymentsByPhone,
};