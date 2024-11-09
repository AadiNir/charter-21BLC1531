import { MerkleTree } from 'merkletreejs';
import Web3 from 'web3';

const web3 = new Web3('https://sepolia.infura.io/v3/aa2e190113aa496b99adffb034d183b6');

// Function to convert to keccak256 Buffer
function keccak256ToBuffer(data) {
  return Buffer.from(web3.utils.keccak256(data).slice(2), 'hex');
}

// Commutative keccak256 hashing function (order does not matter)
function commutativeKeccak256(a, b) {
  // Ensure the two hashes are concatenated in a sorted order (commutative)
  return web3.utils.keccak256(Buffer.concat([a, b]));
}

async function main() {
    // Fetch block data from Sepolia network
    const blockData = await web3.eth.getBlock(7037713);
    const tr = blockData.transactions;

    // Generate Merkle leaves from transactions using keccak256
    const leaves = tr.map(x => keccak256ToBuffer(x));
    const tree = new MerkleTree(leaves, web3.utils.keccak256);

    // Generate Merkle Root
    const root = tree.getRoot();
    console.log('Merkle Root:', '0x' + root.toString('hex'));

    // Leaf to verify (example)
    const leaf = keccak256ToBuffer('0x8fa03f7d1667720e7482b65bbc873878b421d5aa9961edfd0cb9b7931f7a9982');
    console.log('Leaf to verify:', '0x' + leaf.toString('hex'));

    // Get proof for the leaf
    const proof = tree.getProof(leaf);
    console.log('Proof:', proof.map(p => '0x' + p.data.toString('hex')));

    // Verify the proof against the root using the commutative keccak256
    let computedHash = leaf;
    for (let i = 0; i < proof.length; i++) {
        const proofElement = proof[i].data;
        computedHash = commutativeKeccak256(computedHash, proofElement);
    }

    // Log the final computed hash and check if it matches the root
    console.log('Computed Hash:', '0x' + computedHash.toString('hex'));
    console.log('Proof is valid:', computedHash.toString('hex') === root.toString('hex'));

    // Now you can send `root`, `leaf`, and `proof` to the smart contract for verification
}

main();
