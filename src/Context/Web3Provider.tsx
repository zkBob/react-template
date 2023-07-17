import { useWalletClient } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { sepolia, polygon, goerli, optimism, optimismGoerli } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy';
import { ReactNode } from 'react';
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { HttpTransportConfig } from 'viem';

interface PropsWithChildren  {
    children: ReactNode
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [goerli],
    [publicProvider()],
)

const injected: InjectedConnector = new InjectedConnector({
    chains,
    options: {
        name: 'MetaMask',
    },
});
const config = createConfig({
    autoConnect: true,
    publicClient,
    webSocketPublicClient,
    // connectors: [injected, walletConnectV1]
})


// const walletConnectV1 = new WalletConnectLegacyConnector({
//     chains,
//     options: {
//         qrcode: true,
//     },
// });
// const walletConnectV2 = new WalletConnectConnector({
//   chains,
//   options: {
//     qrcode: true,
//     projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID,
//     name: 'zkBob',
//     relayUrl: 'wss://relay.walletconnect.org'
//   },
// });



export default (props: PropsWithChildren) => (
    <WagmiConfig config={config}>
        {props.children}
    </WagmiConfig>
);
