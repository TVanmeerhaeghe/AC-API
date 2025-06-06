const crypto = require('crypto');
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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
      email_adress,
    });

    return res.status(201).json({
      message: 'Utilisateur créé avec succès.',
      user: newUser,
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
        surname: user.surname,
      },
      process.env.JWT_SECRET,
      { expiresIn: '480h' }
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

    user.name = name ?? user.name;
    user.surname = surname ?? user.surname;
    user.role = role ?? user.role;
    user.email_adress = email_adress ?? user.email_adress;

    await user.save();

    return res.json({ message: 'Utilisateur mis à jour.', user });
  } catch (error) {
    console.error('Erreur updateUser :', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res
        .status(400)
        .json({ message: 'current_password et new_password requis.' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    const ok = await bcrypt.compare(current_password, user.password);
    if (!ok) {
      return res
        .status(401)
        .json({ message: 'Mot de passe actuel incorrect.' });
    }

    const hashed = await bcrypt.hash(new_password, 10);
    user.password = hashed;
    await user.save();

    return res.json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (error) {
    console.error('Erreur changePassword :', error);
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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email requis.' });

    const user = await User.findOne({ where: { email_adress: email } });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    const token = jwt.sign(
      { id: user.id, email: user.email_adress, type: 'reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const frontendUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.BASE_URL.replace(/\/$/, '')
        : 'http://localhost:4200';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email_adress,
      subject: 'Réinitialisation de mot de passe',
      html: `<p>Pour réinitialiser votre mot de passe, cliquez sur ce lien : <a href="${resetUrl}">${resetUrl}</a></p>`
    });

    return res.json({ message: 'Email de réinitialisation envoyé.' });
  } catch (error) {
    console.error('Erreur reset password:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
