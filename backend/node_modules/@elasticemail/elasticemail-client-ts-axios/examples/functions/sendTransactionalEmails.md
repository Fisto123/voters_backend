# Send Transactional Email

This is a guide how to send transactional emails in an easy way using JavaScript or TypeScript.

*Required Access Level: SendHttp*

## What's a transactional email?
This is automated email trigerred by actions done by the subscriber eg. registration, purchase receipts, other confirmations.

## Preparation
Create a new TypeScript file `snippet.ts` and open it in editor of your preference eg. Visual Studio Code (https://code.visualstudio.com/)

## Let's dig into the code

Put the below code to your file.

Import classes and interfaces you want to use:

```javascript
import { Configuration, EmailsApi, EmailTransactionalMessageData } from '@elasticemail/elasticemail-client-ts-axios';
```

Create config including your apikey: 

```javascript
const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});
```

Create an instance of EmailsApi that will be used to send transactional emails.

```javascript
const emailsApi = new EmailsApi(config);
```

Specify email details:
- recipients
- content:
    - body parts
    - from email – it needs to be your validated email address
    - email subject

> Find out more by checking our API's documentation: https://elasticemail.com/developers/api-documentation/rest-api#operation/emailsTransactionalPost


```javascript
const emailTransactionalMessageData = {
    Recipients: { 
      To: ["example@address.com"] // maximum 50 recipients
    },
    Content: {
      Body: [
        {
          ContentType: "HTML",
          Charset: "utf-8",
          Content: "<strong>Example content<strong>"
        },
        {
          ContentType: "PlainText",
          Charset: "utf-8",
          Content: "Example content"
        }
      ],
      From: "myemail@address.com",
      Subject: "Example transactional email"
    }
}; // interface EmailTransactionalMessageData from '@elasticemail/elasticemail-client-ts-axios'
```

Create a function calling `emailsTransactionalPost` method from the API to send transactional emails. You may include console logs called when response comes back.
In case of error it will display error details, otherwise it will display a success message and chosen details about newly created campaign.

```javascript
const sendTransactionalEmails = (emailTransactionalMessageData: EmailTransactionalMessageData): void => {
  emailsApi.emailsTransactionalPost(emailTransactionalMessageData).then((response) => {
      console.log('API called successfully.');
      console.log(response.data);
  }).catch((error) => {
      console.error(error);
  });
};
```

And finally, call `sendTransactionalEmails` function with proper arguments: 

```javascript
sendTransactionalEmails(emailTransactionalMessageData);
```


## The whole code to copy and paste:

```javascript
/* Initialization */
import { Configuration, EmailsApi, EmailTransactionalMessageData } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

const emailsApi = new EmailsApi(config);

const emailTransactionalMessageData = {
    Recipients: { 
      To: ["example@address.com"] // maximum 50 recipients
    },
    Content: {
      Body: [
        {
          ContentType: "HTML",
          Charset: "utf-8",
          Content: "<strong>Example content<strong>"
        },
        {
          ContentType: "PlainText",
          Charset: "utf-8",
          Content: "Example content"
        }
      ],
      From: "myemail@address.com",
      Subject: "Example transactional email"
    }
  }; // interface EmailTransactionalMessageData from '@elasticemail/elasticemail-client-ts-axios'

const sendTransactionalEmails = (emailTransactionalMessageData: EmailTransactionalMessageData): void => {
  emailsApi.emailsTransactionalPost(emailTransactionalMessageData).then((response) => {
      console.log('API called successfully.');
      console.log(response.data);
  }).catch((error) => {
      console.error(error);
  });
};

sendTransactionalEmails(emailTransactionalMessageData);
```