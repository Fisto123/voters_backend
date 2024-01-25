/* Initialization */
import { Configuration, StatisticsApi } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

/**
 * Load statistics
 * Example of loading basic statistics
 */

const statisticsApi = new StatisticsApi(config);

/* dates in YYYY-MM-DDThh:mm:ss format */
const fromDate = new Date('2015-01-01').toJSON(); // string
const toDate = new Date('2022-01-01').toJSON(); // string or null

const loadStatistics = (fromDate: string, toDate?: string): void => {
    statisticsApi.statisticsGet(fromDate, toDate).then((response) => {
        console.log('API called successfully.');
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
};

loadStatistics(fromDate, toDate)