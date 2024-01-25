# Update Campaign

This is a guide how to update existing campaign in an easy way using JavaScript or TypeScript.

*Required Access Level: ModifyCampaigns*

## What's a campaign?
It is sending an email to the group of contacts. To send a campaign you must first create a template (which becomes the email) and you need contacts (the people who receive the email).

## Preparation
Create a new TypeScript file `snippet.ts` and open it in editor of your preference eg. Visual Studio Code (https://code.visualstudio.com/)

## Let's dig into the code

Put the below code to your file.

Import classes and interfaces you want to use:

```javascript
import { Configuration, CampaignsApi, Campaign } from '@elasticemail/elasticemail-client-ts-axios';
```

Create config including your apikey: 

```javascript
const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});
```

Create an instance of CampaignsApi that will be used to update campaign details.

```javascript
const campaignsApi = new CampaignsApi(config);
```

Specify name of the campaign you want to update.

> Find out more by checking our API's documentation: https://elasticemail.com/developers/api-documentation/rest-api#operation/campaignsByNamePut


```javascript
const campaignName = "example"; // string
```

Create a campaign object to put in place of a current version:
- Name: defines campaign name by which you can identify it later
- Recipients: define your audience
- Conent: define your message details
- Status: define status in which campaign should be created

Send will be triggered immediately or postponed, depending on given options. 
Because we define `Status` as `Draft`, so in this case it will be postponed and campaign will be added to drafts.

```javascript
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
```

Create a function calling `campaignsByNamePut` method from the API to update campaign details. You may include console logs called when response comes back.
In case of error it will display error details, otherwise it will display a success message and chosen details about newly created campaign.

```javascript
const updateCampaign = (campaignName: string, updatedCampaign: Campaign): void => {
  campaignsApi.campaignsByNamePut(campaignName, updatedCampaign).then((response) => {
      console.log('API called successfully.');
      console.log(response.data);
  }).catch((error) => {
      console.error(error);
  });
};
```

And finally, call `updateCampaign` function with proper arguments: 

```javascript
updateCampaign(campaignName, updatedCampaign)
```


## The whole code to copy and paste:

```javascript
/* Initialization */
import { Configuration, CampaignsApi, Campaign } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

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
```