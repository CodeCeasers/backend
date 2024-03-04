const express = require('express');
const zod = require('zod');
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JSON_WEB_TOKEN_SECRET;

export const userRoute = express.Router();

userRoute.get('/', (req:any, res:any) => {
    res.json({
        msg: 'On api/v1/user'
    });
});

const userZodVerify = zod.object({
    email: zod.string().min(3),
    password: zod.string().min(3),
    name:zod.string(),
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
        
        const token = jwt.sign(userDetails, JWT_SECRET)
        res.status(200).json({
            msg: "User Created",
            user: userDetails,
            token: token
        })
    } catch(err:any){
        res.status(411).json({
            msg:err.message
        })
        return;
    }
})

const userSigninZodVerify = zod.object({
    email: zod.string(),
    password: zod.string().min(3)
})


userRoute.post('/signin', async (req:any, res:any)=> {
    console.log(req.body);
    const verifyZod = userSigninZodVerify.safeParse(req.body)
    if(!verifyZod.success){
        res.status(404).json({
            msg:"Zod cannot verify the data"
        })
        return;
    }
    try{
        const findUser = await prisma.user.findFirst({
            where: {
                email: req.body.email
            }
        })
        if(findUser != null){
            const token = jwt.sign({email: findUser.email, name: findUser.name, role: findUser.role}, JWT_SECRET);
            res.status(200).json({
                msg: "User Signin",
                user: findUser,
                token: token
            })
            return;
        }
    } catch(err:any){
        res.status(411).json({
            msg:err.message
        })
        return;
    }
    res.status(411).json({
        msg: "User does not exist"
    })
});
