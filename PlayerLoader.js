const fs = require('fs');

module.exports = class PlayerLoader {
    getPlayers(path) {
        let players = this.loadPlayersFile(path);

        return players.split(',');
    }

    loadPlayersFile(path) {
        if (fs.existsSync(path)) {
            return fs.readFileSync(path, {encoding: 'utf8'});
        } else {
            console.log("File at", path, "does not exist.\nExiting now.");
            process.exit(1);
        }
    }
}

