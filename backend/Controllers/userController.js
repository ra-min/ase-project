const userModel=require("../Models/userModel")
const bcrypt = require("bcrypt")
const validator = require("validator")
const jwt =require ("jsonwebtoken")
const { isValidObjectId } = require("mongoose")

const createToken = (_id)=>{
    const jwtkey=process.env.JWT_SECRET_KEY

    return jwt.sign({_id},jwtkey,{expiresIn:"3d"})
}

const registerUser= async(req,res)=>{
    console.log(req.body)
    
    try{
        const {name,email,password}=req.body

        let user=await userModel.findOne({email})
        if (user){
            return res.status(400).json("user with this email already exist ...")
    
        }
        if ( !name || !email || !password){
            return res.status(400).json("All fields are required...")
        }
        if (!validator.isEmail(email)){
            return res.status(400).json("Email must be valid eamil")
    
        }
        if (!validator.isStrongPassword(password)){
            return res.status(400).json("passwrod must be a strong password...")
        }
        user=userModel({name,email,password})
        const salt = await bcrypt.genSalt(10)
        console.log(salt)
        user.password=await bcrypt.hash(user.password,salt)
        await user.save()
    
        const token = createToken(user._id)
        
        res.status(200).json({_id:user._id,name,email,token}) 
    }catch(error){
        console.log(error)
        res.status(500).json("error")
    }
    
}

const loginUser= async(req,res)=>{
    console.log(req.body)
    try{
    const {email,password} = req.body

    const user=await userModel.findOne({email})

    if(!user){
        return res.status(400).json("Invalid email or password...")
    }
    isValidPassword= await bcrypt.compare(password,user.password)

    if(!isValidPassword){
        return res.status(400).json("Invalid email or password...")
    }

    const token=createToken(user._id)
    res.status(200).json({_id:user._id,name:user.name,email,token}) 
}catch(error){
    console.log(error)
    res.status(500).json(error)


}}


const findUser= async (req,res)=>{
    const userId=req.params.userId
    try{
        const user=await userModel.findById(userId)
        if (!user){
            return res.status(400).json("user with this id is not exist ...")
        }
        res.status(200).json(user)
    }catch(error){
        console.log(error)
        res.status(500).json(error)

    }}



const getUsers= async (req,res)=>{
    try{
        const user=await userModel.find()
        res.status(200).json(user)
    }catch(error){
        console.log(error)
        res.status(500).json(error)
    
    }}

module.exports={registerUser,loginUser,findUser,getUsers}