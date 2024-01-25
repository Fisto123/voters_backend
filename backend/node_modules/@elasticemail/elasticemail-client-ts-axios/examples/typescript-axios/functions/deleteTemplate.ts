/* Initialization */
import { Configuration, TemplatesApi } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

/**
 * Delete template
 * Example of deleting existing template by name
 */

const templatesApi = new TemplatesApi(config);

const templateName = 'Example template'; // string

const deleteTemplate = (templateName: string): void => {
    templatesApi.templatesByNameDelete(templateName).then((response) => {
        console.log('API called successfully.');
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
};

deleteTemplate(templateName)