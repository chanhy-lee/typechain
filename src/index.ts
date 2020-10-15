import * as CryptoJS from 'crypto-js';
import { createNew } from 'typescript';

class Block { // Create 'Block' structure.
    static calculateBlockHash = (
        index: number,
        previousHash: string,
        timestamp: number,
        data: string
        ): string => { // 'static' allows us to use method without making a 'Block'.
        return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
    };

    static validateStructure = (aBlock: Block): boolean => {
        return (
            typeof aBlock.index === 'number' &&
            typeof aBlock.hash === 'string' &&
            typeof aBlock.previousHash === 'string' &&
            typeof aBlock.timestamp === 'number' &&
            typeof aBlock.data === 'string'
        );
    };

    public index: number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;

    constructor(
        index: number,
        hash: string,
        previousHash: string,
        data: string,
        timestamp: number
        ) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }
}

const genesisBlock: Block = new Block(0, "2020", "", "First block", Math.round(new Date().getTime())); // First block.

let blockchain: Block[] = [genesisBlock];

const getBlockchain = (): Block[] => {
    return blockchain;
};

const getLatestBlock = (): Block => {
    return blockchain[blockchain.length - 1];
};

const getNewTimeStamp = (): number => {
    return Math.round(new Date().getTime());
};

const createNewBlock = (data: string): Block => {
    const previousBlock: Block = getLatestBlock();

    const newIndex: number = previousBlock.index + 1;
    const newTimeStamp: number = getNewTimeStamp();
    const newHash: string = Block.calculateBlockHash(
        newIndex,
        previousBlock.hash,
        newTimeStamp,
        data
    );

    const newBlock: Block = new Block(newIndex, newHash, previousBlock.hash, data, newTimeStamp);
    
    addBlock(newBlock);

    return newBlock;
};

const getHashForBlock = (aBlock: Block): string => {
    return Block.calculateBlockHash(aBlock.index, aBlock.previousHash, aBlock.timestamp, aBlock.data);
};

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
    if (!Block.validateStructure(candidateBlock)) {
        return false; 
    } else if (previousBlock.index + 1 !== candidateBlock.index) {
        return false;
    } else if (previousBlock.hash !== candidateBlock.previousHash) {
        return false;
    } else if (getHashForBlock(candidateBlock) !== candidateBlock.hash) {
        return false;
    } else {
        return true;
    }
};

const addBlock = (candidateBlock: Block): void => {
    if (isBlockValid(candidateBlock, getLatestBlock())) {
        blockchain.push(candidateBlock);
    }
}

createNewBlock("Hello");
createNewBlock("Bye");

console.log(getBlockchain());

export{};