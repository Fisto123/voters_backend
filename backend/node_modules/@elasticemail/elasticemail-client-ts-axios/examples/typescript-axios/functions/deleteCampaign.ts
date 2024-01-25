/* Initialization */
import { Configuration, CampaignsApi } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

/**
 * Delete Campaign
 * Example of deleting existing campaign by name
 */

const campaignsApi = new CampaignsApi(config);

const campaignName = "example"; // string

const deleteCampaign = (campaignName: string): void => {
    campaignsApi.campaignsByNameDelete(campaignName).then((response) => {
        console.log('API called successfully.');
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
};

deleteCampaign(campaignName)