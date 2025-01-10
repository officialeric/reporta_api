const db = require('../config/db');
const { createNotification, markAsRead } = require('./Notification');

const newCash = async (cashData, userID) => {
    const {
        customer,
        phone,
        PhoneID,
        phoneCost,
        paymentID
    } = cashData;

    // Step 1: Fetch PhonePrice and Quantity from the phone table where PhoneID matches
    const phoneResult = await db.query(`
        SELECT PhonePrice, status   
        FROM phone
        WHERE PhoneID = ?
    `, [PhoneID]);

    // Step 2: Check if the phonePrice and Quantity exist
    if (phoneResult && phoneResult.length > 0) {
        const phonePrice = phoneResult[0][0].PhonePrice;
        const pStatus = phoneResult[0][0].status;

        // If phoneCost is less than phonePrice, return an error
        if (phoneCost < phonePrice) {
            return { cant: true };
        }

        // Step 3: Check if there's enough quantity for the sale
        if (pStatus < 1) {
            return { less: true, message: 'Not enough stock available.' };
        }

        // Step 4: Proceed to insert the cashsale record
        await db.query(`
            INSERT INTO cashsale
                (CustomerName, CustomerPhoneNumber, PhoneID, SellingPrice, UserID, status)
            VALUES
                (?, ?, ?, ?, ?, 1);
        `, [customer, phone, PhoneID, phoneCost, userID]);

        const [lastInserted] = await db.query('SELECT LAST_INSERT_ID() AS id');
        const lastInsertedId = lastInserted[0].id;

        // createNotification(userID,'cashsale',lastInsertedId);

        const status = 0;
        const isCompleted = 1;

        // Step 5: Update the quantity in the phone table (decrement by 1)
        await db.query(`
            UPDATE phone
            SET status = ?
            WHERE PhoneID = ?
        `, [status,PhoneID]);

        if(paymentID){
            await db.query(`
                UPDATE slowpayment
                SET isCompleted = ?
                WHERE SlowPaymentID = ?
            `,[isCompleted,paymentID])
        }

        // Step 6: Return success
        return { cant: false };
    } else {
        // If no phone is found with the given PhoneID
        throw new Error("PhoneID not found");
    }
};
const newSmallCash = async (cashData, userID) => {
    const {
        customer,
        phone,
        PhoneID,
        phoneCost,
        paymentID
    } = cashData;

    // Step 1: Fetch PhonePrice and Quantity from the phone table where PhoneID matches
    const phoneResult = await db.query(`
        SELECT PhonePrice, status   
        FROM smallphone
        WHERE SmallPhoneID = ?
    `, [PhoneID]);

    // Step 2: Check if the phonePrice and Quantity exist
    if (phoneResult && phoneResult.length > 0) {
        const phonePrice = phoneResult[0][0].PhonePrice;
        const pStatus = phoneResult[0][0].status;

        // If phoneCost is less than phonePrice, return an error
        if (phoneCost < phonePrice) {
            return { cant: true };
        }

        // Step 3: Check if there's enough quantity for the sale
        if (pStatus < 1) {
            return { less: true, message: 'Not enough stock available.' };
        }

        // Step 4: Proceed to insert the cashsale record
        await db.query(`
            INSERT INTO smallcashsale
                (CustomerName, CustomerPhoneNumber, SmallPhoneID, SellingPrice, UserID, status ,created_at)
            VALUES
                (?, ?, ?, ?, ?, 1, NOW());
        `, [customer, phone, PhoneID, phoneCost, userID]);

        // Step 5: Update the quantity in the phone table (decrement by 1)
        await db.query(`
            UPDATE smallphone
            SET Quantity = Quantity - 1
            WHERE SmallPhoneID = ?
        `, [PhoneID]);

        const isCompleted = 1;

        if(paymentID){
        await db.query(`
            UPDATE slowpayment
            SET isCompleted = ?
            WHERE SlowPaymentID = ?
        `,[isCompleted,paymentID])
        }

        // Step 6: Return success
        return { cant: false };
    } else {
        // If no phone is found with the given PhoneID
        throw new Error("PhoneID not found");
    }
};


const updateCash = async (cashData , userID , cashID) => {
    const {
        customer,
        phone,
        PhoneID,
        phoneCost
    } = cashData;

    // Step 1: Fetch PhonePrice from the phone table where PhoneID matches
    const phoneResult = await db.query(`
        SELECT PhonePrice
        FROM phone
        WHERE PhoneID = ?
    `, [PhoneID]);

    // Step 2: Check if the phonePrice exists and compare it with phoneCost
    if (phoneResult) {
        const phonePrice = phoneResult[0][0].PhonePrice;

        // If phoneCost is less than phonePrice, return an error
        if (phoneCost < phonePrice) {
            return { cant : true }
        }

        // Step 3: If the validation passes, proceed to insert the cashsale record
        result = await db.query(`
            UPDATE cashsale
            SET 
                CustomerName = ?, 
                CustomerPhoneNumber = ?,
                PhoneID = ?, 
                SellingPrice = ?, 
                UserID = ?
            WHERE CSID = ?;
         `, [customer, phone, PhoneID, phoneCost, userID, cashID]);
          
        return { cant : false};
    } else {
        // If no phone is found with the given PhoneID
        throw new Error("PhoneID not found");
    }

     
}
const updateSmallCash = async (cashData , userID , cashID) => {
    const {
        customer,
        phone,
        PhoneID,
        phoneCost
    } = cashData;

    // Step 1: Fetch PhonePrice from the phone table where PhoneID matches
    const phoneResult = await db.query(`
        SELECT PhonePrice
        FROM smallphone
        WHERE SmallPhoneID = ?
    `, [PhoneID]);

    // Step 2: Check if the phonePrice exists and compare it with phoneCost
    if (phoneResult) {
        const phonePrice = phoneResult[0][0].PhonePrice;

        // If phoneCost is less than phonePrice, return an error
        if (phoneCost < phonePrice) {
            return { cant : true }
        }

        // Step 3: If the validation passes, proceed to insert the cashsale record
        result = await db.query(`
            UPDATE smallcashsale
            SET 
                CustomerName = ?, 
                CustomerPhoneNumber = ?,
                SmallPhoneID = ?, 
                SellingPrice = ?, 
                UserID = ?
            WHERE SCSID = ?;
         `, [customer, phone, PhoneID, phoneCost, userID, cashID]);
          
        return { cant : false};
    } else {
        // If no phone is found with the given PhoneID
        throw new Error("PhoneID not found");
    }

     
}

const allCash = async (UserID) => {
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
            const allCashData = await db.query(`
                SELECT c.*, u.UserName , p.PhoneName
                FROM cashsale c
                INNER JOIN users u ON u.UserID = c.UserID
                INNER JOIN phone p on p.PhoneID = c.PhoneID
                WHERE c.status = 1
                ORDER BY c.CSID DESC;
            `);
            return allCashData[0];
        } 

        // Step 3: If the user is not an admin, only select cash sales for that user
        const userCashData = await db.query(`
            SELECT c.*, u.UserName , p.PhoneName
            FROM cashsale c
            INNER JOIN users u ON u.UserID = c.UserID
            INNER JOIN phone p on p.PhoneID = c.PhoneID
            WHERE c.status = 1 AND u.UserID = ?
            ORDER BY c.CSID DESC;
        `, [UserID]);

        return userCashData[0]; 
    } catch (error) {
        console.error('Error fetching cash sales:', error);
        throw error; 
    }
};
const allSmallCash = async (UserID) => {
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
            const allCashData = await db.query(`
                SELECT c.*, u.UserName , p.PhoneName
                FROM smallcashsale c
                INNER JOIN users u ON u.UserID = c.UserID
                INNER JOIN smallphone p on p.SmallPhoneID = c.SmallPhoneID
                WHERE c.status = 1
                ORDER BY c.SCSID DESC;
            `);
            return allCashData[0];
        } 

        // Step 3: If the user is not an admin, only select cash sales for that user
        const userCashData = await db.query(`
            SELECT c.*, u.UserName , p.PhoneName
            FROM smallcashsale c
            INNER JOIN users u ON u.UserID = c.UserID
            INNER JOIN smallphone p on p.SmallPhoneID = c.SmallPhoneID
            WHERE c.status = 1 AND u.UserID = ?
            ORDER BY c.SCSID DESC;
        `, [UserID]);

        return userCashData[0]; 
    } catch (error) {
        console.error('Error fetching cash sales:', error);
        throw error; 
    }
};


const singleCash = async (cashID) => {
    const [data] = await db.query(`
        SELECT c.CustomerName, c.CustomerPhoneNumber,c.SellingPrice , c.created_at as muda , u.UserName , p.*
        FROM cashsale c
        INNER JOIN users u ON u.UserID = c.UserID
        INNER JOIN phone p on p.PhoneID = c.PhoneID
        WHERE c.CSID = ?;
    `, [cashID])

    // markAsRead(cashID)

    return data[0];
}
const singleSmallCash = async (cashID) => {
    const [data] = await db.query(`
        SELECT c.CustomerName, c.CustomerPhoneNumber,c.SellingPrice , c.created_at as muda , u.UserName , p.*
        FROM smallcashsale c
        INNER JOIN users u ON u.UserID = c.UserID
        INNER JOIN smallphone p on p.SmallPhoneID = c.SmallPhoneID
        WHERE c.SCSID = ?;
    `, [cashID])

    return data[0];
}

const eraseCash = async (cashID) => {
    const status = 0;
    try {
        await db.query(`
            UPDATE cashsale
            SET
            status = ?
            WHERE CSID = ?;
        `,[status,cashID])

        return true;
    } catch (error) {
      console.log(error)  
    }
}
const eraseSmallCash = async (cashID) => {
    const status = 0;
    try {
        await db.query(`
            UPDATE smallcashsale
            SET
            status = ?
            WHERE SCSID = ?;
        `,[status,cashID])

        return true;
    } catch (error) {
      console.log(error)  
    }
}

const saleCount = async (userID) => {
    try {
        // Step 1: Check if the user is an admin
        const [userData] = await db.query(`
            SELECT r.RoleName
            FROM users u 
            INNER JOIN roles r on r.RoleID = u.RoleID
            WHERE u.UserID = ?;
        `, [userID]);

        // Step 2: If the user is an admin, select all cash count   
        if (userData && userData[0].RoleName === 'admin') {
            const result = await db.query(`
                SELECT COUNT(*) as saleCount FROM cashsale WHERE status = 1;
            `);
            return result[0][0].saleCount;
        } 


        // Step 3: If the user is not an admin, only select cash count for that user
        const result = await db.query(`
            SELECT COUNT(*) as saleCount FROM cashsale WHERE UserID = ? AND status = 1;
        `,[userID]);

        return result[0][0].saleCount;

       
    } catch (error) {
        console.error('Error fetching cash sales:', error);
        throw error; 
    }
}
const SmallSaleCount = async (userID) => {
    try {
        // Step 1: Check if the user is an admin
        const [userData] = await db.query(`
            SELECT r.RoleName
            FROM users u 
            INNER JOIN roles r on r.RoleID = u.RoleID
            WHERE u.UserID = ?;
        `, [userID]);

        // Step 2: If the user is an admin, select all cash count   
        if (userData && userData[0].RoleName === 'admin') {
            const result = await db.query(`
                SELECT COUNT(*) as SmallSaleCount FROM smallcashsale WHERE status = 1;
            `);
            return result[0][0].SmallSaleCount;
        } 


        // Step 3: If the user is not an admin, only select cash count for that user
        const result = await db.query(`
            SELECT COUNT(*) as SmallSaleCount FROM smallcashsale WHERE UserID = ? AND status = 1;
        `,[userID]);

        return result[0][0].SmallSaleCount;

       
    } catch (error) {
        console.error('Error fetching cash sales:', error);
        throw error; 
    }
}

module.exports = {
    newCash , allCash ,  singleCash , updateCash , eraseCash,saleCount,
    newSmallCash,allSmallCash,singleSmallCash,updateSmallCash,eraseSmallCash,SmallSaleCount
}