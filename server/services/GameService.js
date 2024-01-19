
const getWordHit = (Word) => {
    // To replace by fetch API
    let hit
    switch (Word) {
        case "con":
            hit = 10
            break;
        case "salope":
            hit = 30
            break;
        case "pute":
            hit = 40
            break;
        default:
            hit = 0
            break;
    }

    return hit;
}

const hitOpponentsUsers = (users, socketIdSender, hitWord) => {
    users.forEach(user => {
        if (user.socketID !== socketIdSender) {
            user.score = user.score - hitWord
            if (user.score < 0) {
                user.score = 0
            }
        }
    });
    console.log(users);
    return users

}

const addUserToGroup = (users, data) => {
    users.push(
        {
            ...data,
            score: 100
        }
    );
    console.log(users);
    return users
}

const deleteUserFromGroup = (users, socketIdUser) => {
    users = users.filter((user) => user.socketID !== socketIdUser);
    console.log(users);
    return users
}

const GameService = {}
GameService.getWordHit = getWordHit
GameService.hitOpponentsUsers = hitOpponentsUsers
GameService.addUserToGroup = addUserToGroup
GameService.deleteUserFromGroup = deleteUserFromGroup


module.exports = GameService