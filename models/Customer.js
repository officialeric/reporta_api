const db = require('../config/db');

const transformPaymentDataForFrontend = (rows) => {
    if (!rows || rows.length === 0) {
      return null;
    }
  
    const first = rows[0]; // assuming all rows are for the same customer
  
    return {
      name: first.CustomerName,
      phone: first.NeededPhone,
      needed: first.NeededAmount,
      remained: first.RemainedCost,
      status:!first.isCompleted ? 'In Progress' : 'CLOSED', 
      details: rows.map((row, index) => ({
        id: index + 1,
        date: new Date(row.created_at).toISOString().split('T')[0],
        item: `Payment of ${row.AmountPaid} TZS`,
      }))
    };
  };
  

  const getPaymentsByPhone = async (phone) => {
    try {
      const [rows] = await db.query(`
        SELECT sp.*, p.created_at , p.AmountPaid
        FROM slowpayment sp
        INNER JOIN progress p ON sp.SlowPaymentID = p.SlowPaymentID
        WHERE sp.PhoneNumber = ?
      `, [phone]);
  
      return transformPaymentDataForFrontend(rows);
    } catch (error) {
      console.error('Error fetching payments by phone:', error);
      throw error;
    }
  };
  
    

module.exports = {
  getPaymentsByPhone,
};