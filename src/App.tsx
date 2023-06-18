import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  ZkBobClient, ClientConfig, AccountConfig,
  ProverMode, TransferRequest, deriveSpendingKeyZkBob, TxType
} from 'zkbob-client-js';
import { btoa } from 'buffer';
import { hexToBuf } from 'zkbob-client-js/lib/utils';
import {ethers} from 'ethers';
import { ZkClientProvider } from './Context/ZkClient';
import { Auth } from './Components/Auth';
import { Address } from './Components/Address';

async function genShieldedAddress(client: ZkBobClient): Promise<string> {
  return await client.generateAddress();
}

async function withdrawShielded(amount: bigint, external_addr: string, client: ZkBobClient): Promise<{ jobId: string, txHash: string }[]> {

  const ready = await client.waitReadyToTransact();
  if (ready) {
    const txFee = (await client.feeEstimate([amount], TxType.Transfer, false));

    console.log('Making a withdrawal...');
    const jobIds: string[] = await client.withdrawMulti(external_addr, amount, txFee.totalPerTx);
    console.log('Please wait relayer provide txHash%s %s...', jobIds.length > 1 ? 'es for jobs' : ' for job', jobIds.join(', '));

    return await client.waitJobsTxHashes(jobIds);
  } else {
    console.log('Timeout occured while waiting for the client to get ready, there could be a problem with state sync or connectivity error');

    throw Error('Client is in invalid state');
  }
}
function App() {

  return (
    <div className="App">
      <ZkClientProvider>
        <Auth/>
        <Address/>
      </ZkClientProvider>

    </div>
  );
}

export default App;
