/* Initialization */
import { Configuration, StatisticsApi } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

/**
 * Load campaigns stats
 * Example of loading your campaigns' statistics
 */

const statisticsApi = new StatisticsApi(config);

const limit = 0; // number
const offset = 0; // number

const loadCampaignsStats = (limit: number, offset: number): void => {
    statisticsApi.statisticsCampaignsGet(limit, offset).then((response) => {
        console.log('API called successfully.');
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
};

loadCampaignsStats(limit, offset)