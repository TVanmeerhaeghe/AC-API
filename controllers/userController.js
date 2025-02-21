const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res) => {
    try {
        const { name, surname, password, role, email_adress } = req.body;

        const userExists = await User.findOne({ where: { email_adress } });
        if (userExists) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            surname,
            password: hashedPassword,
            role,
            email_adress
        });

        return res.status(201).json({
            message: 'Utilisateur créé avec succès.',
            user: newUser
        });
    } catch (error) {
        console.error('Erreur signUp :', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.signIn = async (req, res) => {
    try {
        const { email_adress, password } = req.body;

        const user = await User.findOne({ where: { email_adress } });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Mot de passe incorrect.' });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                name: user.name,
                surname: user.surname
            },
            process.env.JWT_SECRET,
            { expiresIn: '48h' }
        );

        return res.status(200).json({
            message: 'Connexion réussie.',
            token,
        });
    } catch (error) {
        console.error('Erreur signIn :', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.json(users);
    } catch (error) {
        console.error('Erreur getAllUsers :', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }

        return res.json(user);
    } catch (error) {
        console.error('Erreur getUserById :', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, surname, role, email_adress } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }

        if (name !== undefined) user.name = name;
        if (surname !== undefined) user.surname = surname;
        if (role !== undefined) user.role = role;
        if (email_adress !== undefined) user.email_adress = email_adress;

        await user.save();

        return res.json({ message: 'Utilisateur mis à jour.', user });
    } catch (error) {
        console.error('Erreur updateUser :', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }

        await user.destroy();

        return res.json({ message: 'Utilisateur supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur deleteUser :', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};
