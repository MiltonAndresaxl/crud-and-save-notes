const {Router}= require('express')
const router = Router()
const  Users= require('../models/Users')
const c = console.log
const passport= require('passport')
router.get('/users/signin', (req, res)=>{
    res.render('users/signin')
})
router.post('/user/signin', passport.authenticate('local', {
    successRedirect:'/notes/all-notes',
    failureRedirect: '/users/signin',
    failureFlash:true
}))

router.get('/users/signup', (req, res)=>{
    res.render('users/signup')
})
router.post('/users/signup', async (req, res)=>{
   const {name, email, password, confirm_password}=req.body
   const errors = []
   if(name.length <= 0 ){errors.push({text: 'please insert your Name'})}
   if(password != confirm_password){
    errors.push({text: 'password do not match'})
   }
   if(password.length  <5 ){errors.push({text: 'password must be at least 4 characters'})}
   if(errors.length > 0 ){
       res.render('users/signup', {errors, name, email, password, confirm_password})
   }else{
     const emailUser = await Users.findOne({email: email})
     if(emailUser){
        req.flash('error_msg', 'The Email is already in use')
        res.redirect('/users/signup')
     }
        const newUser = await new Users({name, email, password})
        newUser.password= await newUser.encryptPassword(password)
        await newUser.save()
        req.flash('success_msg', 'You are resgistered')
        res.redirect('/users/signin')
     
      
   }
})
router.get('/users/logout', (req,res)=>{
    req.logOut();
    res.redirect('/')
})
module.exports = router