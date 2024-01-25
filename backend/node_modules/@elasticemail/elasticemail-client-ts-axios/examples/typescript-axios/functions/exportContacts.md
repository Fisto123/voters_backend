# Export Contacts

This is a guide how to export selected contacts to downloadable file in an easy way using JavaScript or TypeScript.

*Required Access Level: Export*

## What's a contact?
It is a recipient of your emails. Contacts can be grouped by created segments or lists.

## Preparation
Create a new TypeScript file `snippet.ts` and open it in editor of your preference eg. Visual Studio Code (https://code.visualstudio.com/)

## Let's dig into the code

Put the below code to your file.

Import classes and interfaces you want to use:

```javascript
import { Configuration, ContactsApi, ExportFileFormats, CompressionFormat } from '@elasticemail/elasticemail-client-ts-axios';
```

Create config including your apikey: 

```javascript
const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});
```

Create an instance of ContactsApi that will be used to export selected contacts.

```javascript
const contactsApi = new ContactsApi(config);
```

To export contacts you can specify a rule (eg. contacts list/segment or statuses) or list of emails. You can't provide both, only one or the other.

> Find out more by checking our API's documentation: https://elasticemail.com/developers/api-documentation/rest-api#operation/contactsExportPost

```javascript
const rule = 'exampleFilterRule'; // string or undefined if you want to provide list of emails
const emails = []; // string[] or empty array if you want to provide a rule
```

You also need to add some more options: file and compression format and file name.

```javascript
const fileFormat = 'Csv'; // interface ExportFileFormats: 'Csv' || 'Xml' || 'Json'
const compressionFormat = 'None'; // interface CompressionFormat: 'None || 'Zip
const fileName = 'fileName.csv'; // name of your file including extension in string
```

Create a function calling `contactsExportPost` method from the API to export contacts. You may include console logs called when response comes back.
In case of error it will display error details, otherwise it will display a success message and chosen details about newly created campaign.

```javascript
const exportContacts = (fileFormat: ExportFileFormats, rule: string, emails: string[], compressionFormat: CompressionFormat, fileName: string): void => {
    contactsApi.contactsExportPost(fileFormat, rule, emails, compressionFormat, fileName).then((response) => {
        console.log('API called successfully.');
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
};
```

And finally, call `exportContacts` function with proper arguments: 

```javascript
exportContacts(fileFormat, rule, emails, compressionFormat, fileName)
```


## The whole code to copy and paste:

```javascript
/* Initialization */
import { Configuration, ContactsApi, ExportFileFormats, CompressionFormat } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

const contactsApi = new ContactsApi(config);

/* You can't provide both a rule and list of emails, only one or the other.  */
const rule = 'exampleFilterRule'; // string or undefined if you want to provide list of emails
const emails = ['example@example.com']; // string[] or empty Array if you want to provide a rule

const fileFormat = 'Csv'; // interface ExportFileFormats: 'Csv' || 'Xml' || 'Json'
const compressionFormat = 'None'; // interface CompressionFormat: 'None || 'Zip
const fileName = 'fileName.csv'; // name of your file including extension in string

const exportContacts = (fileFormat: ExportFileFormats, rule: string, emails: string[], compressionFormat: CompressionFormat, fileName: string): void => {
    contactsApi.contactsExportPost(fileFormat, rule, emails, compressionFormat, fileName).then((response) => {
        console.log('API called successfully.');
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
};

exportContacts(fileFormat, rule, emails, compressionFormat, fileName)
```