# Delete Contact

This is a guide how to delete contact from your account in an easy way using JavaScript or TypeScript.

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

Create an instance of ContactsApi that will be used to delete contact.

```javascript
const contactsApi = new ContactsApi(config);
```

Specify a contact to delete.

> Find out more by checking our API's documentation: https://elasticemail.com/developers/api-documentation/rest-api#operation/contactsByEmailDelete

```javascript
const contact = 'example@address.com'; // string
```

Create a function calling `contactsByEmailDelete` method from the API to remove a contact. You may include console logs called when response comes back.
In case of error it will display error details, otherwise it will display a success message and chosen details about newly created campaign.

```javascript
const deleteContact = (contact: string): void => {
    contactsApi.contactsByEmailDelete(contact).then((response) => {
        console.log('API called successfully.');
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
}
```

And finally, call `deleteContact` function with proper arguments: 

```javascript
deleteContact(contact);
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

const contact = 'example@address.com'; // string

const deleteContact = (contact: string): void => {
    contactsApi.contactsByEmailDelete(contact).then((response) => {
        console.log('API called successfully.');
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
};

deleteContact(contact);
```