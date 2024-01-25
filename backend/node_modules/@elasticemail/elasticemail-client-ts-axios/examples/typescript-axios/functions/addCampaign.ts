/* Initialization */
import { Configuration, CampaignsApi, Campaign } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

/**
 * Add Campaign
 * Example of creating new campaign
 */

const campaignsApi = new CampaignsApi(config);

const newCampaign = {
    Name: 'New campaign',
    Recipients: {
      ListNames: ["my list name"],
      SegmentNames: null,
    },
    Content: [{
      From: 'myemail@address.com',
      ReplyTo: 'myemail@address.com',
      TemplateName: "your_template",
      Subject: 'Hello'
    }],
    Status: "selected_status"
}; // interface Campaign from '@elasticemail/elasticemail-client-ts-axios'

const addCampaign = (newCampaign: Campaign): void => {
  campaignsApi.campaignsPost(newCampaign).then((response) => {
      console.log('API called successfully.');
      console.log(response.data);
  }).catch((error) => {
      console.error(error);
  });
};

addCampaign(newCampaign);