const puppeteer = require('puppeteer');
const argv = require('yargs').argv;
const homePage = 'https://www.dugout-online.com/';

async function main(to) {
    let browserData = await startBrowser(homePage);
    let page = await browserData[0];
    let browser = await browserData[1];
  
    await login(page, getUsername(), getPassword());
    await goTo(page, 'Club');
    await goTo(page, 'Players');
    await movePlayers(page, to);
    
    await closeBrowser(browser);
};

async function startBrowser(homePage) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(homePage);

    return [page, browser];
};

async function movePlayers(page, to) {
    if (to === 'youth') {
        await movePlayersToYouth(page);
    } else {
        await movePlayersToSenior(page);
    }
};

async function movePlayersToYouth(page) {
    for (player of playersToTransfer) {
        await goTo(page, player);
        await clickLink(page, 'input[value="Move to youth"]');
        await goTo(page, 'Players');
    }
};

// async function movePlayersToSenior(page) {
//     for (player of playersToTransfer) {
//         await
//     }
// };

function getUsername() {
    return argv.username;
};

function getPassword() {
    return argv.password;
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
        res.click();
    });
    await page.waitForNavigation();
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

async function closeBrowser(browser) {
    console.log('Closing the browser!');

    await browser.close();
};

main(argv.to);
