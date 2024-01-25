# Load List

This is a guide how to load contacts list details in an easy way using JavaScript or TypeScript.

*Required Access Level: ViewContacts*

## What's a list?
Lists are static sets of contacts that can be managed manually. Segments are sets of contacts that dynamically change based on the segment's query.

## Preparation
Create a new TypeScript file `snippet.ts` and open it in editor of your preference eg. Visual Studio Code (https://code.visualstudio.com/)

## Let's dig into the code

Put the below code to your file.

Import classes and interfaces you want to use:

```javascript
import { Coonfiguration, ListsApi } from '@elasticemail/elasticemail-client-ts-axios';
```

Create config including your apikey: 

```javascript
const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});
```

Create an instance of ListsApi that will be used to load contacts list details.

```javascript
const listsApi = new ListsApi(config);
```

Specify list name.

> Find out more by checking our API's documentation: https://elasticemail.com/developers/api-documentation/rest-api#operation/listsByNameGet

```javascript
const listName = 'Example list' // string
```

Create a function calling `listsByNameGet` method from the API to load list details. You may include console logs called when response comes back.
In case of error it will display error details, otherwise it will display a success message and chosen details about newly created campaign.

```javascript
const loadList = (listName: string): void => {
    listsApi.listsByNameGet(listName).then((response) => {
        console.log('API called successfully.');
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
};
```

And finally, call `loadList` function with proper arguments: 

```javascript
loadList(listName);
```


## The whole code to copy and paste:

```javascript
/* Initialization */
import { Configuration, ListsApi } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

const listsApi = new ListsApi(config);

const listName = 'Example list' // string

const loadList = (listName: string): void => {
    listsApi.listsByNameGet(listName).then((response) => {
        console.log('API called successfully.');
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
};

loadList(listName)
```