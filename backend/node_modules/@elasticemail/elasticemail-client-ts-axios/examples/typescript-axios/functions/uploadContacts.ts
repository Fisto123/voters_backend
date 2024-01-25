/* Initialization */
import { Configuration, ContactsApi } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

/**
 * Upload contacts
 * Example of adding contacts by uploading csv file
 * Column required in csv file: Email
 */

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