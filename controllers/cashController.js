const Cash = require('../models/Cash')

const addCash = async (req, res) => {
  const { userId } = req.user;
  const cashData = req.body;

  try {
      // Call the newCash function with the provided cashData and userId
      const result = await Cash.newCash(cashData, userId);
      
      // Check if the result indicates that the sale cannot proceed
      if (result.cant) {
          // If 'cant' is true, send a response indicating the issue (e.g., phone cost is less than the phone price)
          return res.status(400).json({
              message: 'Phone cost cannot be less than the phone price.'
          });
      }

      if (result.less) {
          // If 'cant' is true, send a response indicating the issue (e.g., phone cost is less than the phone price)
          return res.status(400).json({
              message: result.message
          });
      }

      // If the sale can proceed, send a success message
      res.status(200).json({
          message: 'Cash sale added successfully.'
      });
  } catch (error) {
      // Log the error and send a generic error message if something goes wrong
      console.error(error);
      res.status(500).json({
          message: 'Something went wrong while processing the cash sale.'
      });
  }
};
const addSmallCash = async (req, res) => {
  const { userId } = req.user;
  const cashData = req.body;

  try {
      // Call the newCash function with the provided cashData and userId
      const result = await Cash.newSmallCash(cashData, userId);
      
      // Check if the result indicates that the sale cannot proceed
      if (result.cant) {
          // If 'cant' is true, send a response indicating the issue (e.g., phone cost is less than the phone price)
          return res.status(400).json({
              message: 'Phone cost cannot be less than the phone price.'
          });
      }

      if (result.less) {
          // If 'cant' is true, send a response indicating the issue (e.g., phone cost is less than the phone price)
          return res.status(400).json({
              message: result.message
          });
      }

      // If the sale can proceed, send a success message
      res.status(200).json({
          message: 'Cash sale added successfully.'
      });
  } catch (error) {
      // Log the error and send a generic error message if something goes wrong
      console.error(error);
      res.status(500).json({
          message: 'Something went wrong while processing the cash sale.'
      });
  }
};

const editCashByID = async (req,res) => {
    const {userId} = req.user;
    const cashData = req.body;
    const cashID = req.params.id;

    try {

        const result = await Cash.updateCash(cashData,userId,cashID)
        
            // Check if the result indicates that the sale cannot proceed
          if (result.cant) {
            // If 'cant' is true, send a response indicating the issue (e.g., phone cost is less than the phone price)
            return res.status(400).json({
                message: 'Phone cost cannot be less than the phone price.'
            });
        }

            res.status(200).json({
                message : 'cash record updated'
            })
    } catch (error) {
        console.error(error)
    }
}
const editSmallCashByID = async (req,res) => {
    const {userId} = req.user;
    const cashData = req.body;
    const cashID = req.params.id;

    try {

        const result = await Cash.updateSmallCash(cashData,userId,cashID)
        
            // Check if the result indicates that the sale cannot proceed
          if (result.cant) {
            // If 'cant' is true, send a response indicating the issue (e.g., phone cost is less than the phone price)
            return res.status(400).json({
                message: 'Phone cost cannot be less than the phone price.'
            });
        }

            res.status(200).json({
                message : 'cash record updated'
            })
    } catch (error) {
        console.error(error)
    }
}
const getAllCash = async (req, res) => {
  const {userId} = req.user;
  const { date } = req.query; 

    try {
      if (date) {
        const allCash = await Cash.allCashByDate(userId, date);
        return res.status(200).json({
          data: allCash
        });
      }

      // If no date is provided, fetch all cash records
      const allCash = await Cash.allCash(userId);
      res.status(200).json({
        data : allCash
      }); 

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
const getAllSmallCash = async (req, res) => {
  const {userId} = req.user;
    try {
      const allCash = await Cash.allSmallCash(userId);
      res.status(200).json({
        data : allCash
      }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
const getCashByID = async (req, res) => {
    const CashID = req.params.id;
    try {
      const cash = await Cash.singleCash(CashID);
      res.status(200).json({
        data : cash
      }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
const getSmallCashByID = async (req, res) => {
    const CashID = req.params.id;
    try {
      const cash = await Cash.singleSmallCash(CashID);
      res.status(200).json({
        data : cash
      }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

  
const cashDelete = async (req, res) => {
    const cashID = req.params.id;
    try {
        const result = await Cash.eraseCash(cashID);

        if(result){

            res.status(200).json({
                message: 'Cash deleted successfully'
            });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const SmallCashDelete = async (req, res) => {
    const cashID = req.params.id;
    try {
        const result = await Cash.eraseSmallCash(cashID);

        if(result){

            res.status(200).json({
                message: 'Cash deleted successfully'
            });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const saleCount =async (req,res) => {
  const { userId } = req.user;
  try {
      const result = await Cash.saleCount(userId);

      res.status(200).json({
          data : result
      })
  } catch (error) {
      console.error(error)
  }
}
const SmallSaleCount =async (req,res) => {
  const { userId } = req.user;
  try {
      const result = await Cash.SmallSaleCount(userId);

      res.status(200).json({
          data : result
      })
  } catch (error) {
      console.error(error)
  }
}


module.exports = {
     addCash , getAllCash , getCashByID , editCashByID , cashDelete,saleCount,
     addSmallCash,getAllSmallCash,getSmallCashByID,editSmallCashByID,SmallCashDelete,SmallSaleCount
}