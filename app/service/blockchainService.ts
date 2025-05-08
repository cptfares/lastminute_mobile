import { ethers } from 'ethers';
import { LSTTokenABI } from '../contracts/LSTTokenABI';
import axios, { AxiosInstance } from 'axios';
import { CONTRACT_ADDRESS, NETWORK_URL, API_URL, LST_USD_PRICE, OWNER_PRIVATE_KEY } from '../config/blockchain';
import { LSTToken } from '../../typechain-types/contracts/LSTToken';
import { LSTToken__factory } from '../../typechain-types/factories/contracts/LSTToken__factory';

class BlockchainService {
    private provider: ethers.JsonRpcProvider;
    private contract: LSTToken;
    private api: AxiosInstance;
    private relayerWallet!: ethers.Wallet; // Using definite assignment assertion

    constructor() {
        this.provider = new ethers.JsonRpcProvider(NETWORK_URL);
        this.contract = LSTToken__factory.connect(CONTRACT_ADDRESS, this.provider);
        this.api = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Initialize relayer wallet with owner's private key
        if (!OWNER_PRIVATE_KEY) {
            throw new Error('Owner private key not configured');
        }
        this.relayerWallet = new ethers.Wallet(OWNER_PRIVATE_KEY, this.provider);
    }

    async connectWallet(privateKey: string) {
        return new ethers.Wallet(privateKey, this.provider);
    }

    async getNativeBalance(address: string): Promise<string> {
        const balance = await this.provider.getBalance(address);
        return ethers.formatEther(balance);
    }

    async getBalance(address: string): Promise<string> {
        const checksummedAddress = ethers.getAddress(address);
        const balance = await this.contract.balanceOf(checksummedAddress);
        return ethers.formatEther(balance);
    }

    private async getDomain() {
        const chainId = (await this.provider.getNetwork()).chainId;
        return {
            name: 'LastMinute Token',
            version: '1',
            chainId: chainId,
            verifyingContract: CONTRACT_ADDRESS
        };
    }

    private async getTransferTypedData(from: string, to: string, amount: string, nonce: bigint) {
        const domain = await this.getDomain();
        return {
            types: {
                Transfer: [
                    { name: 'from', type: 'address' },
                    { name: 'to', type: 'address' },
                    { name: 'amount', type: 'uint256' },
                    { name: 'nonce', type: 'uint256' }
                ]
            },
            primaryType: 'Transfer',
            domain,
            message: {
                from,
                to,
                amount: ethers.parseEther(amount),
                nonce
            }
        };
    }

    async transferWithoutGas(from: ethers.Wallet, to: string, amount: string) {
        try {
            // Get current nonce
            const nonce = await this.contract.getNonce(from.address);
            
            // Prepare typed data for signing
            const typedData = await this.getTransferTypedData(
                from.address,
                to,
                amount,
                nonce
            );

            // Sign the transaction
            const signature = await from.signTypedData(
                typedData.domain,
                typedData.types,
                typedData.message
            );

            // Execute meta-transaction using relayer
            const tx = await this.contract.connect(this.relayerWallet).executeMetaTransfer(
                from.address,
                to,
                ethers.parseEther(amount),
                nonce,
                signature
            );

            return await tx.wait();
        } catch (error) {
            console.error('Error in gasless transfer:', error);
            throw error;
        }
    }

    async transfer(from: ethers.Wallet, to: string, amount: string) {
        return this.transferWithoutGas(from, to, amount);
    }

    async approve(from: ethers.Wallet, spender: string, amount: string) {
        const tokenWithSigner = this.contract.connect(from);
        const tx = await tokenWithSigner.approve(spender, ethers.parseEther(amount));
        return await tx.wait();
    }

    async mint(owner: ethers.Wallet, to: string, amount: string) {
        const tokenWithSigner = this.contract.connect(owner);
        const tx = await tokenWithSigner.mint(to, ethers.parseEther(amount));
        return await tx.wait();
    }

    async getWalletAddress(userId: string): Promise<string | null> {
        try {
            const response = await this.api.get(`/users/${userId}/wallet`);
            return response.data.walletAddress;
        } catch (error) {
            console.error('Error fetching wallet address:', error);
            return null;
        }
    }

    async getLSTPrice(): Promise<number> {
        // In a production environment, this would fetch from a price oracle
        return LST_USD_PRICE;
    }

    async purchaseLST(wallet: ethers.Wallet, amountInUSD: number): Promise<boolean> {
        try {
            if (!OWNER_PRIVATE_KEY) {
                throw new Error('Contract owner private key not configured');
            }

            const lstAmount = amountInUSD / LST_USD_PRICE;
            const ownerWallet = new ethers.Wallet(OWNER_PRIVATE_KEY, this.provider);
            
            // Check if owner has minting rights
            const tokenWithSigner = this.contract.connect(ownerWallet);
            
            // Mint new tokens to the user's wallet
            const mintTx = await tokenWithSigner.mint(
                await wallet.getAddress(), 
                ethers.parseEther(lstAmount.toString())
            );
            await mintTx.wait();
            return true;
        } catch (error: any) { // Type assertion for error
            console.error('Error purchasing LST:', error);
            if (typeof error === 'object' && error !== null) {
                if ('code' in error && error.code === 'INSUFFICIENT_FUNDS') {
                    throw new Error('Insufficient funds for gas fee');
                } else if ('message' in error && typeof error.message === 'string' && error.message.includes('execution reverted')) {
                    throw new Error('Transaction failed - possible contract error');
                }
            }
            throw error;
        }
    }
}

export const blockchainService = new BlockchainService();