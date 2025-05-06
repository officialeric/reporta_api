const Return = require('../models/Return')

const getAllReturn = async (req, res) => {
  const {userId} = req.user;
    try {
      const allReturn = await Return.allReturn(userId);
      res.status(200).json({
        data : allReturn
      }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  const getReturnByID = async (req, res) => {
      const returnID = req.params.id;
      try {
        const aReturn = await Return.singleReturn(returnID);
        res.status(200).json({
          data : aReturn
        }); 
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
    };

const addReturn = async (req,res) => {
    const {userId} = req.user;
    const returnData = req.body;

    try {

        const result = await Return.newReturn(returnData,userId)
        
        if(result){
            res.status(200).json({
                message : 'Return added'
            })
        }
    } catch (error) {
        console.error(error)
    }
}
const editReturnByID = async (req,res) => {
    const {userId} = req.user;
    const returnData = req.body;
    const returnID = req.params.id;

    try {

        const result = await Return.updateReturn(returnData,userId,returnID)
        
        if(result){
            res.status(200).json({
                message : 'Return record updated'
            })
        }
    } catch (error) {
        console.error(error)
    }
}

  
const returnDelete = async (req, res) => {
    const returnID = req.params.id;
    try {
        const result = await Return.eraseReturn(returnID);

        if(result){

            res.status(200).json({
                message: 'Return deleted successfully'
            });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const returnCount =async (req,res) => {
    const {userId} = req.user;
    try {
      const result = await Return.returnCount(userId);

      res.status(200).json({
          data : result
      })
  } catch (error) {
      console.error(error)
  }
}

module.exports = {
     addReturn , getAllReturn , getReturnByID , editReturnByID , returnDelete,returnCount
}