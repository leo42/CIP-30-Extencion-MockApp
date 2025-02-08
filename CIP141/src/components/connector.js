import React from 'react';
import {  useState } from 'react';
import {Data, Lucid, Blockfrost, signData} from "@lucid-evolution/lucid";
import "./connector.css"
import { createCIP106Transaction } from "cip106-lucidevolution";
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
    const [redeemer, setRedeemer] = useState(null);
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
                const lucid = await Lucid(provider,"Preprod" );


                // Select the wallet
                lucid.selectWallet.fromAPI(api);
                setLucid(lucid);

                console.log(await lucid.config().network.network);
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

    async function getSecret() {
        const secretId = 0
        let secret = await wallet.cip106.getSecret(secretId)
        setSecret(secret)
        console.log(secret)
    }

    async function signRedeemer() {
        const redeemerId = 0
        const premitive = "SPP"
        let redeemer = await wallet.cip106.signRedeemer(redeemerId, premitive)
        setRedeemer(redeemer)
        console.log(redeemer)
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
        let scriptRequirements = await wallet.cip106.getScriptRequirements();
        let utxos = await lucid.wallet().getUtxos()
        console.log(utxos)
       // let address = await lucid.wallet.address();
        console.log(lucid)
       // console.log(lucid.wallet)
       // console.log( await lucid.provider.getUtxos(address))
        
       // lucid.selectWalletFrom( { "address":address, "utxos": await lucid.provider.getUtxos(address)} );
        const tx = await createCIP106Transaction(lucid,scriptRequirements)
        console.log(tx)
        tx.pay.ToAddress("addr_test1qprmzc9rzsg42nxeezzjsq9w87z7nhpjjdtsgqejpednenw34j8e8frxm3v4e9t5u5sh7uwadw5kfhqvseg3fpwequyqzkw09p",{lovelace: BigInt(10_000_000)});
        console.log(tx)
        tx.collectFrom(utxos, Data.void())
        console.log(scriptRequirements)
        const txComplete = await tx.complete({setCollateral : 4_000_000n })
        console.log(txComplete.toCBOR())
        try{
            let submittedUnsignedTx = await wallet.cip106.submitUnsignedTx(txComplete.toCBOR());
            console.log(submittedUnsignedTx)
            setSubmittedUnsignedTx(submittedUnsignedTx)
            console.log(submittedUnsignedTx)
        }catch (e){
            setSubmittedUnsignedTx(e)
        }
    }



    async function getScriptRequirements() {
        let scriptRequirements = await wallet.cip106.getScriptRequirements();
        setScriptRequirements(scriptRequirements)
        console.log(scriptRequirements)
    }

    async function getScript() {
        let script = await wallet.cip106.getScript();
        setScript(script)
        console.log(script)
    }


    async function getCompletedTx() {
    try{
        let completedTx = await wallet.cip106.getCompletedTx(submittedUnsignedTx);
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
            <h1>CIP106 Connector</h1>
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
            <button onClick={signRedeemer}> Sign Redeemer</button>
            {redeemer && <p>Redeemer: {JSON.stringify(redeemer)}</p>}
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