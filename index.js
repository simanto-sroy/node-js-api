const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const movieRoute = require('./routes/movies');
const listRoute = require('./routes/lists');

dotenv.config();

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})  .then(() => console.log('Database Conected!'))
    .catch((err) => console.log(err.message))

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/lists", listRoute);

app.listen(8000, () => {
    console.log('Your server is runing')
});