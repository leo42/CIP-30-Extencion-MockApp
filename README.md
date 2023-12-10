# CIP-30-Extension-MockApp
A testing ground for the new Multisig CIP-30 extension

To run this app, you will need to have [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed. Open a terminal and type:

```bash
cd mock-app
npm install
npm run start
```

After running npm start, the MockApp will be served locally under localhost:8081.

To test submitUnsignedTx, getCompletedTx, and submitTx, you start by submitting a transaction. Then the button to getCompleted will show up. You will need to add all the signatures on the wallet (without clicking submit), then click on getCompleted, and finally submit on the MockApp.
