/* Initialization */
import { Configuration, EmailsApi, EmailMessageData } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

/**
 * Send bulk emails
 * Example of sending bulk merge emails
 */

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