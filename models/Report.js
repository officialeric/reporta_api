const db = require('../config/db');

const index = async (seller_id) => {
    try {
        const result = await db.query(`
            SELECT 
                p.PhoneID,
                p.PhoneName,
                p.IMEI1
            FROM 
                sessionPhones sp
            JOIN 
                sellerSessions ss ON sp.session_id = ss.id
            JOIN 
                phone p ON sp.phone_id = p.PhoneID
            WHERE 
                ss.seller_id = ?                           
                AND DATE(ss.created_at) = CURRENT_DATE       
            ORDER BY 
                sp.created_at; 
        `,[seller_id]);

        return result[0];
    } catch (error) {
        console.error('Error fetching reports:', error);
        throw error; 
    }
}
const create = async (data,user_id) => {
    const { phones } = data;

    try {
        const reportQuery = 'INSERT INTO sellersessions (seller_id) VALUES (?)';
        const [reportResult] = await db.execute(reportQuery, [user_id]);
        const sessionId = reportResult.insertId;

        const phoneQuery = 'INSERT INTO sessionphones (session_id, phone_id) VALUES (?, ?)';
        for (const phone of phones) {
            await db.execute(phoneQuery, [sessionId, phone]);
        }

        return true;
    } catch (error) {
        throw error;
    }

}

const countBasedOnUser = async (user_id) => {
    try {
        const result = await db.query(`
            SELECT 
                COUNT(*) AS phone_count
            FROM 
                SessionPhones sp
            JOIN 
                SellerSessions ss ON sp.session_id = ss.id
            WHERE 
                ss.seller_id = ?                     
            AND 
                DATE(ss.created_at) = DATE(NOW())
        `,[user_id]);

        return result[0][0].phone_count;
    } catch (error) {
        console.error('Error fetching phone count:', error);
        throw error; 
    }
}

const allData = async ({ user, date }) => {
    try {
        const result = await db.query(`
            SELECT 
                p.PhoneID,
                p.PhoneName,
                p.IMEI1,
                ss.created_at
            FROM 
                sessionPhones sp
            JOIN 
                sellerSessions ss ON sp.session_id = ss.id
            JOIN 
                phone p ON sp.phone_id = p.PhoneID
            WHERE 
                ss.seller_id = ? 
                AND DATE(ss.created_at) = ? 
            ORDER BY 
                sp.created_at;
        `, [user, date]);

        return result[0];
    } catch (error) {
        console.error('Error fetching all data:', error);
        throw error;
    }
}


module.exports = {
    index,
    create,
    countBasedOnUser,
    allData
};