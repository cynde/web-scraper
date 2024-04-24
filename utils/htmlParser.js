const getMetadata = (document) => {
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

const getDocumentDate = (document) => {
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

const getLinks = (document) => {
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

const getDesiredContent = (document, parentDocument) => {
	if (parentDocument) {
		return document.getElementById('content').textContent.trim();
	}
	const content = [];
	const titleElements = document.querySelectorAll('.faq_title div:nth-child(2)');
	const tableElements = document.querySelectorAll('.hid_div table tbody');
	titleElements.forEach((titleElement, index) => {
		const item = {
			title: titleElement.textContent.trim(),
			table: tableElements[index].textContent.trim()
		};
		content.push(item);
	});
	return JSON.stringify(content);
};

module.exports = {
    getMetadata,
    getDocumentDate,
    getLinks,
	getDesiredContent
}