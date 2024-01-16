import { createCheerioRouter, RequestQueue } from 'crawlee';

export const router = createCheerioRouter();

router.addDefaultHandler(async ({ $, log, request, pushData }) => {
    const city = $('h1.heading-h1').text().trim().split(' ').pop();

    log.info(`Scraping delivery restaurants in ${city}`);

    const restaurantCards = $('div[data-test-id="category-store-card"]');

    const rootUrl = 'https://glovoapp.com';

    const restaurantData = $(restaurantCards)
        .map((_, card) => {
            return {
                detailPageLink: rootUrl + $(card).find('a').attr('href'),
                name: $(card).find('h3').text().trim(),
                categoryTag: $(card)
                    .find('.store-card__footer__tag')
                    .text()
                    .trim(),
                rating: $(card).find('.store-card-rating__label').text().trim(),
                ratingCount: $(card)
                    .find('.store-card-rating__label--secondary')
                    .text()
                    .trim()
                    .replace(/[()]/g, ''),
            };
        })
        .get();

    await pushData(restaurantData);
});

router.addHandler('initialUrl', async ({ $, log }) => {
    const totalPages = parseInt(
        $('.current-page-text').text().split('of').pop()
    );

    log.info(`Enqueueing ${totalPages} pages`);

    const queue = await RequestQueue.open();

    for (let i = 1; i <= totalPages; i++) {
        await queue.addRequest({
            url: `https://glovoapp.com/hr/en/split/restaurants_1/?page=${i}`,
        });
    }
});
