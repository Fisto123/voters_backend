/* Initialization */
import { Configuration, ListsApi } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

/**
 * Delete list
 * Example of deleting existing contact list by name
 */

const listsApi = new ListsApi(config);

const listName = 'Example list' // string

const deleteList = (listName: string): void => {
    listsApi.listsByNameDelete(listName).then((response) => {
        console.log('API called successfully.');
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
};

deleteList(listName)