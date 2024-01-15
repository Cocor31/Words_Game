/***********************************/
/*** Import des module nécessaires */
const express = require('express')
const authCtrl = require('../controllers/Auth')

/***************************************/
/*** Récupération du routeur d'express */
let router = express.Router()

/*********************************************/
/*** Middleware pour logger dates de requete */


/**********************************/
/*** Routage de la ressource Auth */
router.post('/signup', authCtrl.signup)
router.post('/login', authCtrl.login)

module.exports = router