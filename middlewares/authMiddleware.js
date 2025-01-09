const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
     const authHeader = req.headers.authorization;

     if(!authHeader){

        return res.status(401).json({
            success:false, 
            message:'No token provided'
        });

     }else{

      const token = authHeader.split(' ')[1];

      if(!token){

        return res.status(401).json({
            success:false, 
            message:'Invalid token format'
        });

      }else{

        try{

          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = decoded;
          // return res.status(200).json({success:true, message:'verified' , user:req.user});
          next();
        }catch(error){
          return res.status(401).json({
            success:false, 
            message:'Invalid token'
        });
        }
      }
    
     }
};

module.exports = verifyJWT;
