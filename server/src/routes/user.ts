const express = require('express');
const zod = require('zod');
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export const userRoute = express.Router();

userRoute.get('/', (req:any, res:any) => {
    res.json({
        msg: 'On api/v1/user'
    });
});

const userZodVerify = zod.object({
    email: zod.string(),
    password: zod.string().min(3),
    name:zod.string().optional(),
    role: zod.string()
})

userRoute.post('/signup', async (req:any, res:any)=> {
    console.log(req.body);
    const verifyZod = userZodVerify.safeParse(req.body)
    if(!verifyZod.success){
        res.status(404).json({
            msg:"Zod cannot verify the data"
        })
        return;
    }
    const findUser = await prisma.user.findFirst({
        where: {
            email: req.body.email
        }
    })
    if(findUser != null){
        res.status(411).json({
            msg: "User already exist"
        })
        return;
    }
    
    try{
        const newUser = await prisma.user.create({
            data: {
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                role: req.body.role,
            }
        })
        const userDetails = {
            email: newUser.email,
            name: newUser.name,
            role: newUser.role
        }
        
        // generate token
        // token = jwt.sign(userDetails, process.env.JWT_SECRET)
        res.status(200).json({
            msg: "User Created",
            user: userDetails
        })
    } catch(err:any){
        res.status(411).json({
            msg:err.message
        })
        return;
    }
})