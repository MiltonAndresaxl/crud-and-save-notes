const {Router}= require('express')
const router = Router()
const Note = require('../models/Notes')
const {isAuthenticated} = require('../helpers/auth')
// ingresa a la pagina donde se agregan las notas
router.get('/notes/new-note', isAuthenticated,  (req, res)=>{
    res.render('notes/newNote')
})
// con este metodo post, se utiliza para agregar las notas y validar dichos datos
router.post('/notes/added', isAuthenticated, async (req, res)=>{
    const {title, description}=req.body
    const errors = []
// se agregan a un array dichos errores por si no los escribe 
    if(!title){
        errors.push({text:'please write a title'})
    }
    if(!description){
        errors.push({text:'please write a description'})
    }
// verifica si en el array no hay ninguna variable de error
    if(errors.length > 0){
        res.render('notes/newNote', {
            errors,
            title,
            description
        })
        // si no encuentra ningun error este guarda en la base datos 
        //  Y redirreciona hacia la pagina donde estan todas las notas
        // se utilizan los async await para una mejor respuesta de la db y no se quede en una sola
    }else{
       const newNote =  new Note({title, description})
       newNote.user =req.user.id
       await  newNote.save()
       req.flash('success_msg', 'Note Added successfully')
       res.redirect('/notes/all-notes')
    }
    
})
   // Este hace publica todas notas ordenadas por fecha de creacion dando visualizacion a ellas
router.get('/notes/all-notes', isAuthenticated, async (req, res)=>{
    // se hace la busqueda en la base datos por medio de la variable llamada (Note)
    const   cnotes = await Note.find({user: req.user.id}).sort({date:'desc'})
    res.render('notes/all-notes', {cnotes})
})
// esta redireciona a la pagina donde se va a editar 
router.get('/notes/edit/:id', isAuthenticated, async  (req, res)=>{
    const cnotes =  await Note.findById(req.params.id)
    res.render('notes/edit-note', {cnotes})
})
// este metodo put actualiza los datos en la db donde se editaron 
router.put('/notes/edit-note/:id', isAuthenticated, async  (req, res)=>{
    const   {title, description} = req.body
    await Note.findByIdAndUpdate(req.params.id, {title, description})
    // este flash da mensajes
    req.flash('success_msg', 'Note edited successfully')
    res.redirect('/notes/all-notes')
})
// se encarga de eliminar las tarjetas seleccionados
router.delete('/notes/delete/:id', isAuthenticated, async (req, res)=>{
    await Note.findByIdAndDelete(req.params.id)
    req.flash('success_msg', 'Note Deleted successfully')
    res.redirect('/notes/all-notes')
})
module.exports = router;