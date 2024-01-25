## elasticemail-client-ts-axios@4.0.22

This generator creates TypeScript/JavaScript client that utilizes [axios](https://github.com/axios/axios). The generated Node module can be used in the following environments:

Environment
* Node.js
* Webpack
* Browserify

Language level
* ES5 - you must have a Promises/A+ library installed
* ES6

Module system
* CommonJS
* ES6 module system

It can be used in both TypeScript and JavaScript. In TypeScript, the definition should be automatically resolved via `package.json`. ([Reference](http://www.typescriptlang.org/docs/handbook/typings-for-npm-packages.html))


## Examples

Function ||
------------ | ------------- 
[addCampaign](examples/functions/addCampaign.ts) | [readme](examples/functions/addCampaign.md)
[addContacts](examples/functions/addContacts.ts) | [readme](examples/functions/addContacts.md)
[addList](examples/functions/addList.ts) | [readme](examples/functions/addList.md)
[addTemplate](examples/functions/addTemplate.ts) | [readme](examples/functions/addTemplate.md)
[deleteCampaign](examples/functions/deleteCampaign.ts) | [readme](examples/functions/deleteCampaign.md)
[deleteContact](examples/functions/deleteContact.ts) | [readme](examples/functions/deleteContact.md)
[deleteList](examples/functions/deleteList.ts) | [readme](examples/functions/deleteList.md)
[deleteTemplate](examples/functions/deleteTemplate.ts) | [readme](examples/functions/deleteTemplate.md)
[exportContacts](examples/functions/exportContacts.ts) | [readme](examples/functions/exportContacts.md)
[loadCampaign](examples/functions/loadCampaign.ts) | [readme](examples/functions/loadCampaign.md)
[loadCampaignsStats](examples/functions/loadCampaignsStats.ts) | [readme](examples/functions/loadCampaignsStats.md)
[loadChannelsStats](examples/functions/loadChannelsStats.ts) | [readme](examples/functions/loadChannelsStats.md)
[loadList](examples/functions/loadList.ts) | [readme](examples/functions/loadList.md)
[loadStatistics](examples/functions/loadStatistics.ts) | [readme](examples/functions/loadStatistics.md)
[loadTemplate](examples/functions/loadTemplate.ts) | [readme](examples/functions/loadTemplate.md)
[sendBulkEmails](examples/functions/sendBulkEmails.ts) | [readme](examples/functions/sendBulkEmails.md)
[sendTransactionalEmails](examples/functions/sendTransactionalEmails.ts) | [readme](examples/functions/sendTransactionalEmails.md)
[updateCampaign](examples/functions/updateCampaign.ts) | [readme](examples/functions/updateCampaign.md)
[uploadContacts](examples/functions/uploadContacts.ts) | [readme](examples/functions/uploadContacts.md)

### Building

To build and compile the typescript sources to javascript use:
```
npm install
npm run build
```

### Publishing

First build the package then run ```npm publish```

### Consuming

navigate to the folder of your consuming project and run one of the following commands.

_published:_

```
npm install elasticemail-client-ts-axios@4.0.22 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
