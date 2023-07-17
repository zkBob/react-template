import { ClientConfig, DepositType } from "zkbob-client-js";

export const config:ClientConfig = {
    pools: {
      'BOB-sepolia': {
        'chainId': 11155111,
        'poolAddress': '0x3bd088C19960A8B5d72E4e01847791BD0DD1C9E6',
        'tokenAddress': '0x2C74B18e2f84B78ac67428d0c7a9898515f0c46f',
        'relayerUrls': ['https://relayer.thgkjlr.website/'],
        'delegatedProverUrls': [],
        'coldStorageConfigPath': '',
        'depositScheme':DepositType.PermitV2
      }
    },
    chains: {
      '11155111': {
        rpcUrls: ['https://rpc.sepolia.org'] // list of available JSON RPC endpoints
      },
    },
    snarkParams: {
      transferParamsUrl: `${process.env.PUBLIC_URL}/params.bin`,
      transferVkUrl: `${process.env.PUBLIC_URL}/vk.json`
    },
    supportId: 'unique_string_generated_with_uuidv4',
    forcedMultithreading: undefined // multithreading config will be selected automatically
  }