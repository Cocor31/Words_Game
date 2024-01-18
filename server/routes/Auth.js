/***********************************/
/*** Import des module nécessaires */
const express = require('express')
const authCtrl = require('../controllers/Auth')
const userCtrl = require('../controllers/User')

/***************************************/
/*** Récupération du routeur d'express */
let router = express.Router()

/*********************************************/
/*** Middleware pour logger dates de requete */


/**********************************/
/*** Routage de la ressource Auth */
router.post('/signin', userCtrl.addUser)
router.post('/login', authCtrl.login)

module.exports = router