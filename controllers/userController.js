const { User, Profile, sequelize } = require('../models');
const bcrypt = require('bcryptjs');

async function index(req, res) {
    const users = await User.findAll({
        include: [{
            model: Profile,
            as: 'profiles'
        }]
    });

    try {
        res.status(200).json({
            status: 'success',
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }

}

async function store(req, res) {
    const { name, email, password, role, alamat, noHp } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Masukan Semua Data Yang Dibutuhkan' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role });
        Profile.create({ userId: user.id, alamat, noHp });
        res.status(201).json({ status: 'success', message: 'User Berhasil Dibuat' });
    } catch (error) {
        if (error.email === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ status: 'error', message: 'Email Sudah Digunakan' })
        }
        res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
    }
}

async function edit(req, res) {
    const userId = req.params.id;
    try {
        const user = await User.findByPk(userId, {
            include: [{
                model: Profile,
                as: 'profiles'
            }]
        });
        res.status(200).json({ status: 'success', message: "data berhasil didapatkankan", data: user });
    } catch (error) {
        res.status(500).json({ status: 'error', message: "internal server error", error: error.message });
    }
}

async function update(req, res) {
    const { name, email, password, role, alamat, noHp } = req.body;
    const userId = req.params.id;

    const transaction = await sequelize.transaction();

    try {
        const user = await User.findByPk(userId, {
            include: [{
                model: Profile,
                as: 'profiles'
            }],
            transaction
        });

        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ status: 'error', message: 'User tidak ditemukan' });
        }

        if ([name, email].some(field => field == null)) {
            await transaction.rollback();
            return res.status(400).json({ status: 'error', message: 'Data Tidak Boleh Null' });
        }

        let isSamePassword = true;
        if (password != null) {
            isSamePassword = await bcrypt.compare(password, user.password);
        }

        let isSameRole;
        if(role == null){
            isSameRole= user.role
        }

        const isSame = [
            name === user.name,
            isSameRole,
            email === user.email,
            alamat === user.profiles.alamat,
            noHp === user.profiles.noHp,
            isSamePassword
        ];

        if (isSame.every(Boolean)) {
            await transaction.commit();
            return res.status(200).json({ status: 'success', message: 'Tidak Ada Data Yang Diubah' });
        }

        const updatedUserData = {
            name: isSame[0] ? user.name : name,
            role: isSame[1] ? user.role : role,
            email: isSame[2] ? user.email : email,
        };

        if (password != null) {
            updatedUserData.password = await bcrypt.hash(password, 10);
        }

        await User.update(updatedUserData, { where: { id: userId }, transaction });

        const updatedProfileData = {
            alamat: isSame[3] ? user.profiles.alamat : alamat,
            noHp: isSame[4] ? user.profiles.noHp : noHp
        };

        await Profile.update(updatedProfileData, { where: { userId: userId }, transaction });

        await transaction.commit();

        return res.status(200).json({ status: 'success', message: 'User Berhasil Diubah' });

    } catch (error) {
        await transaction.rollback();
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ status: 'error', message: 'Email Sudah Digunakan' });
        }
        return res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
    }
}

async function destroy(req, res) {
    const userId = req.params.id;

    const transaction = await sequelize.transaction();

    try {
        const userDeletion = await User.destroy({
            where: { id: userId },
            transaction
        });

        if (!userDeletion) {
            await transaction.rollback();
            return res.status(404).json({ status: 'error', message: 'User tidak ditemukan' });
        }

        await Profile.destroy({
            where: { userId: userId },
            transaction
        });

        await transaction.commit();

        return res.status(200).json({ status: 'success', message: 'User dan profil berhasil dihapus' });

    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
    }
}

module.exports = { index, store, update, edit, destroy }
