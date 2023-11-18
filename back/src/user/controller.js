const express = require('express');
const router = express.Router();
const handleAuth = require('../middlewares/authHandler');


router.get('/me', (req, res) => {
    try {
        const user = handleAuth({networkType: "evm" , signature: req.signature, message: req.message});
        if (!user){
            return "No user found. Register!";
        } else {
            return {user};
        }
    } catch (err) {
        return res.status(401).json({err});
    }
});

module.exports = router;
