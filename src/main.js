import { CheerioCrawler } from 'crawlee';
import { router } from './routes.js';

const crawler = new CheerioCrawler({
    // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
    requestHandler: router,
});

await crawler.addRequests([
    {
        url: 'https://glovoapp.com/hr/en/split/restaurants_1/',
        label: 'initialUrl',
    },
]);

await crawler.run();
