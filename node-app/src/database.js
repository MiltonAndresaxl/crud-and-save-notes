// realiza la conexion con la base de datos de mongodb

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/notes-db-app', {
    useCreateIndex:true,
    useNewUrlParser:true,
    useFindAndModify:false,
    useUnifiedTopology:true
})

.then(db => console.log('Connect to mongoDB'))
.catch(err =>  console.log('error to connect mongoDB'))