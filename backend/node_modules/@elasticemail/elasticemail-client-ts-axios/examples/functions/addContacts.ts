/* Initialization */
import { Configuration, ContactsApi, ContactPayload } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

/**
 * Add contacts
 * Example of adding up to 1000 contacts
 * You can pass an array with contact details
 * Specify a list name in options or add to all contacts
 */

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