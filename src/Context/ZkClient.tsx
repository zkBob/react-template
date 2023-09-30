import { ethers } from "ethers";
import { createContext, useState, ReactNode, FC } from "react";
import { ZkBobClient, AccountConfig, ClientConfig, ProverMode, deriveSpendingKeyZkBob } from "zkbob-client-js";
import { hexToBuf } from "zkbob-client-js/lib/utils";
import { config } from "../config";
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
    const client = await ZkBobClient.create(config, 'BOB-sepolia');
    // const mnemonic = "general team spot pass shoulder domain axis crazy since kind athlete buzz"
    // const accountConfig: AccountConfig = {
    //   sk: deriveSpendingKeyZkBob("general team spot pass shoulder domain axis crazy since kind athlete buzz"),
    //   pool: 'BOB-sepolia',
    //   birthindex: -1,
    //   proverMode: ProverMode.Local,
    // };
    // await client.login(accountConfig);

    // console.log(`Shielded account balance: ${await client.getTotalBalance()} Gwei`);
    // console.log(client)
    // setZkClient(client);
  }

  return <ZkClientContext.Provider value={{ zkClient, login }} >
    {props.children}
  </ZkClientContext.Provider>

}