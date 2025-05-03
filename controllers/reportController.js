const Report = require("../models/Report");

const getAllUserPhones = async (req, res) => {
  const {userId} = req.user;
    try {
      const phones = await Report.index(userId);
      res.status(200).json({
        data : phones
      }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
const getAllData = async (req, res) => {
  const data = req.query;    
  try {
      const phones = await Report.allData(data);
      res.status(200).json({
        data : phones
      }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

const addReport = async (req, res) => {
    const { userId } = req.user;
    const reportData = req.body;

    try {

        const result = await Report.create(reportData,userId);
        
        res.status(201).json({
            message: "Report added successfully",
            report: result,
        });

    } catch (error) {
        console.error("Error adding report:", error);
        return res.status(500).json({ message: error.message });
    }
}

const UserPhoneCount =async (req,res) => {
    const { userId } = req.user;
  try {
      const result = await Report.countBasedOnUser(userId);
      res.status(200).json({
          data : result
      })
  } catch (error) {
      console.error(error)
  }
}

const getGeneralData = async (req, res) => {
  try {
      const results = await Report.generalData();

      res.status(200).json({
        data : results
      }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

module.exports = {
    getAllUserPhones,
    addReport,
    UserPhoneCount,
    getAllData,
    getGeneralData
};