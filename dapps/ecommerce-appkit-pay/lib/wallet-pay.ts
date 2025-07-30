import { useCallback, useEffect, useState, useRef } from "react";
import { IUniversalProvider, NamespaceConfig, UniversalProvider } from "@walletconnect/universal-provider";
import { AppKit, createAppKit } from "@reown/appkit";
import { mainnet, sepolia} from "@reown/appkit/networks"

type Client = IUniversalProvider["client"];


type WalletPayRequest = {
  version: string;
  orderId: string;
  acceptedPayments: {
    recipient: string;
    asset: string;
    amount: `0x${string}`;
  }[];
  expiry: number;
}
const namespacesToRequest = {
    eip155: {
      chains: ["eip155:1", "eip155:11155111"],
      methods: ["eth_sendTransaction", "eth_sign", "personal_sign", "wallet_pay"],
      events: ['eth_sendTransaction', 'personal_sign'],
    },
  }  as NamespaceConfig;

type SendResponse = {
    success: boolean;
    message?: string;
}

export function useWalletPay(){

  const instancesRef = useRef<{
    client?: Client;
    provider?: IUniversalProvider;
    appkit?: AppKit;
  }>({});

  const initProvider = async (): Promise<{
    client: Client;
    provider: IUniversalProvider;
    appkit: AppKit;
  }> => {
    try {
      const origin = window.location.origin;
      console.log("Initializing provider", origin);
      const newProvider = await UniversalProvider.init({
          projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
          metadata: {
            name: "React App",
            description: "App to test WalletConnect network",
            url: origin,
            icons: [],
          },
        });
        
        const newClient = newProvider.client;
        const newAppkit = await createModal(newProvider);
        
        instancesRef.current = {
          client: newClient,
          provider: newProvider,
          appkit: newAppkit
        };
        
        return {
          client: newClient,
          provider: newProvider,
          appkit: newAppkit
        };
    } catch (error) {
      console.log("Error initializing provider", error);
      throw error;
    }
  }


  


  const createModal = async (provider: IUniversalProvider): Promise<AppKit> => {
    if (instancesRef.current.appkit && instancesRef.current.provider === provider) {
      console.log("appkit already exists", instancesRef.current.appkit);
      return instancesRef.current.appkit;
    }
   
    const newAppkit = createAppKit({
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
      themeMode: "dark",
      manualWCControl: true,
      //@ts-ignore
      universalProvider: provider,
      networks: [mainnet, sepolia],
      metadata: {
        name: "React App",
        description: "App to test WalletConnect network",
        url: location.origin,
        icons: [],
      },
      showWallets: true,
      enableEIP6963: false, // Disable 6963 by default
      enableInjected: false, // Disable injected by default
      enableCoinbase: true, // Default to true
      enableWalletConnect: true, // Default to true,
      features: {
        email: false,
        socials: false,
      },
    });
    
    return newAppkit;
  };

  const send = async (
    walletPayRequest: WalletPayRequest,
    instances?: {
      client: Client;
      provider: IUniversalProvider;
      appkit: AppKit;
    }
  ): Promise<SendResponse> => {
    const client = instances?.client
    const provider = instances?.provider
    const appkit = instances?.appkit
    
    if (!client || !provider || !appkit) {
        console.log("Client, provider, or appkit is not initialized", {
          client: client, 
          provider: provider, 
          appkit: appkit
        });
        return { success: false, message: "Client, provider, or appkit is not initialized" };
    };
    try {
        appkit?.open();
        appkit?.subscribeState((state: { open: boolean }) => {
            // the modal was closed so reject the promise
            if (!state.open && !provider.session) {
              throw new Error("Connection request reset. Please try again.");
            }
          });
          provider.namespaces = undefined;
          const { uri, approval } = await client.connect({
            optionalNamespaces: namespacesToRequest,
            walletPay: walletPayRequest,
          });
              
      provider.events.emit("display_uri", uri);
      console.log("uri", uri);
      const session = await approval();
      console.log("session", session);

      if (!session) {
        throw new Error("Session is not connected");
      }

      const walletPayRequestIndex = session.pendingRequests?.findIndex(request => request.method === "wallet_pay");
      
      if(walletPayRequestIndex && session.pendingRequestsResults && session.pendingRequestsResults[walletPayRequestIndex]){
        const result = session.pendingRequestsResults[walletPayRequestIndex];
        console.log("result", result);
        return { success: true, message: "wallet_pay request processed" };
      }
      return { success: false, message: "wallet_pay request not processed" };
    } catch (error) {
        console.log("Send wallet_pay error", error);
      return { success: false, message: (error as Error).message };
    } finally {
      appkit?.close();
      appkit?.disconnect();
    }
  }


  return {
    send,
    initProvider
  }
}