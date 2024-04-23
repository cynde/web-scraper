const Page = require("./classes/page.class"); 
const crypto = require('crypto'); 
const db = require("./models");
const Website = db.website;
const Job = db.job; 
const Content = db.content; 
const util = require('util'); 


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

const scrape = async () => {
	await db.mongoose.connect(db.url); 
	console.log('Database connected');	
};

scrape();