import express, { Request, Response } from 'express';
import scraper from './scraper';

const app = express();
const port = 3000;

app.use(express.json());

const queue: { req: Request; res: Response }[] = [];
const maxConcurrentRequests = 2;
let activeRequests = 0;

const processQueue = async () => {
    if (queue.length === 0 || activeRequests >= maxConcurrentRequests) {
        return;
    }
    const { req, res } = queue.shift()!;
    activeRequests++;
    const { url } = req.body;
    const startTime = new Date();
    try {
        const data = await scraper.scrapeWithPuppeteer(url);
        const endTime = new Date();
        const timeTaken = endTime.getTime() - startTime.getTime();
        res.send({ data, timeTaken: `${timeTaken}ms` });
    } catch (error) {
        console.error(new Date(), `Error processing request for URL: ${url}`, error);
        res.status(500).send({ error: 'Failed to scrape the data' });
    } finally {
        activeRequests--;
        const endTime = new Date();
        const timeTaken = endTime.getTime() - startTime.getTime();
        console.log(new Date(), `Finished processing request for URL: ${url}. Time taken: ${timeTaken}ms`);
        processQueue();
    }
};

app.post('/scrape', (req: Request, res: Response) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).send({ error: 'URL is required' });
    }
    console.log(new Date(), `Request arrived with URL: ${url}`);
    queue.push({ req, res });
    processQueue();
});

app.listen(port, () => {
    console.log(new Date(), `Server is running on http://localhost:${port}`);
});
