const TopUp = require('../models/TopUp')

const getAllTopups = async (req, res) => {
  const {userId} = req.user;
    try {
      const allTopups = await TopUp.allTopups(userId);
      res.status(200).json({
        data : allTopups
      }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  const getTopupByID = async (req, res) => {
      const topupID = req.params.id;
      try {
        const topup = await TopUp.singleTopup(topupID);
        res.status(200).json({
          data : topup
        }); 
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
    };

const   addTopup = async (req,res) => {
    const {userId} = req.user;
    const { customer, phone, CPphoneName, CPimei1, CPimei2, PhoneID, NIDA, closerUser, cost } = req.body;
    const image = req.file ? req.file.filename : null;


    try {
      const topupData = {
        customer,
        phone,
        CPphoneName,
        CPimei1,
        CPimei2,
        PhoneID,
        NIDA,
        closerUser,
        cost,
        image,  
      };

        const result = await TopUp.newTopup(topupData,userId)

        if (result.less) {
          return res.status(400).json({
              message: result.message
          });
        }
        
        if(result.cant){
            res.status(200).json({
                message : 'Topup added'
            })
        }
    } catch (error) {
        console.error(error)
    }
}
const editTopupByID = async (req,res) => {
    const {userId} = req.user;
    const topupData = req.body;
    const topupID = req.params.id;

    try {

        const result = await TopUp.updateTopup(topupData,userId,topupID)
        
        if(result){
            res.status(200).json({
                message : 'Topup record updated'
            })
        }
    } catch (error) {
        console.error(error)
    }
}

  
const topupDelete = async (req, res) => {
    const topupID = req.params.id;
    try {
        const result = await TopUp.eraseTopup(topupID);

        if(result){

            res.status(200).json({
                message: 'topup deleted successfully'
            });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
     addTopup , getAllTopups , getTopupByID , editTopupByID , topupDelete
}