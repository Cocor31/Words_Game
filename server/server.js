/*************************/
/*** Import used modules */
const http = require('./socket')

const SERVER_PORT = process.env.SERVER_PORT || 4000

let DB = require('./db.config')



/*** Démarrage de l'API*/
DB.sequelize.authenticate()
    .then(() => console.log('MariaDB Connexion OK'))
    .then(() => {
        http.listen(SERVER_PORT, () => {
            console.log(`Server listening on ${SERVER_PORT}`);
        });
    })
    .catch(e => console.log('Database Error', e))
