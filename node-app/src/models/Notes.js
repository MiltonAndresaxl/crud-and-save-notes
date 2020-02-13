const mongoose =  require('mongoose')
const {Schema} = mongoose
// utiliza el schema para crear nuevos pack mandando los atributos y las entradas de datos 
//que se utilizan y los tipos de datos que se guardaran en la base de datos. 
//Esquema para las notas
// 
const NoteSchema = new Schema({
    title: {type: String, require:true},
    description: {type: String, require:true},
    date:{type: Date, default: Date.now},
    user: {type: String}
})

module.exports = mongoose.model('Note', NoteSchema)