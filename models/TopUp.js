const db = require('../config/db')

const allTopups = async (UserID) => {
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
            const allTopupData = await db.query(`
                SELECT t.*, u.UserName , p.PhoneName
                FROM topup t
                INNER JOIN users u ON u.UserID = t.UserID                
                INNER JOIN phone p on p.PhoneID = t.PhoneID
                WHERE t.status = 1
                ORDER BY t.created_at DESC;
            `);
            return allTopupData[0];
        } 

        // Step 3: If the user is not an admin, only select cash sales for that user
        const userTopupData = await db.query(`
             SELECT t.*, u.UserName , p.PhoneName
             FROM topup t
            INNER JOIN users u ON u.UserID = t.UserID
            INNER JOIN phone p on p.PhoneID = t.PhoneID
            WHERE t.status = 1 AND u.UserID = ?
            ORDER BY t.created_at DESC;
        `, [UserID]);

        return userTopupData[0]; 
    } catch (error) {
        console.error('Error fetching Return:', error);
        throw error; 
    }
};

const singleTopup = async (topupID) => {
    const [data] = await db.query(`
        SELECT t.* , u.UserName , p.PhoneName , p.IMEI1 , p.IMEI2 , p.PhonePrice
        FROM topup t
        INNER JOIN users u ON u.UserID = t.UserID
        INNER JOIN phone p on p.PhoneID = t.PhoneID
        WHERE t.TopUpID = ?;
    `, [topupID])

    return data[0];
}
    const newTopup = async (topupData , userID) => {
        const {
            customer,
            phone,
            CPphoneName,
            CPimei1,
            CPimei2,
            PhoneID,
            NIDA,
            closerUser,
            cost
        } = topupData;

            // Step 1: Fetch PhonePrice and Quantity from the phone table where PhoneID matches
            const phoneResult = await db.query(`
                SELECT status
                FROM phone
                WHERE PhoneID = ?
            `, [PhoneID]);

            // Step 2: Check if the phonePrice and Quantity exist
            if (phoneResult && phoneResult.length > 0) {
                const pStatus = phoneResult[0][0].status;

                // Step 3: Check if there's enough quantity for the sale
                if (pStatus < 1) {
                    return { less: true, message: 'Not enough stock available.' };
                }

                // Step 4: Proceed to insert the cashsale record
                await db.query(`
                    INSERT INTO topup
                    (
                    CustomerName, PhoneNumber, CustomerPhone, CPIMEI1, CPIMEI2, 
                    PhoneID,CustomerNIDA,TopUpCost,CloserUserPhone, UserID , status
                    )
                VALUES
                    (?,?,?,?,?,?,?,?,?,?,1);
                `,[customer,phone,CPphoneName,CPimei1,CPimei2,PhoneID,NIDA,cost,closerUser,userID])

                const status = 0;
                // Step 5: Update the quantity in the phone table (decrement by 1)
                await db.query(`
                    UPDATE phone
                    SET status = ?
                    WHERE PhoneID = ?
                `, [status,PhoneID]);

                const phoneDetails = await db.query(`
                        SELECT PhoneID
                        FROM phone
                        WHERE IMEI1 = ? OR IMEI2 = ?   
                    `, [CPimei1,CPimei2]);

                    if (phoneDetails && phoneDetails.length > 0) {
                        const phoneID = phoneDetails[0][0].PhoneID;
                        await db.query(`
                        UPDATE phone 
                        SET status = 2  
                        WHERE PhoneID = ?;
                        `,[phoneID]);
                    }
                        else{

                            await db.query(`
                            INSERT INTO phone (PhoneName,IMEI1,IMEI2,status) VALUES (?,?,?,2);
                            `,[CPphoneName,CPimei1,CPimei2]);
                        }


                //Step 6: Return success
                return { cant: true };
            } else {
                // If no phone is found with the given PhoneID
                throw new Error("PhoneID not found");
            }
    }
const updateTopup = async (topupData , userID , topupID) => {
    const {
        customer,
        phone,
        CPphoneName,
        CPimei1,
        CPimei2,
        PhoneID,
        NIDA,
        closerUser,
        cost
    } = topupData;
    
    await db.query(` 
        UPDATE phone 
        SET
            PhoneName = ?,
            IMEI1 = ?,
            IMEI2 = ?
        WHERE IMEI1 = ? OR IMEI2 = ?
    `,[CPphoneName,CPimei1,CPimei2,CPphoneName,CPimei1,CPimei2])

     result = await db.query(`
        UPDATE topup
        SET 
            CustomerName = ?, 
            PhoneNumber = ?, 
            CustomerPhone = ?, 
            CPIMEI1 = ?, 
            CPIMEI2 = ?, 
            PhoneID = ?,
            CustomerNIDA = ?, 
            TopUpCost = ?, 
            CloserUserPhone = ?
        WHERE TopUpID = ?;
     `, [customer, phone,CPphoneName,CPimei1,CPimei2,PhoneID, 
        NIDA,cost,closerUser, topupID]);
        
      
    return !!result;
}




const eraseTopup = async (topupID) => {
    const status = 0;
    try {
        await db.query(`
            UPDATE topup
            SET
            status = ?
            WHERE TopUpID = ?;
        `,[status,topupID])

        return true;
    } catch (error) {
      console.log(error)  
    }
}


module.exports = {
    newTopup , allTopups ,  singleTopup , updateTopup , eraseTopup
}