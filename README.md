# Puppeteer Scraper Project

## Project Overview

This project is a private web scraping tool built using Node.js and Puppeteer. The tool allows users to scrape data from web pages by providing a URL. The project uses TypeScript for better type safety and Express.js to set up a simple web server for handling requests.

## Project Structure

The project directory structure is as follows:

.
├── src
│ ├── index.ts
│ └── scraper.ts
├── .gitignore
├── package.json
├── readme.txt
├── tsconfig.json

- **src/index.ts**: Entry point of the application where the Express server is configured.
- **src/scraper.ts**: Contains the logic for scraping web pages using Puppeteer.
- **.gitignore**: Specifies files and directories to be ignored by Git.
- **package.json**: Contains the project's metadata, scripts, and dependencies.
- **readme.txt**: Placeholder for the README file.
- **tsconfig.json**: Configuration file for TypeScript compiler.

## Prerequisites

- Node.js v18.16.0 or later
- npm (Node Package Manager)

## Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd <repository-directory>

   ```

2. Install the dependencies:
   sudo apt-get update && \
   sudo apt-get install -y wget curl gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils

   npm install

Building the Project

To compile the TypeScript files into JavaScript, run:
npm run build

The compiled files will be located in the dist directory.

Running the Project

To start the Express server, run:
npm start

The server will start on the port specified in your index.ts file.

Usage:
Make a POST request to the server with a JSON payload containing the URL to scrape.
The server will return the scraped data in JSON format.

Puppeteer for headless browser automation
Express.js for web server framework

Note: Restarting the EC2 instance is necessary to handle the browser session correctly.