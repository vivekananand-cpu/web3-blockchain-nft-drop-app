import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    //rinkeby is used for fake trial of money 
    <ThirdwebProvider desiredChainId={ChainId.Rinkeby}> 
  <Component {...pageProps} />
  </ThirdwebProvider>
  )
}

export default MyApp
