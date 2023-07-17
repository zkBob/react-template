import { ZkBobClient, TxType } from "zkbob-client-js";

async function withdrawShielded(amount: bigint, external_addr: string, client: ZkBobClient): Promise<{ jobId: string, txHash: string }[]> {

    const ready = await client.waitReadyToTransact();
    if (ready) {
      const txFee = (await client.feeEstimate([amount], TxType.Transfer, undefined, false));
  
      console.log('Making a withdrawal...');
      const jobIds: string[] = await client.withdrawMulti(external_addr, amount, BigInt(0),undefined);
      console.log('Please wait relayer provide txHash%s %s...', jobIds.length > 1 ? 'es for jobs' : ' for job', jobIds.join(', '));
  
      return await client.waitJobsTxHashes(jobIds);
    } else {
      console.log('Timeout occured while waiting for the client to get ready, there could be a problem with state sync or connectivity error');
  
      throw Error('Client is in invalid state');
    }
  }

  export const Withdraw = () => {
    //Under construction
  }