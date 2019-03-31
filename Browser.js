const puppeteer = require('puppeteer');

module.exports = class Browser {
    async start(homePage) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(homePage);

        this.browser = browser;
        this.page = page;
    }

    async goToPage(pageName) {
        console.log('Going to', pageName, 'page');

        const link = this.getPage(pageName);
        link.then((res) => {
            if (res === null) {
                console.log('Page', pageName, 'could not be found');
                process.exit(1);
            }
            res.click();
        });
        await this.page.waitForNavigation();
    }

    async getPage(pageName) {
        const links = await this.page.$$('a');
        for (var i = 0; i < links.length; i++) {
            const valueHandle = await links[i].getProperty('innerText');
            const linkText = await valueHandle.jsonValue();
            if (linkText === pageName) {
                return links[i];
            }
        }
        return null;
    }

    async clickLink(fieldToClick) {
        const field = await this.page.$(fieldToClick);
        await field.click();
        await this.page.waitForNavigation();
    }

    async fillField(fieldToFill, fillValue) {
        const field = await this.page.$(fieldToFill);
        await field.click();
        await field.type(fillValue);
    }

    quit() {
        console.log('Closing the browser!');

        this.browser.close();
        process.exit(0);
    }
}