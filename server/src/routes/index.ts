import { userRoute } from "./user";

const exp = require('express');
const router = exp.Router();

// Tesing Routes ==>
router.get("/", (req:any, res:any)=>{
    res.json("On /api/v1")
})

router.use('/user', userRoute);

export = router;