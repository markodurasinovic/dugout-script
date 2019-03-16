const argv = require('yargs').argv;
const PlayerLoader = require('./PlayerLoader');
const puppeteer = require('puppeteer');
const Browser = require('./Browser');
const homePage = 'https://www.dugout-online.com/';

async function main(to) {
    let browser = new Browser(homePage);
    await browser.start(homePage);
    let page = await browser.getPage();

    await login(page, argv.username, argv.password);
    await goTo(page, 'Club');
    await goTo(page, 'Players');
    await movePlayers(page, to);
    
    browser.quit();
};

async function movePlayers(page, to) {
    let playerLoader = new PlayerLoader();
    let players = playerLoader.getPlayers(argv.path);
    
    if (to === 'youth') {
        await movePlayersToYouth(page, players);
    } else {
        await movePlayersToSenior(page, players);
    }
};

async function movePlayersToYouth(page, playersToTransfer) {
    for (player of playersToTransfer) {
        if (player === '\n') {
            return;
        }
        await goTo(page, player);        
        await clickLink(page, 'input[value="Move to youth"]');
        await goTo(page, 'Players');
    }    
    console.log('All players moved to youth')
};

async function movePlayersToSenior(page, playersToTransfer) {
    for (player of playersToTransfer) {
        if (player === '\n') {
            return;
        }
        await clickLink(page, 'div[id="youth2"]');
        await goTo(page, player);
        await clickLink(page, 'input[value="Move to 1st"]');
        await goTo(page, 'Players')
    }
    console.log('All players moved to senior')
};

async function login(page, username, password) {
    console.log('Loging in as', username);

    await fillField(page, 'input[name=do_user]', username);
    await fillField(page, 'input[name=do_pass]', password);
    await clickLink(page, 'input[value=Login]');
};

async function fillField(page, fieldToSelect, fillValue) {
    const field = await page.$(fieldToSelect);
    await field.click();
    await field.type(fillValue);
};

async function clickLink(page, fieldToSelect) {
    const field = await page.$(fieldToSelect);
    await field.click();
    await page.waitForNavigation();
};

async function goTo(page, pageName) {
    console.log('Going to', pageName, 'page');

    let link = getPage(page, pageName);
    link.then((res) => {
        if (res === null) {
            console.log('Page', pageName, 'could not be found');
            return false;
        }
        res.click();
    });
    await page.waitForNavigation();

    return true;
};

async function getPage(page, pageName) {
    const links = await page.$$('a');
    for (var i = 0; i < links.length; i++) {
        let valueHandle = await links[i].getProperty('innerText');
        let linkText = await valueHandle.jsonValue();
        if (linkText === pageName) {
            return links[i];
        }
    }
    return null;
};

main(argv.to);
