const db = require('../config/db')

const newPhone = async (phoneData) => {
    const {
        phoneName,
        imei1,
        imei2,
        phoneCost,
        GroupID
    } = phoneData;

    // Check if a phone with the given IMEI1 and IMEI2 exists
    const checkPhone = await db.query(`
        SELECT PhoneID FROM phone WHERE IMEI1 = ? OR IMEI2 = ?`, 
        [imei1, imei2]
    );

    if (checkPhone[0].length > 0) {
        const phoneID = checkPhone[0][0].PhoneID;
        
        // Update status to 1
        const updateResult = await db.query(`
            UPDATE phone 
            SET status = 1,
            PhonePrice = ?,
            GroupID = ? 
            WHERE PhoneID = ?`, 
            [phoneCost,GroupID,phoneID]
        );
        
        return true; 
    }else{
        
        
   const result = await db.query(`
     INSERT INTO phone
        (
        PhoneName, IMEI1, IMEI2, PhonePrice,GroupID, status , created_at
        )
    VALUES
        (?,?,?,?,?,1, NOW());
    `,[phoneName,imei1,imei2,phoneCost,GroupID])

    return !!result;
    }

}
const newSmallPhone = async (phoneData) => {
    const {
        phoneName,
        phoneCost,
        quantity
    } = phoneData;

    // // Check if a phone with the given IMEI1 and IMEI2 exists
    // const checkPhone = await db.query(`
    //     SELECT * FROM smallphone WHERE PhoneName = ?`, 
    //     [phoneName]
    // );

    // if (checkPhone[0].length > 0) {
    //     const phoneID = checkPhone[0][0].PhoneID;
        
    //     // Update status to 1
    //     const updateResult = await db.query(`
    //         UPDATE phone 
    //         SET status = 1,
    //         PhonePrice = ?,
    //         GroupID = ? 
    //         WHERE PhoneID = ?`, 
    //         [phoneCost,GroupID,phoneID]
    //     );
        
    //     return !!updateResult; 
    // }

   const result = await db.query(`
     INSERT INTO smallphone
        (
        PhoneName, PhonePrice,Quantity, status , created_at
        )
        VALUES
            (?,?,?,1, NOW());
        `,[phoneName,phoneCost,quantity])

        return !!result;
    }
const updatePhone = async (phoneData  , phoneID) => {
    const {
        phoneName,
        imei1,
        imei2,
        phoneCost,
        GroupID
    } = phoneData;

     result = await db.query(`
        UPDATE phone
        SET 
            PhoneName = ?, 
            IMEI1 = ?, 
            IMEI2 = ?, 
            PhonePrice = ?, 
            GroupID = ?
        WHERE PhoneID = ?;
     `, [phoneName, imei1, imei2, phoneCost, GroupID, phoneID]);
      
    return !!result;
}
const updateSmallPhone = async (phoneData  , phoneID) => {
    const {
        phoneName,
        phoneCost,
        quantity
    } = phoneData;

     result = await db.query(`
        UPDATE smallphone
        SET 
            PhoneName = ?, 
            PhonePrice = ?, 
            Quantity = ?
        WHERE SmallPhoneID = ?;
     `, [phoneName,phoneCost, quantity, phoneID]);
      
    return !!result;
}
const updateGroup = async (GroupData  , GroupID) => {
    const {
        gName
    } = GroupData;

     result = await db.query(`
        UPDATE \`groups\`
        SET 
            GroupName = ?
        WHERE GroupID = ?;
     `, [gName, GroupID]);
      
    return !!result;
}

const allPhone = async () => {
    try {
       
            const allPhoneData = await db.query(`
                SELECT *
                FROM phone
                WHERE status = 1;
            `);
            return allPhoneData[0];
         
    } catch (error) {
        console.error('Error fetching phone sales:', error);
        throw error; 
    }
};

const allSmallPhone = async () => {
    try {
       
            const allPhoneData = await db.query(`
                SELECT *
                FROM smallphone
                WHERE status = 1
                ORDER BY created_at DESC;
            `);
            return allPhoneData[0];
         
    } catch (error) {
        console.error('Error fetching phone sales:', error);
        throw error; 
    }
};
const allCPhone = async () => {
    try {
       
            const allPhoneData = await db.query(`
                SELECT *
                FROM phone
                WHERE status = 2
                ORDER BY created_at DESC;
            `);
            return allPhoneData[0];
         
    } catch (error) {
        console.error('Error fetching phone sales:', error);
        throw error; 
    }
};
const soldPhones = async () => {
    try {
       
            const allPhoneData = await db.query(`
                SELECT *
                FROM phone
                WHERE status = 0;
            `);
            return allPhoneData[0];
         
    } catch (error) {
        console.error('Error fetching phone sales:', error);
        throw error; 
    }
};
const allPhones = async (GroupID) => {
    try {
       
            const allPhoneData = await db.query(`
                SELECT *
                FROM phone
                WHERE status = 1 AND GroupID = ?;
            `,[GroupID]);
            // console.log(allPhoneData[0])
            return allPhoneData[0];
         
    } catch (error) {
        console.error('Error fetching phone sales:', error);
        throw error; 
    }
};
const allGroup = async () => {
    try {
       
            const allPhoneData = await db.query(`
                SELECT g.GroupID, g.GroupName, COUNT(p.GroupID) AS Quantity
                FROM \`groups\` g
                LEFT JOIN phone p ON g.GroupID = p.GroupID
                WHERE p.status = 1
                GROUP BY g.GroupID, g.GroupName
            `);
            return allPhoneData[0];
         
    } catch (error) {
        console.error('Error fetching phone sales:', error);
        throw error; 
    }
};
const groups = async () => {
    try {
       
            const allPhoneData = await db.query(`
                SELECT *
                FROM \`groups\`
            `);
            return allPhoneData[0];
         
    } catch (error) {
        console.error('Error fetching phone sales:', error);
        throw error; 
    }
};


const singlePhone = async (phoneID) => {
    const [data] = await db.query(`
        SELECT * 
        FROM phone
        WHERE PhoneID = ?;
    `, [phoneID])

    return data[0];
}
const singleSmallPhone = async (phoneID) => {
    const [data] = await db.query(`
        SELECT * 
        FROM smallphone
        WHERE SmallPhoneID = ?;
    `, [phoneID])

    return data[0];
}

const erasePhone = async (phoneID) => {
    try {
        await db.query(`
            DELETE FROM phone
            WHERE PhoneID = ?;
        `,[phoneID])

        return true;
    } catch (error) {
      console.log(error)  
    }
}
const eraseSmallPhone = async (phoneID) => {
    try {
        await db.query(`
            DELETE FROM smallphone
            WHERE SmallPhoneID = ?;
        `,[phoneID])

        return true;
    } catch (error) {
      console.log(error)  
    }
}
const singleGroup = async (GroupID) => {
    const [data] = await db.query(`
        SELECT * 
        FROM \`groups\`
        WHERE GroupID = ?;
    `, [GroupID])

    return data[0];
}

const eraseGroup = async (GroupID) => {
    try {
        await db.query(`
            DELETE FROM \`groups\`
            WHERE GroupID = ?;
        `,[GroupID])

        return true;
    } catch (error) {
      console.log(error)  
    }
}
const plusPhone = async (name) => {
    if (!name.gName || typeof name.gName !== 'string' || name.gName.trim() === '') {
        console.log('Invalid group name', name.gName);
        return false; 
    }

    try {
        const result = await db.query(`
            INSERT INTO \`groups\` (GroupName) VALUES (?);
        `, [name.gName]);

        return !!result; 
    } catch (error) {
        console.error('Error inserting group:', error);
        return false;  
    }
};

// const plusPhone = async (quantity) => {

//     try {

//         const quantiti = await db.query(`
//             SELECT Quantity FROM phone WHERE PhoneID = ?
//         `,[phoneID])

//         const prevQuantity = Number(quantiti[0][0].Quantity);
//         const incomintQuantity = Number(quantity.pQuantity);
//         const newQuantity = prevQuantity + incomintQuantity;
        
//         await db.query(`
//             UPDATE phone
//             SET Quantity = ?
//             WHERE PhoneID = ?;
//         `,[newQuantity,phoneID])

//         return true;
//     } catch (error) {
//       console.log(error)  
//     }
// }

const phoneCount = async () => {
    try {
        const result = await db.query(`
            SELECT COUNT(*) as phoneCount FROM phone where status = 1;
        `);
        // console.log(result[0][0].phoneCount)

        return result[0][0].phoneCount;
    } catch (error) {
        console.error('Error fetching phone count:', error);
        throw error; 
    }
}
const SmallPhoneCount = async () => {
    try {
        const result = await db.query(`
            SELECT COUNT(*) as smallphoneCount FROM smallphone where status = 1;
        `);
        // console.log(result[0][0].phoneCount)

        return result[0][0].smallphoneCount;
    } catch (error) {
        console.error('Error fetching phone count:', error);
        throw error; 
    }
}
module.exports = {
    newPhone , allPhone ,  singlePhone , updatePhone , plusPhone , erasePhone, allGroup,
    updateGroup , singleGroup , eraseGroup,allPhones,groups,soldPhones,allCPhone, phoneCount,
    newSmallPhone,updateSmallPhone,singleSmallPhone,eraseSmallPhone,SmallPhoneCount,allSmallPhone
}