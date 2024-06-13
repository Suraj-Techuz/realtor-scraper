import puppeteer from 'puppeteer';

interface TableRow {
    business_name: string;
    cea_number: string;
    estateAgentName?: string;
    available: boolean;
}

const scrapeWithPuppeteer = async (url: string): Promise<{ available: boolean; scraperWorking: boolean } | TableRow[]> => {
    let browser;
    try {
        console.log('Launching browser...');
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        console.log(`Navigating to URL: ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });

        const divSelector = 'div.xb-table-wrapper.custom-link';
        console.log(`Waiting for selector: ${divSelector}`);
        const tableWrapper = await page.waitForSelector(divSelector, { timeout: 10000 }).catch(() => null);

        if (!tableWrapper) {
            console.log('Table wrapper not found, returning not available.');
            await browser.close();
            return { available: false, scraperWorking: true };
        }

        console.log('Table wrapper found, extracting data...');
        const tableData: TableRow[] = await page.evaluate((selector) => {
            const rows = Array.from(document.querySelectorAll(`${selector} table tbody tr`));
            return rows.map((row) => {
                const cells = row.querySelectorAll('td');
                return {
                    business_name: cells[0]?.querySelector('.cell-text')?.textContent?.trim() || '',
                    cea_number: cells[1]?.querySelector('.cell-text')?.textContent?.trim() || '',
                    estateAgentName: cells[2]?.querySelector('.cell-text')?.textContent?.trim() || '',
                    available: true,
                };
            });
        }, divSelector);

        console.log('Data extracted:', tableData);
        await browser.close();
        return tableData;
    } catch (error) {
        if (browser) await browser.close();
        console.error('Error scraping with Puppeteer:', error);
        return { available: false, scraperWorking: false };
    }
};

export default { scrapeWithPuppeteer };
