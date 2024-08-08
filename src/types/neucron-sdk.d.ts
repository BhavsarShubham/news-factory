declare module 'neucron-sdk' {
    class NeucronSDK {
        authentication: {
            login(arg0: { email: any; password: any; }): unknown;
            Login(credentials: { email: string; password: string }): Promise<{ success: boolean }>;
            signUp(credentials: { email: string; password: string }): Promise<{ success: boolean }>;
        };
        wallet: {
            getWalletBalance(params: any): Promise<{ data: { balance: { summary: string } } }>;
            getAddressesByWalletId(params: any): Promise<{ data: { addresses: string[] } }>;
        };
    }

    export = NeucronSDK;
}