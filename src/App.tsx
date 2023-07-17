import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  ZkBobClient, ClientConfig, AccountConfig,
  ProverMode, TransferRequest, deriveSpendingKeyZkBob, TxType, DepositType
} from 'zkbob-client-js';
import { btoa } from 'buffer';
import { hexToBuf } from 'zkbob-client-js/lib/utils';
import {ethers} from 'ethers';

async function genShieldedAddress(client: ZkBobClient): Promise<string> {
  return await client.generateAddress();
}

async function withdrawShielded(amount: bigint, external_addr: string, client: ZkBobClient): Promise<{ jobId: string, txHash: string }[]> {

  const ready = await client.waitReadyToTransact();
  if (ready) {
    const txFee = (await client.feeEstimate([amount], TxType.Transfer, BigInt(0), false));

    console.log('Making a withdrawal...');
    const jobIds: string[] = await client.withdrawMulti(external_addr, amount, BigInt(0), txFee.relayerFee);
    console.log('Please wait relayer provide txHash%s %s...', jobIds.length > 1 ? 'es for jobs' : ' for job', jobIds.join(', '));

    return await client.waitJobsTxHashes(jobIds);
  } else {
    console.log('Timeout occured while waiting for the client to get ready, there could be a problem with state sync or connectivity error');

    throw Error('Client is in invalid state');
  }
}
function App() {

  const [client, setClient] = useState<ZkBobClient>();

  async function init(): Promise<void> {
    // Client configuration includes set of pools, chains, parameters and other options
    const clientConfig: ClientConfig = {
      pools: {
        'BOB-sepolia': {
          'chainId': 11155111,
          'poolAddress': '0x3bd088C19960A8B5d72E4e01847791BD0DD1C9E6',
          'tokenAddress': '0x2C74B18e2f84B78ac67428d0c7a9898515f0c46f',
          'relayerUrls': ['https://relayer.thgkjlr.website/'],
          // external service to speed-up proof calculation, optional
          'delegatedProverUrls': [],
          // file with archived pool state
          // (optional, needed to reduce sync time)
          'coldStorageConfigPath': '',
          'depositScheme': DepositType.SaltedPermit
        }
      },
      chains: {
        '11155111': {
          rpcUrls: ['https://rpc.sepolia.org'] // list of available JSON RPC endpoints
        },
      },
      snarkParams: {
        transferParamsUrl: './transfer_params_20022023.bin',
        transferVkUrl: './transfer_verification_key_20022023.json'
      },
      supportId: 'unique_string_generated_with_uuidv4',
      forcedMultithreading: undefined // multithreading config will be selected automatically
    };

    // creating a zkBob client without account to be worked on 'BOB-sepolia' pool
    const client = await ZkBobClient.create(clientConfig, 'BOB-sepolia');

    // now you can get relayer fee or pool limits for example
    const relayerFee = await client.atomicTxFee(TxType.Deposit);
    console.log(`Relayer deposit fee: ${relayerFee} Gwei`);
    console.log(`Pool deposit total limit: ${(await client.getLimits(undefined)).deposit.total} Gwei`);

    // now let's attach account generated from the arbitrary 12-words mnemonic:

    // const mnemonic = ethers.utils.entropyToMnemonic(hexToBuf("9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"))
    const mnemonic = ethers.utils.entropyToMnemonic(hexToBuf("9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"))
    // const sk = hexToBuf("9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08");
    const accountConfig: AccountConfig = {
      // spending key is a byte array which derived from mnemonic
      sk: deriveSpendingKeyZkBob(mnemonic),
      // pool alias which should be activated
      pool: 'BOB-sepolia',
      // the account should have no activity (incoming notes including) before that index
      // you can use -1 value only for newly created account or undefined (or 0) for full state sync
      birthindex: -1,
      // using local prover
      proverMode: ProverMode.Local,
    };
    await client.login(accountConfig);

    console.log(`Shielded account balance: ${await client.getTotalBalance()} Gwei`);
    console.log(client)
    setClient(client);
  }

  const handleGenaddress = async () => {
    console.log("client: ");
    console.log(client);
    console.log(await client?.generateAddress());
    
  }
  return (
    <div className="App">
      <button onClick={init}>Login</button>
      {client && <button onClick={handleGenaddress}>generate address</button>}
    </div>
  );
}

export default App;
