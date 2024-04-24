const crypto = require('crypto'); 
const util = require('util'); 
const axios = require('axios');
const { JSDOM } = require('jsdom');
const db = require('./models');
const services = require('./services');
const Page = require('./classes/page.class');

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

const parseMetadata = (document) => {
	const metaTags = document.head.getElementsByTagName('meta');
	const metadata = [];
		
	for (const metaTag of metaTags) {
		const name = metaTag.getAttribute('name');
		const content = metaTag.getAttribute('content');
	  
		if (name) {
			metadata.push({ name, content });
		}
	}

	return metadata;
};

const extractLinks = (document) => {
	const links = [];
	const tables = document.querySelectorAll('table');
	tables.forEach((table) => {
		const tableBody = table.querySelector('tbody');
		const rows = tableBody.querySelectorAll('tr');
		rows.forEach((row) => {
			const anchor = row.querySelector('a');
			if (anchor && anchor.getAttribute('href').startsWith('/eng/ppr/')) {
			  	links.push(anchor.getAttribute('href'));
			}
		});
	});

	return links;
};

const getDate = (document) => {
	const dateElement = document.getElementById('lastUpdatedDate');
	if (dateElement) {
		const textContent = dateElement.value.split(' ')[0].split('-');
		const date = new Date(textContent);
		return date;
	} else {
		console.error('Date element in the website content not found');
		return null;
	}
};

const calculateChecksum = (content) => {
	return crypto.createHash('md5').update(content).digest('hex');
};

const scrapeContent = async (url, document, website, parentDocument = null) => {
	try {
		const title = document.title;
		const documentType = 'html';
		const metadata = parseMetadata(document);
		const content = document.body.textContent.trim();
		const date = getDate(document);
		const checksum = calculateChecksum(content);
		return await services.content.create({ url, title, documentType, parentDocument, metadata, website, content, date, checksum });
	} catch (error) {
		throw error;
	}
};
 
const scrapeWebsite = async (name, url, description) => {
	try {
		let website = await services.website.findOneByUrl(url);
		if (!website) {
			website = await services.website.create({ name, url, description });
		}

		const links = extractLinks(document);
		const jobObject = {
			website,
			links,
			progress: {
				phase: 'pages'
			}
		};
		const currentJob = await services.job.create(jobObject);

		const { data } = await axios.get(url);
		const { window: { document } } = new JSDOM(data);
		const parentDocument = await scrapeContent(url, document, website);
		const parentDocumentPage = {
			url: parentDocument.link,
			title: parentDocument.title,
			content: parentDocument._id
		};
		await services.job.addScrapedPage(currentJob._id, new Page(parentDocumentPage));

		await Promise.all(links.map(async (link, index) => {
			try {
				const newProgress = {
					phase: 'links',
					current: `${index + 1} / ${links.length}`
				}
				await services.job.updateProgressById(currentJob._id, newProgress);

				const { data } = await axios.get(link);
				const { window: { document } } = new JSDOM(data);
				const scrapedContent = await scrapeContent(link, document, website, parentDocument);
				const page = {
					url: scrapedContent.link,
					title: scrapedContent.title,
					content: scrapedContent._id,
				};
				await services.job.addScrapedPage(currentJob._id, new Page(page));
			} catch (error) {
				console.error(`Error scrapping the website: ${error.toString()}`);
				await services.job.updateStatusById(currentJob._id, 'error');
				const newError = {
					code: error.code || 'unknown', message: error.message
				};
				await services.job.updateErrorById(currentJob._id, newError);
			}
		}));
		await services.job.updateStatusById(currentJob._id, 'finished');
		await services.job.updateEndTimeById(currentJob._id);
	} catch (error) {
		console.error(`Error scrapping the website: ${error.toString()}`);
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