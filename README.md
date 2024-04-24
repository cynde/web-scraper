# Website Scraper
This is a JavaScript project for scraping a website.

### What to do after clone
1. Install the dependencies: `npm install`
2. If you have your own running MongoDB database, change the database URL in [./config/db.config.js](./config/db.config.js).
3. If you don't have one, you can run a MongoDB container: `docker-compose up --build -d mongodb`
4. Run: `npm run scrape -- ['website name'] [website link] ['website description']`

    e.g: `npm run scrape -- 'Inland Revenue Department' https://www.ird.gov.hk/eng/ppr/arc.htm 'This is a description'`
