const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getUserByEmail = async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length ? rows[0] : null; 
};

const login = async (userData) => {
    const { email, password } = userData;

    try {
        // Check if the user exists
        const user = await getUserByEmail(email);

        if (!user) {
            return {
                status: 400,
                success: false,
                message: 'User not found.'
            };
        }

        // const isPasswordCorrect = bcrypt.compareSync(password, user.Password);
        const isPasswordCorrect = password == user.Password;
        if (!isPasswordCorrect) {
            return {
                status: 400,
                success: false,
                message: 'Incorrect password.'
            };
        }

        // const now = new Date();

        // const nextMidnight = new Date(now);
        // nextMidnight.setHours(24, 0, 0, 0); 

        // const expiresInMs = nextMidnight - now;

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.UserID, RoleID: user.RoleID },
            process.env.JWT_SECRET,
            {
                expiresIn: '2h'
            }
        );

        return {
            status: 200,
            success: true,
            message: 'Login successful.',
            token
        };

    } catch (error) {
        console.error('Login error:', error.message);
        return {
            status: 500,
            success: false,
            message: error.message
        };
    }
};

const authorizedUser = async (userID) => {
    const [user] = await db.query(`
        select u.* , r.RoleName
        from users u 
        inner join roles r on r.RoleID = u.RoleID
        where u.UserID = ?    
    `, [userID])

    if (user) {
        delete user[0].Password;
    }

    return user[0];
}

const updateUserProfile = async (userID, profileData) => {
    const { name, email, phone } = profileData;

    try {
        const [result] = await db.query(`
            UPDATE users 
            SET UserName = ?, Email = ?, PhoneNumber = ? 
            WHERE UserID = ?
        `, [name, email, phone, userID]);

        if (result.affectedRows === 0) {
            return false;
        }

        return true;

    } catch (error) {
        console.error('Error updating profile:', error);
        return false;
    }
};
const changePwd = async (userID, pwds) => {
    const { 
        currentPassword,
        newPassword,
        confirmNewPassword
     } = pwds;

    //  check if current password is correct
    const [isValid] = await db.query(`SELECT Password FROM users WHERE UserID = ?` , [userID]);

    if(isValid[0].Password != currentPassword){
        return { check : 'oldPwdError' };
    }

    try {
        const [result] = await db.query(`
            UPDATE users 
            SET Password = ?
            WHERE UserID = ?
        `, [newPassword, userID]);

        if (result.affectedRows === 0) {
            return false;
        }

        return { check : 'done' };

    } catch (error) {
        console.error('Error updating profile:', error);
        return false;
    }
};

const allUsers = async (userID) => {
    const users = await db.query('select * from users where not UserID = ? and Status = ?' , [userID , 1])
   return users[0];
}

const newUser = async (userData) => {
    const {
        firstname,
        username,
        email,
        password,
        phone
    } = userData;

    try {
        await db.query(`
            insert into users (FirstName , UserName , Email , Password , PhoneNumber , Status , RoleID)
            values(?,?,?,?,?,?,?)
        `,[firstname,username,email,password,phone,1,2])

        return true;
    } catch (error) {
      console.log(error)  
    }
}

const eraseUser = async (userID) => {
    const status = 0;
    try {
        await db.query(`
            UPDATE users
            SET
            Status = ?
            WHERE UserID = ?;
        `,[status,userID])

        return true;
    } catch (error) {
      console.log(error)  
    }
}

const singleUser = async (userID) => {
    const [data] = await db.query(`
        SELECT * 
        FROM users WHERE UserID = ?;
    `, [userID])

    return data[0];
}

const updateUser = async (userData , userID) => {
    const {
        firstname,
        username,
        email,
        password,
        phone
    } = userData;

     result = await db.query(`
        UPDATE users
        SET 
            FirstName = ?,
            UserName = ?,
            Email = ?,
            Password = ?,
            PhoneNumber   = ?
        WHERE UserID = ?;
     `, [firstname , username , email , password, phone, userID]);
      
    return !!result;
}

const userCount = async () => {
    try {
        const result = await db.query(`
            SELECT COUNT(*) as userCount FROM users;
        `);
        // console.log(result[0][0].phoneCount)

        return result[0][0].userCount;
    } catch (error) {
        console.error('Error fetching phone count:', error);
        throw error; 
    }
}
module.exports = {
    login , authorizedUser , updateUserProfile , changePwd , allUsers , 
    newUser , eraseUser , singleUser ,updateUser,userCount
};
