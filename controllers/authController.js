const { User, Token } = require('../models');
const { sequelize } = require('../models/index'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET;
const moment = require('moment-timezone');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_HOST,
    auth:{
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

async function register(req, res) {
    const { name, email, password, role } = req.body;
    // res.json(req.body);
    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Masukan Semua Data Yang Dibutuhkan' });
    }

    try {
        await sequelize.sync();
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role:'user' });
        res.status(201).json({ msg: 'User Berhasil Dibuat' });
    } catch (error) {
        if (error.email === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ msg: 'Email Sudah Digunakan' });
        }
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

function expiresAt(number, unit) {
    const local = moment.tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    const expiresAt = moment(local).add(moment.duration(number, unit)).format('YYYY-MM-DD HH:mm:ss.SSS[Z]');
    return expiresAt
}

async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ msg: 'Email Atau Password Salah' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ msg: 'Email Atau Password Salah' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token })
        await Token.create({ token, userId: user.id, expiresAt:expiresAt(1, 'd'), scope: 'login' });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error',error:error });
    }
};

async function forgetPassword(req, res) {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ msg: "Email Tidak Terdaftar" });
        }
        const token = crypto.randomBytes(32).toString('hex');
        checkToken = await Token.findOne({where:{userId:user.id}});
        if(checkToken){
            await checkToken.destroy();
        }
        await Token.create({token, userId:user.id, expiresAt:expiresAt(10, 'm') , scope:'forget-password' });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Reset Password',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n`
            + `Please click on the following link, or paste this into your browser to complete the process:\n\n`
            + `http://localhost:3000/auth/reset-password/${token}\n\n`
            + `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        }

        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log(error);
                res.status(500).json({msg:'error sending email'});
            }
            else{
                console.log('Email sent: ' + info.response);
                res.status(200).json({msg:'email sent'});
            }
        });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error',error:error });
    }
}

async function getForgetPassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;
    // try {
        const checkToken = await Token.findOne({ where: { token, scope: 'forget-password',  } });
        if (!checkToken || checkToken.expiresAt < moment().toDate()) {
            return res.status(400).json({ msg: 'Token Is Invalid Or Expired' });
        }
        const user = await User.findOne({ where: { id: checkToken.userId } });
        if (!user) {
            return res.status(400).json({ msg: 'User Not Found' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        User.update({password: hashedPassword},{where:{id:user.id}});
        Token.destroy({where:{token}});
        return res.status(200).json({msg:'Password Berhasil Diubah'});
    // } catch (error) {
    //     res.status(500).json({ msg: 'Internal Server Error' ,error:error});
    // }
}

async function logout(req, res) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(400).json({ msg: 'Token not provided' });
    }
    try {
        await Token.destroy({ where: { token } });
        res.status(200).json({ msg: 'Logout Berhasil' });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error',error:error });
    }
}


module.exports = {
    register,
    login,
    forgetPassword,
    getForgetPassword,
    logout,
}
