const router = require('express').Router();
const List = require('../models/Lists');
const verify = require('../verifyToken');

//Create List Data
router.post("/", verify, async (req, res) => {
    if(req.user.isAdmin) {
        const newList = new List(req.body);
        try{
            const saveList = await newList.save();
            res.status(201).json(saveList)
        }catch(err){
            res.status(500).json(err)
        }
    }else {
        res.status(403).json("you can are not allowed")
    }
});


//Delete List Data
router.delete("/:id", verify, async (req, res) => {
    if(req.user.isAdmin) {
        try{
            await List.findByIdAndDelete(req.params.id)
            res.status(201).json("The list has been deleted....")
        }catch(err){
            res.status(500).json(err)
        }
    }else {
        res.status(403).json("you can are not allowed")
    }
    
});


//Get List Data 
router.get("/", verify, async (req, res) => {
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = [];
    try {
        if (typeQuery) {
          if (genreQuery) {
            list = await List.aggregate([
              { $sample: { size: 10 } },
              { $match: { type: typeQuery, genre: genreQuery } },
            ]);
          } else {
            list = await List.aggregate([
              { $sample: { size: 10 } },
              { $match: { type: typeQuery } },
            ]);
          }
        } else {
          list = await List.aggregate([{ $sample: { size: 10 } }]);
        }
        res.status(200).json(list);
      } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
