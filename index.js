const crypto = require('crypto'); 
const axios = require('axios');
const { JSDOM } = require('jsdom');
const db = require('./models');
const services = require('./services');
const Page = require('./classes/page.class');
const { getLinks, getMetadata, getDocumentDate } = require('./utils/htmlParser');

/*

DESCRIPTION 

The goal of this project is to scrape the content and metadata from a specific website. We want to be able to subsequently scrape the same website to monitor for content changes. 
We also want to monitor the scraping process and log any errors. 

Study the models and try to infer as much information as you can.  

SCRAPING FLOW  

First we create an entry for the website we want to scrape, keep in mind that this is a single unique entry for any website we want to scrape, act accordingly 

Then we create a Job entry, this is where we store information about the links gathered and the pages scraped 
We can refer to these Job objects for historical or troubleshooting reasons. 

Content objects are then created with the scraped page content,  we checksum the content and compare against existing content entries. 
We commit new or modified content to the database while keeping the previous content in database.  Page objects store a reference to the content, not the actual content itself.   

SUGGESTED LIBRARIES 

Axios 
JSDOM 

WEBSITE ( refer to the included png files for content to scrape )

Gather Links on https://www.ird.gov.hk/eng/ppr/arc.htm

Example of Link to be scraped https://www.ird.gov.hk/eng/ppr/advance13.htm


*/

const calculateChecksum = (content) => {
	return crypto.createHash('md5').update(content).digest('hex');
};

const createContent = async (url, website, parentDocument = null) => {
	try {
		const { data } = await axios.get(url);
		const { window: { document } } = new JSDOM(data);
		const { title } = document;

		const documentType = 'html';
		const metadata = getMetadata(document);
		const content = document.body.textContent.trim();
		const date = getDocumentDate(document);
		const checksum = calculateChecksum(content);
		return await services.content.create({ url, title, documentType, parentDocument, metadata, website, content, date, checksum });
	} catch (error) {
		throw error;
	}
};

const createWebsite = async (name, url, description) => {
	let website = await services.website.findOneByUrl(url);
	return website || await services.website.create({ name, url, description });
};

const scrapeLinks = async (links) => {
	await Promise.all(links.map(async (link, index) => {
		try {
			const newProgress = {
				phase: 'links',
				current: `${index + 1} / ${links.length}`
			}
			await services.job.updateProgressById(currentJobId, newProgress);

			const { _id: contentId, title } = await createContent(link, website, parentDocument);
			const page = { url: link, title, content: contentId };
			await services.job.addScrapedPage(currentJobId, new Page(page));
		} catch (error) {
			throw error;
		}
	}));
};
 
const scrapeWebsite = async (name, url, description) => {
	try {
		const website = await createWebsite(name, url, description);

		const links = getLinks(document);
		const jobObject = {
			website,
			links,
			progress: {
				phase: 'pages'
			}
		};
		const { _id: currentJobId } = await services.job.create(jobObject);

		const { _id: contentId, title } = await createContent(url, website);
		const parentDocumentPage = { url, title, content: contentId };
		await services.job.addScrapedPage(currentJobId, new Page(parentDocumentPage));

		await scrapeLinks(links);

		await services.job.updateStatusById(currentJobId, 'finished');
	} catch (error) {
		console.error(`Error scrapping the website: ${error.toString()}`);
		await services.job.updateStatusById(currentJobId, 'error');
		const newError = {
			code: error.code || 'unknown', message: error.message
		};
		await services.job.updateErrorById(currentJobId, newError);
	} finally {
		await services.job.updateEndTimeById(currentJobId);
	}
};

const init = async () => {
	await db.mongoose.connect(db.url); 
	console.log('Database connected');

	if (process.argv.length < 5) {
		db.mongoose.connection.close();
		return console.log('Error: Website name, url, and description must be provided in the arguments');
	}

	const name = process.argv[2];
	const url = process.argv[3]
	const description = process.argv[4]
	await scrapeWebsite(name, url, description);
	db.mongoose.connection.close();
};

init();