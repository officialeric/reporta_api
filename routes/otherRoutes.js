const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/authMiddleware');

const { addCash, getAllCash , getCashByID , editCashByID , cashDelete, saleCount, addSmallCash, getAllSmallCash, getSmallCashByID, editSmallCashByID, SmallCashDelete, SmallSaleCount} = require('../controllers/cashController');
const { getAllReturn, getReturnByID, addReturn, editReturnByID, returnDelete, returnCount } = require('../controllers/returnController');
const { addTopup, getAllTopups, getTopupByID, editTopupByID, topupDelete } = require('../controllers/topupController');
const { addPhone, getAllPhone, getPhoneByID, editPhoneByID, PhoneDelete, plusStock,getAllGroup, getGroupByID, GroupDelete, editGroupByID, getAllPhones, groups, getSoldPhones, getAllCPhone, phoneCount, addSmallPhone, getAllSmallPhone, getSmallPhoneByID, editSmallPhoneByID, SmallPhoneDelete, SmallPhoneCount } = require('../controllers/phoneController');
const { getAllPayments, addPayment, getPaymentByID, editPaymentByID, paymentDelete, addPaymentItem, getAllPaymentItems, deleteSlowRecord, editProgressByID } = require('../controllers/slowController');
const { addComment, pendingCount, getAllComments, doneComment } = require('../controllers/commentController');
const { getAllNotifications, getNotificationCount } = require('../controllers/notificationController');

// phone
router.get('/soldPhones' , getSoldPhones )
router.get('/allPhones/:id' , getAllPhones )
router.post('/addPhone' ,addPhone )
router.get('/allPhone' , getAllPhone )
router.get('/singlePhone/:id' , getPhoneByID )
router.put('/updatePhone/:id' , editPhoneByID )
router.post('/deletePhone/:id', PhoneDelete)
router.get('/phoneCount', phoneCount)

router.get('/SmallPhoneCount', SmallPhoneCount)
router.post('/addSmallPhone' , addSmallPhone)
router.get('/allSmallPhone' ,  getAllSmallPhone)
router.get('/singleSmallPhone/:id' ,  getSmallPhoneByID)
router.put('/updateSmallPhone/:id' ,  editSmallPhoneByID)

router.post('/deleteSmallPhone/:id', SmallPhoneDelete)

router.get('/allCPhone' , getAllCPhone )

router.post('/addGroup', plusStock)
router.get('/allGroups' , getAllGroup )
router.get('/groups' ,  groups)
router.get('/singleGroup/:id' , getGroupByID )
router.put('/updateGroup/:id' ,  editGroupByID)
router.post('/deleteGroup/:id',GroupDelete )

// cash sales
router.post('/addCash' , verifyJWT ,addCash )
router.get('/allCash',verifyJWT , getAllCash )
router.get('/singleCash/:id' , getCashByID )
router.put('/updateCash/:id', verifyJWT , editCashByID )
router.post('/deleteCash/:id', cashDelete)
router.get('/saleCount', verifyJWT, saleCount)

router.post('/addSmallCash' , verifyJWT , addSmallCash)
router.get('/allSmallCash',verifyJWT , getAllSmallCash)
router.put('/updateSmallCash/:id', verifyJWT , editSmallCashByID)

router.get('/singleSmallCash/:id' , getSmallCashByID)
router.post('/deleteSmallCash/:id',SmallCashDelete)
router.get('/SmallSaleCount', verifyJWT,SmallSaleCount)

// return sales
router.get('/allReturns',verifyJWT , getAllReturn )
router.post('/addReturn' , verifyJWT ,addReturn )
router.get('/singleReturn/:id' , getReturnByID )
router.put('/updateReturn/:id', verifyJWT , editReturnByID )
router.post('/deleteReturn/:id', returnDelete)
router.get('/returnCount', returnCount)

// top up sales
router.get('/allTopups',verifyJWT , getAllTopups )
router.post('/addTopup' , verifyJWT ,addTopup )
router.get('/singleTopup/:id' , getTopupByID )
router.put('/updateTopup/:id', verifyJWT , editTopupByID )
router.post('/deleteTopup/:id', topupDelete)

// top up sales
router.get('/allTopups',verifyJWT , getAllTopups )
router.post('/addTopup' , verifyJWT ,addTopup )
router.get('/singleTopup/:id' , getTopupByID )
router.put('/updateTopup/:id', verifyJWT , editTopupByID )
router.post('/deleteTopup/:id', topupDelete)

// slow sales
router.get('/allSlow',verifyJWT , getAllPayments )
router.get('/allPaymentItems/:id' , getAllPaymentItems )

router.post('/addSlow' , verifyJWT , addPayment)
router.post('/addPaymentItem' , verifyJWT , addPaymentItem)
router.get('/singleSlow/:id' ,  getPaymentByID)
router.put('/updateSlow/:id', verifyJWT , editPaymentByID )
router.put('/editProgress/:id' , editProgressByID )
router.post('/deleteSlow/:id', paymentDelete)
router.post('/deleteSlowRecord/:id', deleteSlowRecord)

//comments
router.post('/addComment' , verifyJWT , addComment)
router.get('/pendingCount' , pendingCount)
router.get('/allComments' , getAllComments)
router.put('/doneComment/:id' , doneComment)

//notifications
router.get('/allNotifications',getAllNotifications)
router.get('/notificationCount',getNotificationCount)


module.exports = router;
