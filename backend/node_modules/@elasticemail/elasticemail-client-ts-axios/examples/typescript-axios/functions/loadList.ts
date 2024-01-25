/* Initialization */
import { Configuration, ListsApi } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

/**
 * Load list
 * Example of loading detailed information about specified contacts list
 */

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