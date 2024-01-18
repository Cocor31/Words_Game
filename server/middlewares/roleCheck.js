const roleCheck = (...authRoles) => {
    return (req, res, next) => {

        if (!req?.roles) {
            return res.sendStatus(403)
        }

        const userRolesChecks = req.roles.map(role => authRoles.includes(role))
        const isAutorized = userRolesChecks.find(val => val === true)

        if (!isAutorized) {
            // S'il y a un autorisation owner on regarde si le user est le propriétaire de la donnée
            if (authRoles.includes("owner")) {
                const pid = parseInt(req.params.id)
                const userId = req.userID
                if (userId != pid) {
                    return res.sendStatus(403)
                }
            } else {
                return res.sendStatus(403)
            }
        }

        next()
    }
}
module.exports = roleCheck