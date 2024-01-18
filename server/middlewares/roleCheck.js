const roleCheck = (...authRoles) => {
    return (req, res, next) => {

        if (!req?.roles) {
            return res.sendStatus(403)
        }

        const userRolesChecks = req.roles.map(role => authRoles.includes(role))
        const isAutorized = userRolesChecks.find(val => val === true)

        if (!isAutorized) {
            return res.sendStatus(403)
        }

        next()
    }
}
module.exports = roleCheck