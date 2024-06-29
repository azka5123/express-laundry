const { User } = require('../models');
const bcrypt = require('bcryptjs');

async function index(req, res) {
    const users = await User.findAll();
    try{
        res.status(200).json(users);
    }catch(error){
        res.json(error);
    }
}

async function store(req, res) {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ msg: 'Masukan Semua Data Yang Dibutuhkan' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword, role });
        res.status(201).json({ msg: 'User Berhasil Dibuat' });
    } catch (error) {
        if (error.email === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ msg: 'Email Sudah Digunakan' })
        }
        res.status(500).json({ msg: 'Internal Server Error', error: error });
    }
}

async function edit(req,res){
    const userId = req.params.id;
    try{
        const user = await User.findByPk(userId);
        res.status(200).json({msg:"data berhasil didapatkankan",data:user});
    }catch(error){

    }
}

async function update(req, res) {
    const { name, email, password, role } = req.body;
    const userId = req.params.id;
    
    try {
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ msg: 'User tidak ditemukan' });
        }

        if ([name, email, role].some(field => field == null)) {
            return res.status(400).json({ msg: 'Data Tidak Boleh Null' });
        }

        let isSamePassword = true;
        if (password != null) {
            isSamePassword = await bcrypt.compare(password, user.password);
        }

        const isSame = [
            name === user.name,
            role === user.role,
            email === user.email,
            isSamePassword
        ];

        if (isSame.every(Boolean)) {
            return res.status(200).json({ msg: 'Tidak Ada Data Yang Diubah' });
        }

        const updatedData = {
            name: isSame[0] ? user.name : name,
            email: isSame[2] ? user.email : email,
            role: isSame[1] ? user.role : role,
        };

        if (password != null) {
            updatedData.password = await bcrypt.hash(password, 10);
        }

        await User.update(updatedData, { where: { id: userId } });
        return res.status(200).json({ msg: 'User Berhasil Diubah' });

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ msg: 'Email Sudah Digunakan' });
        }
        return res.status(500).json({ msg: 'Internal Server Error', error: error });
    }
}

async function destroy(req,res){
    const userId = req.params.id;
    await User.destroy({where:{id:userId}});
    res.status(200).json({msg:'User Berhasil Dihapus'});
}

module.exports = { index, store, update, edit, destroy }