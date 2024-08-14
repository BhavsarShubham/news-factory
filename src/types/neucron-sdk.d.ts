// src/types/neucron-sdk.d.ts

declare module 'neucron-sdk' {
    class NeucronSDK {
      // Authentication
      authentication: {
        login(credentials: { email: string; password: string }): Promise<AuthResponse>;
        signUp(credentials: { email: string; password: string }): Promise<{ success: boolean }>;
      };
  
      // Wallet
      wallet: {
        getWalletBalance(params: any): Promise<WalletBalanceResponse>;
        getAddressesByWalletId(params: any): Promise<AddressesResponse>;
      };
  
      // Transaction
      transactionModule: {
        createTransaction(accessToken: string, fromAddress: string, toAddress: string, amount: number): Promise<string>;
      };
  
      // Payment
      pay: {
        txSend(options: PayTransactionOptions): Promise<PayTransactionResponse>;
        txSpend(options: { outputs: { address: string; note?: string; amount: number }[] }): Promise<PayTransactionResponse>;
        payChannelTxn(options: { amount: number; date: string; receiverAddress: string; sequenceNum: number; time: string }): Promise<{ data: { txId: string; version: number; lockTime: number; sequence_Num: number; TxHex: string } }>;
        txMultipayc(options: { Input: { SequenceNum: number; Utxo_index: number }[]; LockTime: string; Outputs: { Amount: number; Asm: string }[] }): Promise<PayTransactionResponse>;
      };
  
      // Smart Contracts
      smartContracts: {
        deployContract(params: any): Promise<{ success: boolean; data: any }>;
        interactWithContract(params: any): Promise<{ success: boolean; data: any }>;
      };
  
      // Data Integrity
      dataIntegrity: {
        verifyData(params: any): Promise<{ success: boolean; data: any }>;
        hashData(params: any): Promise<{ success: boolean; data: { hash: string } }>;
      };
  
      // STAS Tokens
      stas: {
        createToken(params: any): Promise<{ success: boolean; data: any }>;
        transferToken(params: any): Promise<{ success: boolean; data: any }>;
      };
  
      // Team Management
      team: {
        createTeam(params: any): Promise<{ success: boolean; data: any }>;
        getTeamInfo(params: any): Promise<{ success: boolean; data: any }>;
      };
  
      // Asset Analysis
      assetyzer: {
        analyzeAsset(params: any): Promise<{ success: boolean; data: any }>;
        getAssetReport(params: any): Promise<{ success: boolean; data: any }>;
      };
  
      // Paymail
      paymail: {
        resolvePaymail(params: any): Promise<{ success: boolean; data: { address: string } }>;
        verifyPaymail(params: any): Promise<{ success: boolean; data: { verified: boolean } }>;
      };
  
      // Digital Signatures
      digitalsignature: {
        signMessage(params: { message: string }): Promise<{ success: boolean; data: { signature: string } }>;
        verifySignature(params: { message: string; signature: string }): Promise<{ success: boolean; data: { valid: boolean } }>;
      };
    }
  
    export = NeucronSDK;
  }
  