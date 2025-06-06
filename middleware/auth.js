const jwt = require('jsonwebtoken');

exports.verifyResetToken = (req, res, next) => {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'Token manquant.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.type !== 'reset') {
            return res.status(403).json({ message: 'Token invalide.' });
        }
        req.userToReset = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token invalide ou expiré.' });
    }
};

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res
            .status(401)
            .json({ message: 'Accès refusé. Aucun token fourni.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide ou expiré.' });
        }
        req.user = decoded;
        next();
    });
};


exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        return next();
    }
    return res.status(403).json({ message: 'Accès réservé aux administrateurs.' });
};
