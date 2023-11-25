import React from 'react';
import { useEffect, useState } from 'react';
import {Lucid } from 'lucid-cardano'
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


    async function enableWallet() {
        let api = await window.cardano.broclan.enable();
        console.log(api)
        if (api){
            setWallet(api)
            const lucid = await new Lucid()
            lucid.selectWallet(api)
            setLucid(lucid)
        }
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

    async function submitTx(tx) {
        let submittedTx = await wallet.submitTx(tx);
        setSubmittedTx(submittedTx)
        console.log(submittedTx)
    }

    async function submitUnsignedTx(tx) {
        let submittedUnsignedTx = await wallet.submitUnsignedTx(tx);
        setSubmittedUnsignedTx(submittedUnsignedTx)
        console.log(submittedUnsignedTx)
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

    async function getCompletedTx(txId) {
        let completedTx = await wallet.getCompletedTx(txId);
        setCompletedTx(completedTx)
        console.log(completedTx)
    }



    return (
        <div className="connector">
            <h1>Connector</h1>
            <p>Wallet: {JSON.stringify(wallet)}</p>
           {!wallet ?  <button onClick={enableWallet}> Enable BroClan</button> : <button onClick={() =>setWallet(null)}> Disable Wallet</button>}
            <br/>
            {wallet &&<div> <button onClick={getBalance}> Get Balance</button>
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

            <button onClick={() => submitTx(tx)}> Submit Tx</button>
            {submittedTx && <p>Submitted Tx: {JSON.stringify(submittedTx)}</p>}

            <button onClick={() => submitUnsignedTx(tx)}> Submit Unsigned Tx</button>
            {submittedUnsignedTx && <p>Submitted Unsigned Tx: {JSON.stringify(submittedUnsignedTx)}</p>}

            <button onClick={getCollateralAddress}> Get Collateral Address</button>
            {collateralAddress && <p>Collateral Address: {JSON.stringify(collateralAddress)}</p>}

            <button onClick={getScriptRequirements}> Get Script Requirements</button>
            {scriptRequirements && <p>Script Requirements: {JSON.stringify(scriptRequirements)}</p>}

            <button onClick={getScript}> Get Script</button>
            {script && <p>Script: {JSON.stringify(script)}</p>}

            <button onClick={() => getCompletedTx(txId)}> Get Completed Tx</button>
            {completedTx && <p>Completed Tx: {JSON.stringify(completedTx)}</p>}
            </div>
            }
        </div>
    )
}

export default Connector