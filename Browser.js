const puppeteer = require('puppeteer');

module.exports = class Browser {
    constructor(homePage) {
        this.start(homePage);
    }

    async start(homePage) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(homePage);

        this.browser = browser;
        this.page = page;
    }

    quit() {
        console.log('Closing the browser!');

        this.browser.close();
        process.exit(0);
    }

    getPage() {
        if (this.page === undefined) {
            console.log('Critical error: Browser failed to find page');
            process.exit(1);
        }

        return this.page;
    }
}