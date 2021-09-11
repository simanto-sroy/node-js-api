const router = require('express').Router();
const Movie = require('../models/Movie');
const verify = require('../verifyToken');

//Create Movie Data
router.post("/", verify, async (req, res) => {
    if(req.user.isAdmin) {
        const newMovie = new Movie(req.body);
        try{
            const saveMovie = await newMovie.save();
            res.status(201).json(saveMovie)
        }catch(err){
            res.status(500).json(err)
        }
    }else {
        res.status(403).json("you can are not allowed")
    }
    
});


//Updated Movie Data
router.put("/:id", verify, async (req, res) => {
    if(req.user.isAdmin) {
        try{
            const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            },{new: true});
            res.status(200).json(updatedMovie)
        }catch(err){
            res.status(500).json(err)
        }
    }else {
        res.status(403).json("you can are not allowed")
    }
    
});


//Delete Movie Data
router.delete("/:id", verify, async (req, res) => {
    if(req.user.isAdmin) {
        try{
            await Movie.findByIdAndDelete(req.params.id);
            res.status(200).json("This Movie is deleted...")
        }catch(err){
            res.status(500).json(err)
        }
    }else {
        res.status(403).json("you can are not allowed")
    }
    
});


//Get Movie Data
router.get("/:id", verify, async (req, res) => {
    if(req.user.isAdmin) {
        try{
            const movie = await Movie.findById(req.params.id);
            res.status(200).json(movie)
        }catch(err){
            res.status(500).json(err)
        }
    }else {
        res.status(403).json("you can are not allowed")
    } 
});


//Get Random Movie Data
router.get("/random", verify, async (req, res) => {
    const type = req.query.type;
    let movie;
    try {
      if (type === "series") {
        movie = await Movie.aggregate([
          { $match: { isSeries: true } },
          { $sample: { size: 1 } },
        ]);
      } else {
        movie = await Movie.aggregate([
          { $match: { isSeries: false } },
          { $sample: { size: 1 } },
        ]);
      }
      res.status(200).json(movie);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

//Get All Movie Data 
router.get("/", verify, async (req, res) => {
    if (req.user.isAdmin) {
      try {
        const movies = await Movie.find();
        res.status(200).json(movies.reverse());
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("You are not allowed!");
    }
});

module.exports = router;