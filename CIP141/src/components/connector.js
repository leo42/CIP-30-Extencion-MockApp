import React from 'react';
import {  useState } from 'react';
import {Maestro, Lucid, Blockfrost} from "@lucid-evolution/lucid";
import "./connector.css"
// import { createCIP141Transaction } from "cip141-lucidevolution";
// This is the connector component. It is the component that will be used to connect to the wallet under cardano.wallet and interact with the blockchain. 


function Connector() {
    const [wallet, setWallet] = useState(null);
    const [walletError, setWalletError] = useState(null);
    const [balance, setBalance] = useState(null);
    const [utxos, setUtxos] = useState(null);
    const [lucid, setLucid] = useState(null);
    const [collateral, setCollateral] = useState(null);
    const [usedAddresses, setUsedAddresses] = useState(null);
    const [unusedAddresses, setUnusedAddresses] = useState(null);
    const [changeAddress, setChangeAddress] = useState(null);
    const [rewardAddresses, setRewardAddresses] = useState(null);
    const [tx, setTx] = useState(null);
    const [submittedTx, setSubmittedTx] = useState(null);
    const [submittedUnsignedTx, setSubmittedUnsignedTx] = useState(null);
    const [collateralAddress, setCollateralAddress] = useState(null);
    const [scriptRequirements, setScriptRequirements] = useState(null);
    const [script, setScript] = useState(null);
    const [completedTx, setCompletedTx] = useState(null);
    const [txId, setTxId] = useState(null);
    const [secret, setSecret] = useState(null);
    const [network, setNetwork] = useState(null);
    const [extension, setExtension] = useState([]);

    React.useEffect(() => {
        setExtension(window.cardano.broclan.supportedExtensions)
        const interval = setInterval(() => {
            if (window.cardano) {
                // console.log("interval", window.cardano.broclan)
                setExtension(window.cardano.broclan.supportedExtensions)
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);


    async function enableWallet(walletName) {
        try {
            console.log(window.cardano);
            let api = await window.cardano[walletName].enable([106]);
            console.log(api);
            if (api) {
                console.log("LEOOOOOO")
                setWallet(api);
                setWalletError(null);


                const provider = new Blockfrost(
                    "https://passthrough.broclan.io",
                    "preprod"
                );
                
                console.log(await provider.getProtocolParameters())
                // Initialize Lucid with the provider
                const lucid = await Lucid(provider, { network: "Preprod" });


                // Select the wallet
                lucid.selectWallet.fromAPI(api);
                setLucid(lucid);

                console.log(await lucid.wallet.getUtxos());
            }
        } catch (e) {
            console.log(e);
            setWalletError(e);
        }
    }

    async function disableWallet() {
        setNetwork(null)
        setBalance(null)
        setUtxos(null)
        setCollateral(null)
        setUsedAddresses(null)
        setUnusedAddresses(null)
        setChangeAddress(null)
        setRewardAddresses(null)
        setTx(null)
        setSubmittedTx(null)
        setSubmittedUnsignedTx(null)
        setCollateralAddress(null)
        setScriptRequirements(null)
        setScript(null)
        setCompletedTx(null)
        setTxId(null)
        setWallet(null)
        setLucid(null)
    }

    async function getBalance() {
        let balance = await wallet.getBalance();
        setBalance(balance)
        console.log(balance)
    }

    async function getUtxos() { 
        console.log(wallet)
        let utxos = await wallet.getUtxos();
        console.log(utxos)
        const lucidUtxos = await lucid.wallet().getUtxos()
        console.log(lucidUtxos)
        setUtxos(utxos)

    }

    async function getSecret(secretId) {
        let secret = await wallet.cip141.getSecret(secretId)
        setSecret(secret)
        console.log(secret)
    }


    async function getCollateral() {
        let collateral = await wallet.getCollateral();
        setCollateral(collateral)
        console.log(collateral)

    }

    async function getUsedAddresses() {
        let usedAddresses = await wallet.getUsedAddresses();
        setUsedAddresses(usedAddresses)
        console.log(usedAddresses)
    }

    async function getUnusedAddresses() {
        let unusedAddresses = await wallet.getUnusedAddresses();
        setUnusedAddresses(unusedAddresses)
        console.log(unusedAddresses)
    }

    async function getChangeAddress() {
        let changeAddress = await wallet.getChangeAddress();
        setChangeAddress(changeAddress)
        console.log(changeAddress)
    }

    async function getRewardAddresses() {
        let rewardAddresses = await wallet.getRewardAddresses();
        setRewardAddresses(rewardAddresses)
        console.log(rewardAddresses)
    }

    async function submitTx() {
        // try{
        // let  uint8Array = typeof completedTx[0] === 'string' ?  new Uint8Array(completedTx[0].match(/.{2}/g).map(byte => parseInt(byte, 16))) : completedTx[0];
        // let tx =  new  TxComplete(lucid, CML.Transaction.from_bytes(uint8Array)) 
        // let txComplete =  await tx.assemble(completedTx[1]).complete()

        // let submittedTx = await wallet.submitTx(txComplete.toString());
        // setSubmittedTx(submittedTx)
        // console.log(submittedTx)
        // }catch (e){
        //     setSubmittedTx("Error"+ e.message   )
        // }
    }

    async function submitUnsignedTx() {
        let script = await wallet.cip141.getScript();
        let scriptRequirements = await wallet.cip141.getScriptRequirements();
       // let address = await lucid.wallet.address();
        console.log(lucid)
       // console.log(lucid.wallet)
       // console.log( await lucid.provider.getUtxos(address))
        
       // lucid.selectWalletFrom( { "address":address, "utxos": await lucid.provider.getUtxos(address)} );
        const tx = await lucid.newTx()
        
        tx.payToAddress("addr_test1qpvrwlxha2a3lm8pfav6u4nd2qx5evmqk860fpwzwfs557khyrrgpn6l5dsvvus8hxa5kmh933ppnyqq79ke343t5z0swrdk0e",{lovelace: BigInt(10_000_000)});
        tx.attachSpendingValidator({ "type": "Native" , "script":script})
        console.log(scriptRequirements)
        scriptRequirements.map((requirement) => {
            if(requirement.code === 1){
                tx.addSignerKey(requirement.value)
            }
            if(requirement.code === 2){
                tx.validTo( lucid.utils.slotToUnixTime((requirement.value)))
            }
            if(requirement.code === 3){
                tx.validFrom(lucid.utils.slotToUnixTime((requirement.value)))
            }
        }
        )
        const txComplete = await tx.complete()
        console.log(txComplete.toString())
        try{
            let submittedUnsignedTx = await wallet.cip141.submitUnsignedTx(txComplete.toString());
            setSubmittedUnsignedTx(submittedUnsignedTx)
            console.log(submittedUnsignedTx)
        }catch (e){
            setSubmittedUnsignedTx(e)
        }
    }



    async function getScriptRequirements() {
        let scriptRequirements = await wallet.cip141.getScriptRequirements();
        setScriptRequirements(scriptRequirements)
        console.log(scriptRequirements)
    }

    async function getScript() {
        let script = await wallet.cip141.getScript();
        setScript(script)
        console.log(script)
    }


    async function getCompletedTx() {
    try{
        let completedTx = await wallet.cip141.getCompletedTx(submittedUnsignedTx);
        setCompletedTx(completedTx)
        console.log(completedTx)
    }catch(e){
        setCompletedTx(e)
        console.log(e)
    }
    }

    async function getNetwork() {
        let network = await wallet.getNetworkId();
        setNetwork(network)
        console.log(network)
    }


    return (
        <div className="connector">
            <h1>CIP141 Connector</h1>
            <p>Wallet: {JSON.stringify(wallet)}</p>
            <p>Extension: {JSON.stringify(extension)}</p>
            {walletError && <p>Wallet Error: {JSON.stringify(walletError)}</p>}
           {!wallet ?  
             <div><button onClick={() => enableWallet("broclan")}> Enable BroClan</button><button onClick={() => enableWallet("nami")}> Enable Nami</button> </div> : <button onClick={disableWallet}> Disable Wallet</button>
             
             }
            {wallet &&<div className='apis'>
            <button onClick={getNetwork}> Get network</button> 
            {network !== null && <p>Network: {JSON.stringify(network)}</p>}
            <button onClick={getBalance}> Get Balance</button>
            {balance && <p>Balance: {JSON.stringify(balance)}</p>}
            <button onClick={getUtxos}> Get getUtxos</button>
            {utxos && <p>Utxos: {JSON.stringify(utxos)}</p>}
            <button onClick={getCollateral}> Get Collateral</button>
            {collateral && <p>Collateral: {JSON.stringify(collateral)}</p>}
            <button onClick={getUsedAddresses}> Get Used Addresses</button>
            {usedAddresses && <p>Used Addresses: {JSON.stringify(usedAddresses)}</p>}
             <button onClick={getUnusedAddresses}> Get Unused Addresses</button>
            {unusedAddresses && <p>Unused Addresses: {JSON.stringify(unusedAddresses)}</p>}
            <button onClick={getChangeAddress}> Get Change Address</button>
            {changeAddress && <p>Change Address: {JSON.stringify(changeAddress)}</p>}
            <button onClick={getRewardAddresses}> Get Reward Addresses</button>
            {rewardAddresses && <p>Reward Addresses: {JSON.stringify(rewardAddresses)}</p>}
            {scriptRequirements && <p>Script Requirements: {JSON.stringify(scriptRequirements)}</p>}
            <button onClick={getScript}> Get Script</button>
            {script && <p>Script: {JSON.stringify(script)}</p>}
            <button onClick={getSecret}> Get Secret</button>
            {secret && <p>Secret: {JSON.stringify(secret)}</p>}
            <button onClick={() => submitUnsignedTx()}> Submit Unsigned Tx</button>
            {submittedUnsignedTx && <div><p>Submitted Unsigned Tx: {JSON.stringify(submittedUnsignedTx)}</p>
            <button onClick={() => getCompletedTx()}> Get Completed Tx</button>
            {completedTx && <div><p>Completed Tx: {JSON.stringify(completedTx)}</p>
            <button onClick={() => submitTx(tx)}> Submit Tx</button>
            {submittedTx && <p>Submitted Tx: {JSON.stringify(submittedTx)}</p>}</div>}</div>}
            </div>
            }
        </div>
    )
}

export default Connector