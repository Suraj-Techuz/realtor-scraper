import puppeteer, { Browser, Page } from 'puppeteer';

interface TableRow {
    business_name: string;
    cea_number: string;
    estateAgentName?: string;
    available: boolean;
    profile_id?: string;
}

let browser: Browser | null = null;
let firstRequest = true;

const initializeBrowser = async (): Promise<void> => {
    if (!browser) {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }
};

const scrapeWithPuppeteer = async (url: string): Promise<{ available: boolean; scraperWorking: boolean } | TableRow[]> => {
    if (!browser) {
        await initializeBrowser();
    }

    let page: Page | null = null;
    let profileId: string | null = null;

    try {
        if (!browser) {
            throw new Error('Browser is not initialized');
        }

        page = await browser.newPage();

        page.on('response', async (response) => {
            if (response.url().includes('https://www.cea.gov.sg/aceas/api/internet/profile/v2/public-register/filter')) {
                try {
                    const jsonResponse = await response.json();
                    profileId = jsonResponse?.data?.[0]?.id || null;
                } catch (error) {
                    console.error(error)
                }
            }
        });

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });

        const divSelector = 'div.xb-table-wrapper.custom-link';
        const tableWrapper = await page.waitForSelector(divSelector, { timeout: 10000 }).catch(() => null);

        if (!tableWrapper) {
            await page.close();
            return { available: false, scraperWorking: true };
        }
        if (profileId) { profileId = `https://www.cea.gov.sg/aceas/api/internet/profile/v2/public-register/${profileId}/photo` }
        const tableData: TableRow[] = await page.evaluate((selector: string, profileId: string | null) => {
            const rows = Array.from(document.querySelectorAll(`${selector} table tbody tr`));
            return rows.map((row) => {
                const cells = row.querySelectorAll('td');
                return {
                    business_name: cells[0]?.querySelector('.cell-text')?.textContent?.trim() || '',
                    cea_number: cells[1]?.querySelector('.cell-text')?.textContent?.trim() || '',
                    estateAgentName: cells[2]?.querySelector('.cell-text')?.textContent?.trim() || '',
                    available: true,
                    profile_id: profileId || ''
                };
            });
        }, divSelector, profileId);

        if (!firstRequest) {
            await page.close();
        } else {
            firstRequest = false;
        }

        return tableData;
    } catch (error) {
        if (page) {
            await page.close();
        }
        return { available: false, scraperWorking: false };
    }
};

const closeBrowser = async (): Promise<void> => {
    if (browser) {
        await browser.close();
        browser = null;
    }
};

export { scrapeWithPuppeteer, closeBrowser };
