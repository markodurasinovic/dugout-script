const argv = require('yargs').argv;
const Browser = require('./Browser');
const PlayerLoader = require('./PlayerLoader');

const homePage = 'https://www.dugout-online.com/';
const browser = new Browser();

async function main() {
    await browser.start(homePage);

    await login(argv.username, argv.password);
    await movePlayers(argv.to);
    
    browser.quit();
};

async function login(username, password) {
    console.log('Loging in as', username);

    await browser.fillField('input[name=do_user]', username);
    await browser.fillField('input[name=do_pass]', password);
    await browser.clickLink('input[value=Login]');
}

async function movePlayers(to) {
    const playerLoader = new PlayerLoader();
    const players = playerLoader.getPlayers(argv.path);
    
    await goToPlayersPage();
    if (to === 'youth') {
        await movePlayersToYouth(players);
    } else {
        await movePlayersToSenior(players);
    }
}

async function goToPlayersPage() {
    await browser.goToPage('Club');
    await browser.goToPage('Players');
}

async function movePlayersToYouth(playersToTransfer) {
    for (player of playersToTransfer) {
        if (player === '\n') {
            console.log('All players moved to youth')
            return;
        }
        await browser.goToPage(player);        
        await browser.clickLink('input[value="Move to youth"]');
        await browser.goToPage('Players');
    }    
}

async function movePlayersToSenior(playersToTransfer) {
    for (player of playersToTransfer) {
        if (player === '\n') {
            console.log('All players moved to senior');
            return;
        }
        await browser.clickLink('div[id="youth2"]');
        await browser.goToPage(player);
        await browser.clickLink('input[value="Move to 1st"]');
        await browser.goToPage('Players');
    }
}

main();
