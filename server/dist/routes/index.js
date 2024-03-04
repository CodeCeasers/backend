"use strict";
const user_1 = require("./user");
const exp = require('express');
const router = exp.Router();
// Tesing Routes ==>
router.get("/", (req, res) => {
    res.json("On /api/v1");
});
router.use('/user', user_1.userRoute);
module.exports = router;
