/***********************************/
/*** Import des module nécessaires */
const bcrypt = require('bcrypt')
const DB = require('../db.config')
const User = DB.User


/**********************************/
/*** Routage de la ressource User */

exports.getAllUsers = (req, res) => {
    User.findAll()
        .then(users => res.json({ data: users }))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.getUser = async (req, res) => {
    let pid = parseInt(req.params.id)

    try {
        // Récupération de l'utilisateur et vérification
        let user = await User.findOne({ where: { id: pid } })
        if (user === null) {
            return res.status(404).json({ message: 'This user does not exist !' })
        }

        return res.json({ data: user })
    } catch (err) {
        return res.status(500).json({ message: 'Database Error', error: err })
    }
}

exports.addUser = async (req, res) => {
    const { firstname, lastname, email, password } = req.body

    // Validation des données reçues
    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ message: 'Missing Data' })
    }

    try {
        // Vérification si l'utilisateur existe déjà
        const user = await User.findOne({ where: { email: email }, raw: true })
        if (user !== null) {
            return res.status(409).json({ message: `This email is already associated with a user !` })
        }

        // Hashage du mot de passe utilisateur
        let hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
        req.body.password = hash

        // Céation de l'utilisateur
        let userc = await User.create(req.body)
        return res.status(201).json({ message: 'User Created', data: userc })

    } catch (err) {
        if (err.name == 'SequelizeDatabaseError') {
            res.status(500).json({ message: 'Database Error', error: err })
        }
        res.status(500).json({ message: 'Hash Process Error', error: err })
    }
}

exports.updateUser = async (req, res) => {
    let pid = parseInt(req.params.id)
    const { firstname, lastname, email, password } = req.body

    try {
        // Recherche de l'utilisateur et vérification
        let user = await User.findOne({ where: { id: pid }, raw: true })
        if (user === null) {
            return res.status(404).json({ message: 'This user does not exist !' })
        }

        // récupération des données
        let userp = {}
        if (firstname) { userp.firstname = firstname }
        if (lastname) { userp.lastname = lastname }
        if (email) { userp.email = email }
        if (password) {
            // Password Hash
            let hash = await bcrypt.hash(password, parseInt("process.env.BCRYPT_SALT_ROUND"))
            userp.password = hash
        }

        // Mise à jour de l'utilisateur
        await User.update(userp, { where: { id: pid } })
        return res.json({ message: 'User Updated', data: { ...user, ...userp } })
    } catch (err) {
        return res.status(500).json({ message: 'Database Error', error: err })
    }
}

exports.deleteUser = async (req, res) => {
    let pid = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!pid) {
        return res.status(400).json({ message: `Missing Parameter` })
    }

    try {
        // Suppression
        let count = await User.destroy({ where: { id: pid } })
        // Test si résultat
        if (count === 0) {
            return res.status(404).json({ message: `This user does not exist !` })
        }
        // Message confirmation Deletion
        return res.status(200).json({ message: `User (id: ${pid} ) Successfully Deleted. ${count} row(s) deleted` })

    } catch (err) {
        return res.status(500).json({ message: `Database Error`, error: err })
    }
}