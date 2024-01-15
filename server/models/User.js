/*************************/
/*** Import used modules */
const { DataTypes } = require('sequelize')

/*************************/
/*** Import used modules */
module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER(10),
            primaryKey: true,
            autoIncrement: true
        },
        firstname: {
            type: DataTypes.STRING(100),
            defaultValue: '',
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING(100),
            defaultValue: '',
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true,             // Ici une contrainte de données
            },
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(64),
            is: /^[0-9a-f]{64}$/i,        // Ici une contrainte de données
            allowNull: false
        },
    })
    return User
}