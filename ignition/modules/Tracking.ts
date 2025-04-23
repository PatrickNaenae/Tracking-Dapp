// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TrackingModule = buildModule("TrackingModule", (m) => {
  const tracking = m.contract("Tracking");

  return { tracking };
});

export default TrackingModule;
