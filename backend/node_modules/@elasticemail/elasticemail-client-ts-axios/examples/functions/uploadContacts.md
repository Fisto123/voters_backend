# Upload Contacts

This is a guide how to upload contacts from CSV file in an easy way using JavaScript or TypeScript.

*Required Access Level: ModifyContacts*

## What's a contact?
It is a recipient of your emails. Contacts can be grouped by created segments or lists.

## Preparation
Create a new TypeScript file `snippet.ts` and open it in editor of your preference eg. Visual Studio Code (https://code.visualstudio.com/)

## Let's dig into the code

Put the below code to your file.

Import classes and interfaces you want to use:

```javascript
import { Configuration, ContactsApi } from '@elasticemail/elasticemail-client-ts-axios';
```

Create config including your apikey: 

```javascript
const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});
```

Create an instance of ContactsApi that will be used to upload contacts from CSV file.

```javascript
const contactsApi = new ContactsApi(config);
```

In this example we will load a CSV file that contains a list of contacts.

The simplest CSV file requires only one column `Email`, eg.:

```
Email
john@johnsmith.com
```

> Find out more by checking our API's documentation: https://elasticemail.com/developers/api-documentation/rest-api#operation/contactsImportPost


Use input type="file" to enable file upload and create button which will trigger your API call `uploadContacts` described below.

```javascript
<input type="file"></input>
<button onclick={uploadContacts()}>Upload contacts</button>
```

Create event listener and function to save uploaded file as a variable.

```javascript
input.addEventListener('change', saveFile);
let file;

const saveFile = (event) => {
    file = event.target.files[0];
  }
```

Create variables with fileName and encodingName.

```javascript
const listName = 'My list'; // string
const encodingName = 'utf-8'; // string
```

Create a function calling `contactsImportPost` method from the API to upload contacts. You may include console logs called when response comes back.
In case of error it will display error details, otherwise it will display a success message and chosen details about newly created campaign.

```javascript
const uploadContacts = (listName: string, encodingName: string, file: any): void => {
    contactsApi.contactsImportPost(listName, encodingName, file).then((response) => {
        console.log('API called successfully.');
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
}
```

And finally, call `uploadContacts` function with proper arguments: 

```javascript
uploadContacts(listName, encodingName, file);
```


## The whole code to copy and paste:

```javascript
/* Initialization */
import { Configuration, ContactsApi } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

const contactsApi = new ContactsApi(config);

const listName = 'My list'; // string
const encodingName = 'utf-8'; // string

/* CSV file with contacts list. For example you can use file uploaded by input type="file" */
const file = example_file; // string <binary>

const uploadContacts = (listName: string, encodingName: string, file: any): void => {
    contactsApi.contactsImportPost(listName, encodingName, file).then((response) => {
        console.log('API called successfully.');
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
}

uploadContacts(listName, encodingName, file);
```