/***********************************/
/*** Import des module nécessaires */
const express = require('express')
const userCtrl = require('../controllers/User')
const roleCheck = require("../middlewares/roleCheck")
const jwtCheck = require("../middlewares/jwtCheck")

const ROLES_LIST = JSON.parse(process.env.ROLES_LIST)

/***************************************/
/*** Récupération du routeur d'express */
let router = express.Router()

/*********************************************/
/*** Middleware pour logger dates de requete */


/**********************************/
/*** Routage de la ressource User */
router.get('/', jwtCheck, roleCheck(ROLES_LIST.modo, ROLES_LIST.admin), userCtrl.getAllUsers)

router.get('/:id([0-9]+)', jwtCheck, roleCheck(ROLES_LIST.user, ROLES_LIST.modo, ROLES_LIST.admin), userCtrl.getUser)

router.put('', jwtCheck, roleCheck(ROLES_LIST.modo, ROLES_LIST.admin), userCtrl.addUser)

router.patch('/:id([0-9]+)', jwtCheck, roleCheck(ROLES_LIST.modo, ROLES_LIST.admin, "owner"), userCtrl.updateUser)
router.delete('/:id([0-9]+)', jwtCheck, roleCheck(ROLES_LIST.admin), userCtrl.deleteUser)

router.get('/:id([0-9]+)/roles', userCtrl.getUserRoles)
router.put('/:id([0-9]+)/roles/:role', userCtrl.addUserRole)
router.delete('/:id([0-9]+)/roles/:role', userCtrl.deleteUserRole)
module.exports = router