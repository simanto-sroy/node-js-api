const router = require('express').Router();
const User = require('../models/Users');
const CryptoJS = require('crypto-js');
const verify = require('../verifyToken');

//Update User
router.put("/:id", verify, async (req, res) => {
    if(req.user.id === req.params.id || req.user.isAdmin) {
        if(req.body.password){
            req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString();
        }
        try {
            const updateUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            },{new: true})
            res.status(200).json(updateUser);
        }catch(err) {
            res.status(500).json(err)
        }
    }else {
        res.status(403).json("you can update your account only")
    }
    
});

//Delete User
router.delete("/:id", verify, async (req, res) => {
    if(req.user.id === req.params.id || req.user.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(201).json("User has been deleted...");
        }catch(err) {
            res.status(500).json(err)
        }
    }else {
        res.status(403).json("you can delete your account only")
    }  
});


//Find User
router.get("/find/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id);
        const {password, ...info} = user._doc;
        res.status(201).json(info);
    }catch(err) {
        res.status(500).json(err)
    }
});


//Find All User
router.get("/", verify, async (req, res) => {
    const query = req.query.new
    if(req.user.isAdmin) {
        try {
            const users = query ? await User.find().sort({_id: 1}).limit(10) : await User.find();
            res.status(201).json(users);
        }catch(err) {
            res.status(500).json(err)
        }
    }else {
        res.status(403).json("you are not allowed see all users")
    }  
});


//Get Users Stats
router.get("/stats", async (req, res) => {
    const today = new Date();
    const latYear = today.setFullYear(today.setFullYear() - 1);
  
    try {
      const data = await User.aggregate([
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
});

module.exports = router;