# CIP-30-Extencion-MockApp
 A testing ground for the new Multisig CIP-30 extencion


To run this app you will have to have [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed  open a terminal and type:

    cd mock-app
    npm install
    npm run start

After npm start the mockApp will be served localy under [localhost:8081](http://localhost:8081)

To test submitUnsignedTx, getCompletedTx and submitTx  You start by submiting a transaction then the button to getCompleted will show up, you will have to add all the signatures on the wallet (without clicking submit) then click on the getCompleted and submit on the mockApp.
