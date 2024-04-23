db.createUser(
    {
        user: 'scrape',
        pwd: 'scrape',
        roles: [
            {
                role: 'readWrite',
                db: 'scrape'
            }
        ]
    }
);