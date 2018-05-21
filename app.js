//Require the packages
const express = require('express');
const app = express();

//Loading Routes
const IndexRoute = require('./routes/index');

//Using Routes
app.use('/', IndexRoute);



//Starting Serv on PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});