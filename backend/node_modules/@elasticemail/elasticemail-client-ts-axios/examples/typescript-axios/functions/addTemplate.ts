/* Initialization */
import { Configuration, TemplatesApi, TemplatePayload } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

/**
 * Add template
 * Example of adding new template
 */

const templatesApi = new TemplatesApi(config);

const templatePayload = {
    Name: 'New template',
    Subject: 'Default subject',
    Body: [{
      ContentType: 'HTML',
      Charset: 'utf-8',
      Content: '<div>My template</div>'
    }],
    TemplateScope: 'Personal',
}; // interface TemplatePayload from '@elasticemail/elasticemail-client-ts-axios'

const addTemplate = (templatePayload: TemplatePayload): void => {
    templatesApi.templatesPost(templatePayload).then((response) => {
        console.log('API called successfully.');
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
};

addTemplate(templatePayload)