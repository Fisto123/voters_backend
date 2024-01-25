/* Initialization */
import { Configuration, ContactsApi } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

/**
 * Delete contact
 * Example of deleting contact using email address
 */

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