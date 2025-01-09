const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/authMiddleware');

const { login , getAuthorizedUser , addUser, getUserByID,editUserByID,
        editUserProfile , chengePassword , getAllUsers ,userDelete,
        userCount
    } = require('../controllers/authController');

// router.post('/register', register);
router.post('/login', login);
router.put('/editProfile/:id', editUserProfile);
router.get('/singleUser/:id', getUserByID);
router.get('/getLoggedInUser', verifyJWT, getAuthorizedUser)
router.put('/changePwd', verifyJWT, chengePassword)
router.get('/users', verifyJWT,getAllUsers)
router.post('/addUser',addUser)
router.post('/deleteUser/:id',userDelete)
router.put('/updateUser/:id', editUserByID )
router.get('/userCount', userCount)

module.exports = router;
