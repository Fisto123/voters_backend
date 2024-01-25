# Send Bulk Email

This is a guide how to send bulk emails in an easy way using JavaScript or TypeScript.

*Required Access Level: SendHttp*

## What's a bulk email?
This is single email message send to a large group of recipients at once.

## Preparation
Create a new TypeScript file `snippet.ts` and open it in editor of your preference eg. Visual Studio Code (https://code.visualstudio.com/)

## Let's dig into the code

Put the below code to your file.

Import classes and interfaces you want to use:

```javascript
import { Configuration, EmailsApi, EmailMessageData } from '@elasticemail/elasticemail-client-ts-axios';
```

Create config including your apikey: 

```javascript
const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});
```

Create an instance of EmailsApi that will be used to send bulk emails.

```javascript
const emailsApi = new EmailsApi(config);
```

Specify email details:
- email recipients:
    - this example demostrates merge fields usage, for each recipient `{name}` will be changed to recipient's name
- email content:
    - body parts
    - from email – it needs to be your validated email address
    - email subject

> Find out more by checking our API's documentation: https://elasticemail.com/developers/api-documentation/rest-api#operation/emailsPost


```javascript
const emailMessageData = {
    Recipients: [
      { 
        Email: "example@address.com",
        Fields: {
          name: "Name"
        }
      }
    ],
    Content: {
      Body: [
        {
          ContentType: "HTML",
          Charset: "utf-8",
          Content: "<strong>Hi {name}!<strong>"
        },
        {
          ContentType: "PlainText",
          Charset: "utf-8",
          Content: "Hi {name}!"
        }
      ],
      From: "myemail@address.com",
      Subject: "Example bulk email"
    }
}; // interface EmailMessageData from '@elasticemail/elasticemail-client-ts-axios'
```

Create a function calling `emailsPost` method from the API to send bulk emails. You may include console logs called when response comes back.
In case of error it will display error details, otherwise it will display a success message and chosen details about newly created campaign.

```javascript
const sendBulkEmails = (emailMessageData: EmailMessageData): void => {
  emailsApi.emailsPost(emailMessageData).then((response) => {
      console.log('API called successfully.');
      console.log(response.data);
  }).catch((error) => {
      console.error(error);
  });
};
```

And finally, call `sendBulkEmails` function with proper arguments: 

```javascript
sendBulkEmails(emailMessageData);
```


## The whole code to copy and paste:

```javascript
/* Initialization */
import { Configuration, EmailsApi, EmailMessageData } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

const emailsApi = new EmailsApi(config);

const emailMessageData = {
    Recipients: [
      { 
        Email: "example@address.com",
        Fields: {
          name: "Name"
        }
      }
    ],
    Content: {
      Body: [
        {
          ContentType: "HTML",
          Charset: "utf-8",
          Content: "<strong>Hi {name}!<strong>"
        },
        {
          ContentType: "PlainText",
          Charset: "utf-8",
          Content: "Hi {name}!"
        }
      ],
      From: "myemail@address.com",
      Subject: "Example bulk email"
    }
  }; // interface EmailMessageData from '@elasticemail/elasticemail-client-ts-axios'

const sendBulkEmails = (emailMessageData: EmailMessageData): void => {
  emailsApi.emailsPost(emailMessageData).then((response) => {
      console.log('API called successfully.');
      console.log(response.data);
  }).catch((error) => {
      console.error(error);
  });
};

sendBulkEmails(emailMessageData)
```