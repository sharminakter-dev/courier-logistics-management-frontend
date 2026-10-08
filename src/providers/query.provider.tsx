import React, { Children, ReactNode } from 'react';
import {environmentManager, QueryClient, QueryClientProvider} from "@tanstack/react-query"

function makeQueryClient(){
    return new QueryClient({
        defaultOptions:{
            queries: {
                staleTime: 60 * 10000,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient(){
    if(environmentManager.isServer()){
        return makeQueryClient();
    }else{
        if(!browserQueryClient){
            browserQueryClient = makeQueryClient();
        }

        return browserQueryClient;
    }
}

function QueryProvider({children}: {children: ReactNode}) {

    const QueryClient = getQueryClient();

  return (
    <QueryClientProvider client={QueryClient}>
        {children}
    </QueryClientProvider>
  )
}

export default QueryProvider