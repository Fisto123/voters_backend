/* Initialization */
import { Configuration, TemplatesApi } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

/**
 * Load template
 * Example of loading existing template
 */

const templatesApi = new TemplatesApi(config);

const templateName = 'Example template'; // string

const loadTemplate = (templateName: string): void => {
    templatesApi.templatesByNameGet(templateName).then((response) => {
        console.log('API called successfully.');
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
};

loadTemplate(templateName)