import { ethers } from "ethers";
import { createContext, useState, ReactNode, FC } from "react";
import { ZkBobClient, AccountConfig, ClientConfig, ProverMode, deriveSpendingKeyZkBob } from "zkbob-client-js";
import { hexToBuf } from "zkbob-client-js/lib/utils";
import { clientConfig } from "../config";
interface Props {
  children: React.ReactNode;
}


interface IZkClientContext {
  zkClient: ZkBobClient | undefined,
  login: undefined | (() => Promise<void>)
};

const ZkClientContext = createContext<IZkClientContext>({
  zkClient: undefined,
  login: undefined
});
export default ZkClientContext;

interface ZkClientProviderProps {
  children: ReactNode
}
export const ZkClientProvider = (props: ZkClientProviderProps) => {

  const [zkClient, setZkClient] = useState<ZkBobClient | undefined>(undefined);


  async function login(): Promise<void> {
    const client = await ZkBobClient.create(clientConfig, 'BOB-sepolia');
    const mnemonic = ethers.utils.entropyToMnemonic(hexToBuf("9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"))
    const accountConfig: AccountConfig = {
      sk: deriveSpendingKeyZkBob(mnemonic),
      pool: 'BOB-sepolia',
      birthindex: -1,
      proverMode: ProverMode.Local,
    };
    await client.login(accountConfig);

    console.log(`Shielded account balance: ${await client.getTotalBalance()} Gwei`);
    console.log(client)
    setZkClient(client);
  }

  return <ZkClientContext.Provider value={{ zkClient, login }} >
    {props.children}
  </ZkClientContext.Provider>

}