const Auth = require('../models/Auth');

const login = async (req, res) => {
    try {
        const loginCredentials = req.body;

        const result = await Auth.login(loginCredentials);

        res.status(result.status).json(result); 

    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getAuthorizedUser = async (req, res) => {
    try {
        const { userId } = req.user;

        const user = await Auth.authorizedUser(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Logged in user fetched successfully',
            user: user,
            role: user.RoleName 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const editUserProfile = async (req, res) => {
    try {
        const  UserID = req.params.id;
        const profileData = req.body;

        const result = await Auth.updateUserProfile(UserID,profileData);
 
        if(result){

            res.status(200).json({
                message: 'Profile Updated successfully'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const chengePassword = async (req, res) => {
    const { userId } = req.user;
    const pwds = req.body;

    try {

        const result = await Auth.changePwd(userId,pwds);
 
        if(result.check == 'oldPwdError'){
            res.status(400).json({
                success: false,
                message: 'Current Password Is incorrect'
            });
        }
        if(result.check == 'done'){
            res.status(200).json({
                success : true,
                message: 'Password changed successfully'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getAllUsers = async (req, res) => {
    const {userId} = req.user;
    try {

        const users = await Auth.allUsers(userId);

            res.status(200).json({
                data : users,
                message: 'Users fetched successfully'
            });


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const addUser = async (req, res) => {
    const userData = req.body;
    try {
        const result = await Auth.newUser(userData);

        if(result){

            res.status(200).json({
                message: 'Users added successfully'
            });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const userDelete = async (req, res) => {
    const UserID = req.params.id;
    try {
        const result = await Auth.eraseUser(UserID);

        if(result){

            res.status(200).json({
                message: 'Users deleted successfully'
            });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getUserByID = async (req, res) => {
    const UserID = req.params.id;
    try {
      const user = await Auth.singleUser(UserID);
      res.status(200).json({
        data : user
      }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

  const editUserByID = async (req,res) => {
    const userData = req.body;
    const userID = req.params.id;

    try {

        const result = await Auth.updateUser(userData,userID)
        
        if(result){
            res.status(200).json({
                message : 'User updated'
            })
        }
    } catch (error) {
        console.error(error)
    }
}

const userCount =async (req,res) => {
    try {
        const result = await Auth.userCount();
  
        res.status(200).json({
            data : result
        })
    } catch (error) {
        console.error(error)
    }
  }
module.exports = {
     getAllUsers, addUser,getUserByID,
    login, chengePassword, userDelete,
    getAuthorizedUser, editUserProfile, editUserByID,userCount
};
