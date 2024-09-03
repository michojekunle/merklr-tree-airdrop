const fs = require('fs');
const csv = require('csv-parser');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

// Read CSV file and parse the data
const csvFilePath = './airdrop.csv';
const users = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    // Assuming your CSV has columns "address" and "amount"
    const address = row['address'];
    const amount = row['amount'];
    const leafData = `${address},${amount}`;

    // Push each leaf to the array
    users.push(leafData);
  })
  .on('end', () => {
    // Convert the user data into hashed leaves
    const leaves = users.map((user) => keccak256(user));

    // Create a Merkle Tree from the leaves
    const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });;

    // Get the root hash of the Merkle Tree
    const rootHash = merkleTree.getRoot().toString('hex');

    // merkleProof for a specific address and amount value
    const leaf = keccak256('0x7429CbD5eD20736645723E972bE60B7F6BF5959c,150');
    const proof = merkleTree.getProof(leaf).map(x => x.data.toString('hex'));

    console.log('Merkle Proof for 0x598e6021E067F8f8Abe712C2b9Ebd478c0F967f0,100:', proof);

    // Verify the proof
    const isValid = merkleTree.verify(proof, leaf, rootHash);
    console.log('Is proof valid?', isValid);

    // Output the root hash
    console.log('Merkle Root Hash:', rootHash);
  });
