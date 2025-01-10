const Notification = require('../models/Notification')

const getAllNotifications = async (req,res) => {
    try {
        const notifications = await Notification.AllNotifications();
        res.status(200).json({
          data : notifications
        }); 
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
}

const getNotificationCount =async (req,res) => {
    try {
        const result = await Notification.notificationCount();
  
        res.status(200).json({
            data : result
        })
    } catch (error) {
        console.error(error)
    }
  }

module.exports = {
    getAllNotifications , getNotificationCount
}