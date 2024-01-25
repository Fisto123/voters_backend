/* Initialization */
import { Configuration, CampaignsApi } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

/**
 * Load Campaign
 * Example of loading details about existing campaign by name (eg. campaign status, name, recipients)
 */

const campaignsApi = new CampaignsApi(config);

const campaignName = "example"; // string

const loadCampaign = (campaignName: string): void => {
    campaignsApi.campaignsByNameGet(campaignName).then((response) => {
        console.log('API called successfully.');
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
};

loadCampaign(campaignName);

