const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "the_secret");
        req.userData = { name: decodedToken.name, id: decodedToken.id };
        next();
    }
    catch (err) {
        res.status(401).json({ message: "Authentication Required " });
    };
}