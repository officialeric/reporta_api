const SlowPayment = require('../models/SlowPayment')

const getAllPayments = async (req, res) => {
  const {userId} = req.user;
    try {
      const allPayments = await SlowPayment.allPayments(userId);
      res.status(200).json({
        data : allPayments
      }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
const getAllPaymentItems = async (req, res) => {
  const paymentID = req.params.id;
    try {
      const allPayments = await SlowPayment.allPaymentItems(paymentID);
      res.status(200).json({
        data : allPayments
      }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  const getPaymentByID = async (req, res) => {
      const paymentID = req.params.id;
      try {
        const payment = await SlowPayment.singlePayment(paymentID);
        res.status(200).json({
          data : payment
        }); 
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
    };

const addPayment = async (req,res) => {
    const {userId} = req.user;
    const paymentData = req.body;

    try {

        const result = await SlowPayment.newPayment(paymentData,userId)
        
        if(result){
            res.status(200).json({
                message : 'Slow Payment added'
            })
        }
    } catch (error) {
        console.error(error)
    }
}
const addPaymentItem = async (req,res) => {
    const {userId} = req.user;
    const paymentData = req.body;

    // console.log(paymentData)
    try {

        const result = await SlowPayment.newPaymentItem(paymentData,userId)
        
        if(result){
            res.status(200).json({
                message : 'Slow Payment Item added'
            })
        }
    } catch (error) {
        console.error(error)
    }
}
const editPaymentByID = async (req,res) => {
    const {userId} = req.user;
    const paymentData = req.body;
    const paymentID = req.params.id;

    try {

        const result = await SlowPayment.updatePayment(paymentData,userId,paymentID)
        
        if(result){
            res.status(200).json({
                message : 'slow payment record updated'
            })
        }
    } catch (error) {
        console.error(error)
    }
}
const editProgressByID = async (req,res) => {
    const { amount } = req.body;
    const progressID = req.params.id;

    try {

        const result = await SlowPayment.updateProgress(amount,progressID)
        
        if(result){
            res.status(200).json({
                message : 'progress record updated'
            })
        }
    } catch (error) {
        console.error(error)
    }
}

  
const paymentDelete = async (req, res) => {
    const paymentID = req.params.id;
    try {
        const result = await SlowPayment.erasePayment(paymentID);

        if(result){

            res.status(200).json({
                message: 'payment deleted successfully'
            });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteSlowRecord = async (req, res) => {
    const paymentID = req.params.id;
    try {
        const result = await SlowPayment.erasePaymentRecord(paymentID);

        if(result){

            res.status(200).json({
                message: 'payment deleted successfully'
            });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



module.exports = {
     addPayment , getAllPayments , getPaymentByID , editPaymentByID , paymentDelete,addPaymentItem,
     getAllPaymentItems, deleteSlowRecord,editProgressByID
}