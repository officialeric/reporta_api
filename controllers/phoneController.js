const Phone = require('../models/Phone')

const addPhone = async (req,res) => {
    const phoneData = req.body;

    try {

        const result = await Phone.newPhone(phoneData)
        
        if(result){
            res.status(200).json({
                message : 'phone sale added'
            })
        }
    } catch (error) {
        console.error(error)
    }
}
const addSmallPhone = async (req,res) => {
    const phoneData = req.body;

    try {

        const result = await Phone.newSmallPhone(phoneData)
        
        if(result){
            res.status(200).json({
                message : 'phone sale added'
            })
        }
    } catch (error) {
        console.error(error)
    }
}

const editPhoneByID = async (req,res) => {
    const phoneData = req.body;
    const PhoneID = req.params.id;

    try {

        const result = await Phone.updatePhone(phoneData,PhoneID)
        
        if(result){
            res.status(200).json({
                message : 'phone record updated'
            })
        }
    } catch (error) {
        console.error(error)
    }
}
const editSmallPhoneByID = async (req,res) => {
    const phoneData = req.body;
    const PhoneID = req.params.id;

    try {

        const result = await Phone.updateSmallPhone(phoneData,PhoneID)
        
        if(result){
            res.status(200).json({
                message : 'phone record updated'
            })
        }
    } catch (error) {
        console.error(error)
    }
}
const editGroupByID = async (req,res) => {
    const GroupData = req.body;
    const GroupID = req.params.id;

    // console.log(GroupData,GroupID)
    try {

        const result = await Phone.updateGroup(GroupData,GroupID)
        
        if(result){
            res.status(200).json({
                message : 'Group record updated'
            })
        }
    } catch (error) {
        console.error(error)
    }
}
const getAllPhone = async (req, res) => {
    try {
      const allPhone = await Phone.allPhone();
      res.status(200).json({
        data : allPhone
      }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
const getAllSmallPhone = async (req, res) => {
    try {
      const allPhone = await Phone.allSmallPhone();
      res.status(200).json({
        data : allPhone
      }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
const getAllCPhone = async (req, res) => {
    try {
      const allPhone = await Phone.allCPhone();
      res.status(200).json({
        data : allPhone
      }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
const getAllPhones = async (req, res) => {
    const GroupID = req.params.id;

    try {
      const allPhones = await Phone.allPhones(GroupID);
      res.status(200).json({
        data : allPhones
      }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
const getSoldPhones = async (req, res) => {
    try {
      const allPhones = await Phone.soldPhones();
      res.status(200).json({
        data : allPhones
      }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
const getAllGroup = async (req, res) => {
    try {
      const allGroup = await Phone.allGroup();

    //   console.log(allGroup)
      res.status(200).json({
        data : allGroup
      }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
const groups = async (req, res) => {
    try {
      const allGroup = await Phone.groups();

    //   console.log(allGroup)
      res.status(200).json({
        data : allGroup
      }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };


const getPhoneByID = async (req, res) => {
    const PhoneID = req.params.id;
    try {
      const phone = await Phone.singlePhone(PhoneID);
      res.status(200).json({
        data : phone
      }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
const getSmallPhoneByID = async (req, res) => {
    const PhoneID = req.params.id;
    try {
      const phone = await Phone.singleSmallPhone(PhoneID);
      res.status(200).json({
        data : phone
      }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
const getGroupByID = async (req, res) => {
    const GroupID = req.params.id;
    try {
      const group = await Phone.singleGroup(GroupID);
      res.status(200).json({
        data : group
      }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

  
const PhoneDelete = async (req, res) => {
    const PhoneID = req.params.id;
    try {
        const result = await Phone.erasePhone(PhoneID);

        if(result){

            res.status(200).json({
                message: 'Phone deleted successfully'
            });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const SmallPhoneDelete = async (req, res) => {
    const PhoneID = req.params.id;
    try {
        const result = await Phone.eraseSmallPhone(PhoneID);

        if(result){

            res.status(200).json({
                message: 'Phone deleted successfully'
            });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const GroupDelete = async (req, res) => {
    const GroupID = req.params.id;
    try {
        const result = await Phone.eraseGroup(GroupID);

        if(result){

            res.status(200).json({
                message: 'Group deleted successfully'
            });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const plusStock = async (req, res) => {
    const group = req.body; 
    try {
        const result = await Phone.plusPhone(group);

        if(result){

            res.status(200).json({
                message: 'Group added in stock successfully'
            });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const phoneCount =async (req,res) => {
  try {
      const result = await Phone.phoneCount();

      res.status(200).json({
          data : result
      })
  } catch (error) {
      console.error(error)
  }
}
const SmallPhoneCount =async (req,res) => {
  try {
      const result = await Phone.SmallPhoneCount();

      res.status(200).json({
          data : result
      })
  } catch (error) {
      console.error(error)
  }
}

module.exports = {
     addPhone , getAllPhone,phoneCount , getPhoneByID , editPhoneByID , PhoneDelete ,plusStock,getAllCPhone, 
     getAllGroup,editGroupByID,getGroupByID,GroupDelete,getAllPhones,groups,getSoldPhones,
     addSmallPhone,getAllSmallPhone,getSmallPhoneByID,editSmallPhoneByID,SmallPhoneDelete,SmallPhoneCount
}