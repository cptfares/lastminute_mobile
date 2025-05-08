import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying LST Token with account:", deployer.address);

  const LSTToken = await ethers.getContractFactory("LSTToken");
  const token = await LSTToken.deploy();
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("LST Token deployed to:", address);

  // Save the contract address to use in our app
  const fs = require("fs");
  const envContent = `REACT_APP_LST_TOKEN_ADDRESS=${address}\n`;
  fs.writeFileSync(".env", envContent);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });