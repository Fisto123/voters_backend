# Add Template

This is a guide how to add new template to your account in an easy way using JavaScript or TypeScript.

*Required Access Level: ModifyTemplates*

## What's a template?
It is prepared and saved body of an email. It can be reused to send any number of emails.

## Preparation
Create a new TypeScript file `snippet.ts` and open it in editor of your preference eg. Visual Studio Code (https://code.visualstudio.com/)

## Let's dig into the code

Put the below code to your file.

Import classes and interfaces you want to use:

```javascript
import { Configuration, TemplatesApi, TemplatePayload } from '@elasticemail/elasticemail-client-ts-axios';
```

Create config including your apikey: 

```javascript
const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});
```

Create an instance of TemplatesApi that will be used to add new template.

```javascript
const templatesApi = new TemplatesApi(config);
```

Create an object with details about new template:
- Name – name of your template by which it can be identified
- Subject – specify default subject
- Body – content of the template
- TemplateScope – specify scope, "Personal" template won't be shared, "Global" template can be shared with subaccounts.

> Find out more by checking our API's documentation: https://elasticemail.com/developers/api-documentation/rest-api#operation/templatesPost

```javascript
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
```

Create a function calling `templatesPost` method from the API to add new template. You may include console logs called when response comes back.
In case of error it will display error details, otherwise it will display a success message and chosen details about newly created campaign.

```javascript
const addTemplate = (templatePayload: TemplatePayload): void => {
    templatesApi.templatesPost(templatePayload).then((response) => {
        console.log('API called successfully.');
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
};
```

And finally, call `addTemplate` function with proper arguments: 

```javascript
addTemplate(templatePayload);
```


## The whole code to copy and paste:

```javascript
/* Initialization */
import { Configuration, TemplatesApi, TemplatePayload } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

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
```