# Add Contacts

This is a guide how to add up to 1000 new contacts to your account in an easy way using JavaScript or TypeScript.

*Required Access Level: ModifyContacts*

## What's a contact?
It is a recipient of your emails. Contacts can be grouped by created segments or lists.

## Preparation
Create a new TypeScript file `snippet.ts` and open it in editor of your preference eg. Visual Studio Code (https://code.visualstudio.com/)

## Let's dig into the code

Put the below code to your file.

Import classes and interfaces you want to use:

```javascript
import { Configuration, ContactsApi, ContactPayload } from '@elasticemail/elasticemail-client-ts-axios';
```

Create config including your apikey: 

```javascript
const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});
```

Create an instance of ContactsApi that will be used to add contacts.

```javascript
const contactsApi = new ContactsApi(config);
```

Create an array with maximum 1000 contacts. Field 'Email' is required.

> Find out more by checking our API's documentation: https://elasticemail.com/developers/api-documentation/rest-api#operation/contactsPost

```javascript
const contacts = [{
    Email: "example@address.com",
    FirstName: "John",
    LastName: "Smith"
  },
  {
    Email: "test@address.com",
    FirstName: "Test",
    LastName: "Test"
  }
]; // interface ContactPayload[] from '@elasticemail/elasticemail-client-ts-axios'
```

You can pass an existing list names, otherwise contacts will be added to all contacts (if you pass an empty array).

```javascript
const listNames = ["My list"]; // string[]
```

Create a function calling `contactsPost` method from the API to add contacts. You may include console logs called when response comes back.
In case of error it will display error details, otherwise it will display a success message and chosen details about newly created campaign.

```javascript
const addContacts = (contacts: ContactPayload[], listnames: string[]): void => {
    contactsApi.contactsPost(contacts, listNames).then((response) => {
        console.log('API called successfully.');
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
}
```

And finally, call `addContacts` function with proper arguments: 

```javascript
addContacts(contacts, listNames);
```


## The whole code to copy and paste:

```javascript
/* Initialization */
import { Configuration, ContactsApi, ContactPayload } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

const contactsApi = new ContactsApi(config);

const contacts = [{
    Email: "example@address.com",
    FirstName: "John",
    LastName: "Smith"
  },
  {
    Email: "test@address.com",
    FirstName: "Test",
    LastName: "Test"
  }
]; // interface ContactPayload[] from '@elasticemail/elasticemail-client-ts-axios'

const listNames = ["My list"]; // string[]

const addContacts = (contacts: ContactPayload[], listNames: string[]): void => {
  contactsApi.contactsPost(contacts, listNames).then((response) => {
      console.log('API called successfully.');
      console.log(response.data);
  }).catch((error) => {
      console.error(error);
  });
};

addContacts(contacts, listNames)
```