import { http, createConfig } from 'wagmi'
import { bsc } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

console.log(bsc);
const RPC_URL = 'https://services.tokenview.io/vipapi/nodeservice/bsc?apikey=W2kFupq7FkGGVYjZbbM3';

export const config = createConfig({
  chains: [bsc],
  connectors: [injected()],
  transports: {
    [bsc.id]: http(RPC_URL),
  },
});