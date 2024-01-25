/* Initialization */
import { Configuration, ListsApi, ListPayload } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

/**
 * Add list
 * Example of creating new list from existing contact emails
 */

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