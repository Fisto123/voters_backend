/* Initialization */
import { Configuration, EmailsApi, EmailTransactionalMessageData } from '@elasticemail/elasticemail-client-ts-axios';

/* Generate and use your API key */

const config = new Configuration({
    apiKey: "YOUR_API_KEY"
});

/**
 * Send transactional emails
 * Example of sending transactional emails
 */

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

