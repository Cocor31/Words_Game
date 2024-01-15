/*************************/
/*** Import used modules */
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const DB = require("../db.config")
const User = DB.User

/**********************************/
/*** Unit route for Auth resource */

exports.signup = async (req, res) => {
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
        await User.create(req.body)
        return res.status(201).json({ message: 'User Created' })

    } catch (err) {
        res.status(500).json({ message: 'Internal Error' })
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body
    // Check data from request
    if (!email || !password) {
        return res.status(400).json({ message: 'Bad credentials' })
    }

    try {
        // Get admin
        let user = await User.findOne({ where: { email: email } })
        // Test si résultat
        if (user === null) {
            return res.status(404).json({ message: `This user does not exist !` })
        }
        // Password check  
        let test = await bcrypt.compare(password, user.password)
        if (!test) {
            return res.status(401).json({ message: 'Wrong password' })
        }

        // JWT generation
        const token = jwt.sign({
            payload: { userId: user.id, group: "user" }
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_DURING })

        return res.json({ access_token: token })
    } catch (err) {
        console.log(err)
    }
}

