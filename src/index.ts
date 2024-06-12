import express, { Request, Response } from 'express';
import scraper from './scraper';

const app = express();
const port = 3000;

app.use(express.json());

const queue: { req: Request; res: Response }[] = [];
const maxConcurrentRequests = 5;
let activeRequests = 0;

const processQueue = async () => {
    if (queue.length === 0 || activeRequests >= maxConcurrentRequests) {
        return;
    }

    const { req, res } = queue.shift()!;
    activeRequests++;

    const { url } = req.body;
    console.log(`Processing request for URL: ${url}`);

    try {
        const data = await scraper.scrapeWithPuppeteer(url);
        res.send(data);
    } catch (error) {
        console.error('Error in /scrape route:', error);
        res.status(500).send({ error: 'Failed to scrape the data' });
    } finally {
        activeRequests--;
        processQueue();
    }
};

app.post('/scrape', (req: Request, res: Response) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).send({ error: 'URL is required' });
    }

    queue.push({ req, res });
    processQueue();
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
