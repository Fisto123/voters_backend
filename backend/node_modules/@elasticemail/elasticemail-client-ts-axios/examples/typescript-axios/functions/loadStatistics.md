# Load Statistics

This is a guide how to load basic delivery statistics from your account in an easy way using JavaScript or TypeScript.

*Required Access Level: ViewReports*

## What statistics can you get?
When you send emails to your audience we create some statistics reports for you eg. number of emails sent, delivered/bounced/unsubscribed messages etc.

## Preparation
Create a new TypeScript file `snippet.ts` and open it in editor of your preference eg. Visual Studio Code (https://code.visualstudio.com/)

## Let's dig into the code

Put the below code to your file.

Import classes and interfaces you want to use:

```javascript
import { Configuration, StatisticsApi } from '@elasticemail/elasticemail-client-ts-axios';
```

Create config including your apikey: 

```javascript
const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});
```

Create an instance of StatisticsApi that will be used to load basic statistics.

```javascript
const statisticsApi = new StatisticsApi(config);
```

Specify date range from which you want to get a report:
- from date
- to date – optional

> Find out more by checking our API's documentation: https://elasticemail.com/developers/api-documentation/rest-api#operation/statisticsGet

```javascript
const fromDate = new Date('2015-01-01').toJSON(); // string
const toDate = new Date('2022-01-01').toJSON(); // string or null
```

Create a function calling `statisticsGet` method from the API to load statistics. You may include console logs called when response comes back.
In case of error it will display error details, otherwise it will display a success message and chosen details about newly created campaign.

```javascript
const loadStatistics = (fromDate: string, toDate?: string): void => {
    statisticsApi.statisticsGet(fromDate, toDate).then((response) => {
        console.log('API called successfully.');
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
};
```

And finally, call `loadStatistics` function with proper arguments: 

```javascript
loadStatistics(fromDate, toDate);
```


## The whole code to copy and paste:

```javascript
/* Initialization */
import { Configuration, StatisticsApi } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

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
```