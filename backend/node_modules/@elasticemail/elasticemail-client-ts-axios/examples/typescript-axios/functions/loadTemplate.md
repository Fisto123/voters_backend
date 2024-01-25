# Load Template

This is a guide how to load template details in an easy way using JavaScript or TypeScript.
Template details you can get: type, created date, subject, body and template scope.

*Required Access Level: ViewTemplates*

## What's a template?
It is prepared and saved body of an email. It can be reused to send any number of emails.

## Preparation
Create a new TypeScript file `snippet.ts` and open it in editor of your preference eg. Visual Studio Code (https://code.visualstudio.com/)

## Let's dig into the code

Put the below code to your file.

Import classes and interfaces you want to use:

```javascript
import { Configuration, TemplatesApi } from '@elasticemail/elasticemail-client-ts-axios';
```

Create config including your apikey: 

```javascript
const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});
```

Create an instance of TemplatesApi that will be used to load template details.

```javascript
const templatesApi = new TemplatesApi(config);
```

Specify existing template name.

> Find out more by checking our API's documentation: https://elasticemail.com/developers/api-documentation/rest-api#operation/templatesGet

```javascript
const templateName = 'My template' // string
```

Create a function calling `templatesByNameGet` method from the API to load template details. You may include console logs called when response comes back.
In case of error it will display error details, otherwise it will display a success message and chosen details about newly created campaign.

```javascript
const loadTemplate = (templateName: string): void => {
    templatesApi.templatesByNameGet(templateName).then((response) => {
        console.log('API called successfully.');
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
};
```

And finally, call `loadTemplate` function with proper arguments: 

```javascript
loadTemplate(templateName);
```


## The whole code to copy and paste:

```javascript
/* Initialization */
import { Configuration, TemplatesApi } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

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
```