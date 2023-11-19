
import { SemaphoreEthers } from "@semaphore-protocol/data"
import addresses from "./abis/addresses.json"


const semaphore = new SemaphoreEthers("https://sepolia-rpc.scroll.io", {
    address: addresses.Semaphore,
});


export {semaphore}