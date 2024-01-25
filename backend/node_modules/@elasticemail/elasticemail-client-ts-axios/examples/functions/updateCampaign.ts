/* Initialization */
import { Configuration, CampaignsApi, Campaign } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

/**
 * Update Campaign
 * Example of updating existing campaign
 */

const campaignsApi = new CampaignsApi(config);

const campaignName = 'Example'; // string
const updatedCampaign = {
    Name: 'Updated example campaign',
    Recipients: {
      ListNames: ["my list name"],
      SegmentNames: null,
    },
    Content: [{
      From: 'myemail@address.com',
      ReplyTo: 'myemail@address.com',
      TemplateName: "your_template",
      Subject: 'Updated campaign'
    }],
    Status: "selected_status"
}; // interface Campaign from '@elasticemail/elasticemail-client-ts-axios'

const updateCampaign = (campaignName: string, updatedCampaign: Campaign): void => {
  campaignsApi.campaignsByNamePut(campaignName, updatedCampaign).then((response) => {
      console.log('API called successfully.');
      console.log(response.data);
  }).catch((error) => {
      console.error(error);
  });
};

updateCampaign(campaignName, updatedCampaign)