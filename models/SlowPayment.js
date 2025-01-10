const db = require('../config/db');
const { createNotification, markAsRead } = require('./Notification');

const allPayments = async (UserID) => {
    try {
        // Step 1: Check if the user is an admin
        const [userData] = await db.query(`
            SELECT r.RoleName 
            FROM users u 
            INNER JOIN roles r on r.RoleID = u.RoleID
            WHERE u.UserID = ?;
            `, [UserID]);

        // Step 2: If the user is an admin, select all cash sales
        if (userData && userData[0].RoleName === 'admin') {
            const allPaymentData = await db.query(`
                SELECT s.*, u.UserName
                FROM slowpayment s
                INNER JOIN users u ON u.UserID = s.UserID
                WHERE s.status = 1;
            `);
            return allPaymentData[0];
        } 

        // Step 3: If the user is not an admin, only select cash sales for that user
        const userPaymentData = await db.query(`
            SELECT s.*, u.UserName 
                FROM slowpayment s
                INNER JOIN users u ON u.UserID = s.UserID
                WHERE s.status = 1;
        `, [UserID]);

        return userPaymentData[0]; 
    } catch (error) {
        console.error('Error fetching Return:', error);
        throw error; 
    }
};
const allPaymentItems = async (paymentID) => {
    try {
        const data = await db.query(`
           SELECT p.*, 
                s.*, 
                u.UserName,
                SUM(p.AmountPaid) OVER (PARTITION BY s.SlowPaymentID, u.UserName) AS TotalAmountPaid
            FROM progress p
            INNER JOIN slowpayment s ON s.SlowPaymentID = p.SlowPaymentID
            INNER JOIN users u ON u.UserID = p.UserID
            WHERE s.SlowPaymentID = ? AND p.status = 1;

        `, [paymentID]);

        markAsRead(paymentID)

        
        return data[0]; 
        // console.log(data[0])
    } catch (error) {
        console.error('Error fetching Return:', error);
        throw error; 
    }
};


const singlePayment = async (paymentID) => {
    const [data] = await db.query(`
        SELECT *
        FROM slowpayment 
        WHERE SlowPaymentID = ?;
    `, [paymentID])

    return data[0];
}
const newPayment = async (slowData, userID) => {
    const {
        customer,
        phone,
        PhoneID,
        amount,
        PhoneName,
        startAmount
    } = slowData;

    // Step 1: Insert the new payment record into the slowpayment table
    const result = await db.query(`
        INSERT INTO slowpayment
        (
            CustomerName, NeededPhone, PhoneNumber, UserID , NeededAmount 
        )
        VALUES
        (?, ?, ?, ?,?)`, 
        [customer, PhoneName, phone, userID,amount]
    );

    const [lastInserted] = await db.query('SELECT LAST_INSERT_ID() AS id');
    const lastInsertedId = lastInserted[0].id;

    createNotification(userID,'slowpayment',lastInsertedId)

    // Step 2: Get the PaymentID of the newly inserted payment
    const PaymentID = result[0].insertId;

    // Step 3: Fetch the PhonePrice from the phone table based on PhoneID
    const phoneResult = await db.query(`
        SELECT NeededAmount FROM slowpayment WHERE SlowPaymentID = ?`, 
        [PaymentID]
    );
    
    // Check if the phone was found
    if (phoneResult.length === 0) {
        throw new Error('Phone not found');
    }

    const PhonePrice = phoneResult[0][0].NeededAmount;
    
    // Step 4: Fetch the sum of all AmountPaid for this PaymentID from the progress table
    const totalPaidResult = await db.query(`
        SELECT SUM(AmountPaid) AS totalAmountPaid FROM progress WHERE SlowPaymentID = ? AND status = 1`,
        [PaymentID]
    );

    const totalAmountPaid = totalPaidResult[0][0].totalAmountPaid || 0;  // Default to 0 if no payments exist yet

    const remained = PhonePrice - totalAmountPaid - startAmount;  // Subtract the new payment too

    // Step 6: Insert into the progress table with the calculated remained cost
    await db.query(`
        INSERT INTO progress
        (
            SlowPaymentID, AmountPaid, UserID, created_at
        ) VALUES
        (?, ?, ?, NOW())`, 
        [PaymentID, startAmount, userID]
    );

    await db.query(`
        UPDATE slowpayment
        SET RemainedCost = ?
        WHERE SlowPaymentID = ?`,
        [remained, PaymentID]
    );

    // Return true if everything was successful
    return true;
};


const updatePayment = async (slowData , userID , paymentID) => {
    const {
        customer,
        phone,
        PhoneID,
        PhoneName,
        startAmount,
        amount
    } = slowData;

    const result = await db.query(`
        UPDATE slowpayment
        SET CustomerName = ? , NeededPhone = ? , PhoneNumber = ? , NeededAmount = ?
        WHERE SlowPaymentID = ?
        `, 
        [customer, PhoneName, phone,amount, paymentID]
    );  

    const phoneResult = await db.query(`
        SELECT NeededAmount FROM slowpayment WHERE SlowPaymentID = ?`, 
        [paymentID]
    );
    
    // Check if the phone was found
    if (phoneResult.length === 0) {
        throw new Error('Phone not found');
    }

    const PhonePrice = phoneResult[0][0].NeededAmount;
    
    // Step 4: Fetch the sum of all AmountPaid for this PaymentID from the progress table
    const totalPaidResult = await db.query(`
        SELECT SUM(AmountPaid) AS totalAmountPaid FROM progress WHERE SlowPaymentID = ? AND status = 1`,
        [paymentID]
    );

    const totalAmountPaid = totalPaidResult[0][0].totalAmountPaid || 0;  // Default to 0 if no payments exist yet

    const remained = PhonePrice - totalAmountPaid

    await db.query(`
        UPDATE slowpayment
        SET RemainedCost = ?
        WHERE SlowPaymentID = ?`,
        [remained, paymentID]
    );

    // // Return true if everything was successful
    return true;
}
const updateProgress = async (amount , progressID) => {

    const result = await db.query(`
        UPDATE progress
        SET AmountPaid = ?
        WHERE ProgressID = ?
        `, 
        [amount, progressID]
    );  

    const progressResult = await db.query(`
        SELECT SlowPaymentID FROM progress WHERE ProgressID = ?`,
        [progressID]
    );

    const paymentID = progressResult[0][0].SlowPaymentID;

    const phoneResult = await db.query(`
        SELECT NeededAmount FROM slowpayment WHERE SlowPaymentID = ?`, 
        [paymentID]
    );
    
    // Check if the phone was found
    if (phoneResult.length === 0) {
        throw new Error('Phone not found');
    }

    const PhonePrice = phoneResult[0][0].NeededAmount;
    
    // Step 4: Fetch the sum of all AmountPaid for this PaymentID from the progress table
    const totalPaidResult = await db.query(`
        SELECT SUM(AmountPaid) AS totalAmountPaid FROM progress WHERE SlowPaymentID = ? AND status = 1`,
        [paymentID]
    );

    const totalAmountPaid = totalPaidResult[0][0].totalAmountPaid || 0;  // Default to 0 if no payments exist yet

    const remained = PhonePrice - totalAmountPaid

    await db.query(`
        UPDATE slowpayment
        SET RemainedCost = ?
        WHERE SlowPaymentID = ?`,
        [remained, paymentID]
    );

    // // Return true if everything was successful
    return true;
}




const erasePayment = async (progressID) => {
    const status = 0;
    try {
        await db.query(`
            UPDATE progress
            SET
            status = ?
            WHERE ProgressID = ?;
        `,[status,progressID])

        return true;
    } catch (error) {
      console.log(error)  
    }
}
const erasePaymentRecord = async (slowpaymentID) => {
    const status = 0;
    try {
        await db.query(`
            UPDATE slowpayment
            SET
            status = ?
            WHERE SlowPaymentID = ?;
        `,[status,slowpaymentID])

        return true;
    } catch (error) {
      console.log(error)  
    }
}

const newPaymentItem = async (paymentData, userID) => {
    const {
        paymentID,
        amount
    } = paymentData;

    // Step 1: Fetch the PhonePrice based on the SlowPaymentID
    const phoneResult = await db.query(`
        SELECT NeededAmount FROM slowpayment WHERE SlowPaymentID = ?`, 
        [paymentID]
    );

    // Check if the phone was found
    if (phoneResult.length === 0) {
        throw new Error('Phone not found');
    }

    const PhonePrice = phoneResult[0][0].NeededAmount;

    // Step 2: Calculate the total AmountPaid for the current SlowPaymentID
    const totalPaidResult = await db.query(`
        SELECT SUM(AmountPaid) AS totalAmountPaid 
        FROM progress 
        WHERE SlowPaymentID = ? AND status = 1`,
        [paymentID]
    );

    const totalAmountPaid = totalPaidResult[0][0].totalAmountPaid || 0;  // Default to 0 if no payments exist yet

    // Step 3: Calculate the previous remained cost
    const previousRemainedCost = PhonePrice - totalAmountPaid;

    // Step 4: Calculate the new remaining cost after the new payment
    const netRemainingCost = previousRemainedCost - amount;

    // Step 5: Insert the new progress record
    const result = await db.query(`
        INSERT INTO progress
        (SlowPaymentID, AmountPaid, UserID)
        VALUES (?, ?, ? )`, 
        [paymentID, amount, userID]
    );

    createNotification(userID,'slowpayment', paymentID)

    await db.query(`
        UPDATE slowpayment
        SET RemainedCost = ?
        WHERE SlowPaymentID = ?`,
        [netRemainingCost, paymentID]
    );

    // Return true if insertion is successful
    return !!result;
};



module.exports = {
    newPayment , allPayments ,  singlePayment , updatePayment , erasePayment, newPaymentItem,
    allPaymentItems,erasePaymentRecord,updateProgress
}