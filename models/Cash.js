const db = require('../config/db');
const { createNotification, markAsRead } = require('./Notification');

function generateUniqueSixDigitNumberBasedOnDate() {
    const now = new Date();
    
    const day = now.getDate(); // Day of the month (1-31)
    const month = now.getMonth() + 1; // Month (0-11), so we add 1
    const second = now.getSeconds(); // Seconds (0-59)
    
    const uniqueNumber = `${String(day).padStart(2, '0')}${String(month).padStart(2, '0')}${String(second).padStart(2, '0')}`;
  
    return uniqueNumber;
  }

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
        const code = generateUniqueSixDigitNumberBasedOnDate();

        await db.query(`
            INSERT INTO cashsale
                (CustomerName, CustomerPhoneNumber, PhoneID, SellingPrice, UserID, status , code)
            VALUES
                (?, ?, ?, ?, ?, 1 , ?);
        `, [customer, phone, PhoneID, phoneCost, userID,code]);

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
        const code = generateUniqueSixDigitNumberBasedOnDate();

        await db.query(`
            INSERT INTO smallcashsale
                (CustomerName, CustomerPhoneNumber, SmallPhoneID, SellingPrice, UserID, status ,created_at,code)
            VALUES
                (?, ?, ?, ?, ?, 1, NOW(),?);
        `, [customer, phone, PhoneID, phoneCost, userID,code]);

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

const allCash = async (UserID, date = null) => {
    try {
        // Step 1: Check if the user is an admin
        const [userData] = await db.query(`
            SELECT r.RoleName
            FROM users u 
            INNER JOIN roles r on r.RoleID = u.RoleID
            WHERE u.UserID = ?;
        `, [UserID]);

        let query, params;
        if (userData && userData[0].RoleName === 'admin') {
            // Admin: fetch all cash sales, optionally filter by date
            query = `
                SELECT c.*, u.UserName , p.PhoneName
                FROM cashsale c
                INNER JOIN users u ON u.UserID = c.UserID
                INNER JOIN phone p on p.PhoneID = c.PhoneID
                WHERE c.status = 1
                ${date ? 'AND DATE(c.created_at) = ?' : ''}
                ORDER BY c.CSID DESC;
            `;
            params = date ? [date] : [];
        } else {
            // Non-admin: fetch only user's cash sales, optionally filter by date
            query = `
                SELECT c.*, u.UserName , p.PhoneName
                FROM cashsale c
                INNER JOIN users u ON u.UserID = c.UserID
                INNER JOIN phone p on p.PhoneID = c.PhoneID
                WHERE c.status = 1 AND u.UserID = ?
                ${date ? 'AND DATE(c.created_at) = ?' : ''}
                ORDER BY c.CSID DESC;
            `;
            params = date ? [UserID, date] : [UserID];
        }

        const result = await db.query(query, params);
        return result[0];
    } catch (error) {
        console.error('Error fetching cash sales:', error);
        throw error; 
    }
};

const allCashByDate = async (UserID, date) => {
    return allCash(UserID, date);
};

const allSmallCash = async (UserID, date = null) => {
    try {
        //Check if the user is an admin
        const [userData] = await db.query(`
            SELECT r.RoleName
            FROM users u 
            INNER JOIN roles r on r.RoleID = u.RoleID
            WHERE u.UserID = ?;
        `, [UserID]);

        let query, params;
        if (userData && userData[0].RoleName === 'admin') {
            query = `
                SELECT c.*, u.UserName , p.PhoneName
                FROM smallcashsale c
                INNER JOIN users u ON u.UserID = c.UserID
                INNER JOIN smallphone p on p.SmallPhoneID = c.SmallPhoneID
                WHERE c.status = 1
                ${date ? 'AND DATE(c.created_at) = ?' : ''}
                ORDER BY c.SCSID DESC;
            `;
            params = date ? [date] : [];
        } else {
            query = `
                SELECT c.*, u.UserName , p.PhoneName
                FROM smallcashsale c
                INNER JOIN users u ON u.UserID = c.UserID
                INNER JOIN smallphone p on p.SmallPhoneID = c.SmallPhoneID
                WHERE c.status = 1 AND u.UserID = ?
                ${date ? 'AND DATE(c.created_at) = ?' : ''}
                ORDER BY c.SCSID DESC;
            `;
            params = date ? [UserID, date] : [UserID];
        }

        const result = await db.query(query, params);
        return result[0];

    } catch (error) {
        console.error('Error fetching small cash sales:', error);
        throw error; 
    }
};


const allSmallCashByDate = async (UserID, date) => {
    return allSmallCash(UserID, date);
};


const singleCash = async (cashID) => {
    const [data] = await db.query(`
        SELECT c.CustomerName,c.code ,c.CustomerPhoneNumber,c.SellingPrice , c.created_at as muda , u.UserName , p.*
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
        SELECT c.CustomerName,c.code ,c.CustomerPhoneNumber,c.SellingPrice , c.created_at as muda , u.UserName , p.*
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
                SELECT COUNT(*) as saleCount FROM cashsale WHERE status = 1 AND DATE(created_at) = CURDATE();
            `);
            return result[0][0].saleCount;
        } 


        // Step 3: If the user is not an admin, only select cash count for that user
        const result = await db.query(`
            SELECT COUNT(*) as saleCount FROM cashsale WHERE UserID = ? AND status = 1  AND DATE(created_at) = CURDATE();;
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
                SELECT COUNT(*) as SmallSaleCount FROM smallcashsale WHERE status = 1 AND DATE(created_at) = CURDATE();
            `);
            return result[0][0].SmallSaleCount;
        } 


        // Step 3: If the user is not an admin, only select cash count for that user
        const result = await db.query(`
            SELECT COUNT(*) as SmallSaleCount FROM smallcashsale WHERE UserID = ? AND status = 1 AND DATE(created_at) = CURDATE();
        `,[userID]);

        return result[0][0].SmallSaleCount;

       
    } catch (error) {
        console.error('Error fetching cash sales:', error);
        throw error; 
    }
}

module.exports = {
    newCash , allCash ,  singleCash , updateCash , eraseCash,saleCount,allSmallCashByDate,
    newSmallCash,allSmallCash,singleSmallCash,updateSmallCash,eraseSmallCash,SmallSaleCount,allCashByDate
}