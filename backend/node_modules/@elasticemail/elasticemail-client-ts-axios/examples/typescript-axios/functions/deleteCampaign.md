# Delete Campaign

This is a guide how to remove existing campaign in an easy way using JavaScript or TypeScript.

*Required Access Level: ModifyCampaigns*

## What's a campaign?
It is sending an email to the group of contacts. To send a campaign you must first create a template (which becomes the email) and you need contacts (the people who receive the email).

## Preparation
Create a new TypeScript file `snippet.ts` and open it in editor of your preference eg. Visual Studio Code (https://code.visualstudio.com/)

## Let's dig into the code

Put the below code to your file.

Import classes and interfaces you want to use:

```javascript
import { Configuration, CampaignsApi } from '@elasticemail/elasticemail-client-ts-axios';
```

Create config including your apikey: 

```javascript
const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});
```

Create an instance of CampaignsApi that will be used to remove campaign.

```javascript
const campaignsApi = new CampaignsApi(config);
```

Specify campaign name.

> Find out more by checking our API's documentation: https://elasticemail.com/developers/api-documentation/rest-api#operation/campaignsByNameDelete


```javascript
const campaignName = "example"; // string
```

Create a function calling `campaignsByNameDelete` method from the API to delete campaign. You may include console logs called when response comes back.
In case of error it will display error details, otherwise it will display a success message and chosen details about newly created campaign.

```javascript
const deleteCampaign = (campaignName: string): void => {
    campaignsApi.campaignsByNameDelete(campaignName).then((response) => {
        console.log('API called successfully.');
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
};
```

And finally, call `deleteCampaign` function with proper arguments: 

```javascript
deleteCampaign(campaignName);
```


## The whole code to copy and paste:

```javascript
/* Initialization */
import { Configuration, CampaignsApi } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

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
```