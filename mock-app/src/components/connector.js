import React from 'react';
import { useEffect, useState } from 'react';
import {Blockfrost, Lucid , C , TxComplete} from 'lucid-cardano'
import "./connector.css"
// This is the connector component. It is the component that will be used to connect to the wallet under cardano.wallet and interact with the blockchain. 

function Connector() {
    const [wallet, setWallet] = useState(null);
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


    async function enableWallet(walletName) {
        let api = await window.cardano[walletName].enable();
        if (api){
            setWallet(api)
            const lucid = await  Lucid.new( new Blockfrost("https://passthrough.broclan.io", "preprod"),  "Preprod")
            lucid.selectWallet(api)
            setLucid(lucid)
            console.log(await lucid.wallet.getUtxos())

        }
    }

    async function disableWallet() {
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
        let utxos = await wallet.getUtxos();
        console.log(utxos)
        const lucidUtxos = await lucid.wallet.getUtxos()
        console.log(lucidUtxos)
        setUtxos(utxos)
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
        try{
        let  uint8Array = typeof completedTx[0] === 'string' ?  new Uint8Array(completedTx[0].match(/.{2}/g).map(byte => parseInt(byte, 16))) : completedTx[0];
        let tx =  new  TxComplete(lucid, C.Transaction.from_bytes(uint8Array)) 
        let txComplete =  await tx.assemble(completedTx[1]).complete()
        let submittedTx = await wallet.submitTx(txComplete.toString());
        setSubmittedTx(submittedTx)
        console.log(submittedTx)
        }catch (e){
            setSubmittedTx("Error"+ e.message   )
        }
    }

    async function submitUnsignedTx() {
        let script = await wallet.getScript();
        let scriptRequirements = await wallet.getScriptRequirements();
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
            let submittedUnsignedTx = await wallet.submitUnsignedTx(txComplete.toString());
            setSubmittedUnsignedTx(submittedUnsignedTx)
            console.log(submittedUnsignedTx)
        }catch (e){
            setSubmittedUnsignedTx(e)
        }
    }

    async function getCollateralAddress() {
        let collateralAddress = await wallet.getCollateralAddress();
        setCollateralAddress(collateralAddress)
        console.log(collateralAddress)
    }

    async function getScriptRequirements() {
        let scriptRequirements = await wallet.getScriptRequirements();
        setScriptRequirements(scriptRequirements)
        console.log(scriptRequirements)
    }

    async function getScript() {
        let script = await wallet.getScript();
        setScript(script)
        console.log(script)
    }

    async function getCompletedTx() {
    try{
        let completedTx = await wallet.getCompletedTx(submittedUnsignedTx);
        setCompletedTx(completedTx)
        console.log(completedTx)
    }catch(e){
        setCompletedTx(e)
        console.log(e)
    }
    }



    return (
        <div className="connector">
            <h1>Connector</h1>
            <p>Wallet: {JSON.stringify(wallet)}</p>
           {!wallet ?  
             <div><button onClick={() => enableWallet("broclan")}> Enable BroClan</button><button onClick={() => enableWallet("nami")}> Enable Nami</button> </div> : <button onClick={disableWallet}> Disable Wallet</button>
             
             }
            {wallet &&<div className='apis'> 
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
            <button onClick={getCollateralAddress}> Get Collateral Address</button>
            {collateralAddress && <p>Collateral Address: {JSON.stringify(collateralAddress)}</p>}
            <button onClick={getScriptRequirements}> Get Script Requirements</button>
            {scriptRequirements && <p>Script Requirements: {JSON.stringify(scriptRequirements)}</p>}
            <button onClick={getScript}> Get Script</button>
            {script && <p>Script: {JSON.stringify(script)}</p>}
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