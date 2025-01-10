const db = require('../config/db');

const createNotification = async (userID,type,resourceID) => {
    const isCreate = await db.query(`
        INSERT INTO notifications (UserID , type , ResourceID , created_at)
        VALUES (?,?,?,NOW())
    `,[userID,type,resourceID])

    return !!isCreate;
}

const AllNotifications = async () => {
    const query = `
        SELECT n.* , u.UserName
        FROM notifications n
        INNER JOIN  users u on u.UserID = n.UserID
        WHERE n.status = 1
        ORDER BY n.created_at DESC;
    `;
    const data = await db.execute(query);

    return data[0];

}

const markAsRead = async (id) => {
    const hasMade = await db.query(`
        UPDATE notifications
        SET isRead = 1
        WHERE ResourceID = ?
    `,[id])

    return !!hasMade;
}

const notificationCount = async () => {
    try {
        const result = await db.query(`
            SELECT COUNT(*) as notifications FROM notifications where status = 1 AND isRead = 0;
        `);
        // console.log(result[0][0].phoneCount)

        return result[0][0].notifications;
    } catch (error) {
        console.error('Error fetching notification count:', error);
        throw error; 
    }
}

module.exports = {
    createNotification , markAsRead ,AllNotifications , notificationCount
}