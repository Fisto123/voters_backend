# Add List

This is a guide how to add new list of contacts to your account in an easy way using JavaScript or TypeScript.

*Required Access Level: ModifyContacts*

## What's a list?
Lists are static sets of contacts that can be managed manually. Segments are sets of contacts that dynamically change based on the segment's query.

## Preparation
Create a new TypeScript file `snippet.ts` and open it in editor of your preference eg. Visual Studio Code (https://code.visualstudio.com/)

## Let's dig into the code

Put the below code to your file.

Import classes and interfaces you want to use:

```javascript
import { Coonfiguration, ListsApi, ListPayload } from '@elasticemail/elasticemail-client-ts-axios';
```

Create config including your apikey: 

```javascript
const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});
```

Create an instance of ListsApi that will be used to add list.

```javascript
const listsApi = new ListsApi(config);
```

Create an object with new list details. `ListName` field is required.

> Find out more by checking our API's documentation: https://elasticemail.com/developers/api-documentation/rest-api#operation/listsPost

```javascript
const listPayload = {
    ListName: "New list",
    AllowUnsubscribe: true,
    Emails: ["example@address.com"] // existing emails or empty to add all contacts
}; // interface ListPayload from '@elasticemail/elasticemail-client-ts-axios'
```

Create a function calling `listsPost` method from the API to add new list. You may include console logs called when response comes back.
In case of error it will display error details, otherwise it will display a success message and chosen details about newly created campaign.

```javascript
const addList = (listPayload: ListPayload): void => {
    listsApi.listsPost(listPayload).then((response) => {
        console.log('API called successfully.');
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
}
```

And finally, call `addList` function with proper arguments: 

```javascript
addList(listPayload);
```


## The whole code to copy and paste:

```javascript
/* Initialization */
import { Configuration, ListsApi, ListPayload } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

const listsApi = new ListsApi(config);

const listPayload = {
    ListName: "New list",
    AllowUnsubscribe: true,
    Emails: ["example@address.com"] // existing emails or empty to add all contacts
  }; // interface ListPayload from '@elasticemail/elasticemail-client-ts-axios'

const addList = (listPayload: ListPayload): void => {
    listsApi.listsPost(listPayload).then((response) => {
        console.log('API called successfully.');
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
};

addList(listPayload)
```