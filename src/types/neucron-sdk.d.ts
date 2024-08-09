declare module 'neucron-sdk' {
    class NeucronSDK {
        authentication: {
            login(credentials: { email: string; password: string }): Promise<{ success: boolean }>;
            signUp(credentials: { email: string; password: string }): Promise<{ success: boolean }>;
        };
        wallet: {
            getWalletBalance(params: any): Promise<{ data: { balance: { summary: string } } }>;
            getAddressesByWalletId(params: any): Promise<{ data: { addresses: string[] } }>;
        };
        transactionModule: {
            createTransaction(transactionData: any): Promise<{ data: { transactionLink: string } }>;
        };
    }

    export = NeucronSDK;
}
