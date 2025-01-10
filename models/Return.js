const db = require('../config/db');
const { createNotification, markAsRead } = require('./Notification');

const allReturn = async (UserID) => {
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
            const allReturnData = await db.query(`
                SELECT r.*, u.UserName,
                       rp.PhoneName AS RPPhoneName,
                       tp.PhoneName AS TPPhoneName
                FROM \`return\` r
                INNER JOIN users u ON u.UserID = r.UserID
                LEFT JOIN phone rp ON rp.PhoneID = r.RPPhoneID
                LEFT JOIN phone tp ON tp.PhoneID = r.TPPhoneID
                WHERE r.status = 1
                ORDER BY r.created_at DESC;
            `);
            return allReturnData[0];
        } 

        // Step 3: If the user is not an admin, only select cash sales for that user
        const userReturnData = await db.query(`
            SELECT r.*, u.UserName,
                   rp.PhoneName AS RPPhoneName,
                   tp.PhoneName AS TPPhoneName
            FROM \`return\` r
            INNER JOIN users u ON u.UserID = r.UserID
            LEFT JOIN phone rp ON rp.PhoneID = r.RPPhoneID
            LEFT JOIN phone tp ON tp.PhoneID = r.TPPhoneID
            WHERE r.status = 1 AND u.UserID = ?
            ORDER BY r.created_at DESC;
        `, [UserID]);

        return userReturnData[0]; 
    } catch (error) {
        console.error('Error fetching Return:', error);
        throw error; 
    }
};


const singleReturn = async (cashID) => {
    const [data] = await db.query(`
        SELECT r.*, u.UserName,
               rp.PhoneName AS RPPhoneName,
               tp.PhoneName AS TPPhoneName,
               rp.IMEI1 AS RPIMEI1,
               rp.IMEI2 AS RPIMEI2,
               tp.IMEI1 AS TPIMEI1,
               tp.IMEI2 AS TPIMEI2
        FROM \`return\` r
        INNER JOIN users u ON u.UserID = r.UserID
        LEFT JOIN phone rp ON rp.PhoneID = r.RPPhoneID
        LEFT JOIN phone tp ON tp.PhoneID = r.TPPhoneID
        WHERE r.ReturnID = ?;
    `, [cashID]);

    // markAsRead(cashID)

    return data[0];
};

const newReturn = async (returnData , userID) => {
    const {
        customer,
        phone,
        RPPhoneID,
        TPPhoneID,
        comment
    } = returnData;

   const result = await db.query(`
     INSERT INTO \`return\`
        (
        CustomerName, PhoneNumber,RPPhoneID,TPPhoneID, UserID , status,comment
        )
    VALUES
        (?,?,?,?,?,1,?);
    `,[customer,phone,RPPhoneID,TPPhoneID,userID,comment])

    const [lastInserted] = await db.query('SELECT LAST_INSERT_ID() AS id');
    const lastInsertedId = lastInserted[0].id;

    // createNotification(userID,'return',lastInsertedId)

    await db.query(`UPDATE phone SET status = 1 WHERE PhoneID = ?`,[RPPhoneID])
    await db.query(`UPDATE phone SET status = 0 WHERE PhoneID = ?`,[TPPhoneID])

    return !!result;
}
const updateReturn = async (returnData , userID , returnID) => {
    const {
        customer,
        phone,
        RPPhoneID,
        TPPhoneID,
        comment
    } = returnData;

     result = await db.query(`
        UPDATE \`return\`
        SET 
            CustomerName = ?, PhoneNumber = ?,RPPhoneID = ?,TPPhoneID = ?, UserID = ?, comment = ?
        WHERE ReturnID = ?;
     `, [customer,phone,RPPhoneID,TPPhoneID,userID,comment,returnID]);
      
    return !!result;
}




const eraseReturn = async (returnID) => {
    const status = 0;
    try {
        await db.query(`
            UPDATE \`return\`
            SET
            status = ?
            WHERE ReturnID = ?;
        `,[status,returnID])

        return true;
    } catch (error) {
      console.log(error)  
    }
}

const returnCount = async () => {
    try {
        const result = await db.query(`
            SELECT COUNT(*) as returnCount FROM \`return\` WHERE status = 1;
        `);
        // console.log(result[0][0].phoneCount)

        return result[0][0].returnCount;
    } catch (error) {
        console.error('Error fetching phone count:', error);
        throw error; 
    }
}

module.exports = {
    newReturn , allReturn ,  singleReturn , updateReturn , eraseReturn,returnCount
}