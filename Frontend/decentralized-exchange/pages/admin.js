import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { Card, Input, useNotification, Button, Information } from "web3uikit"
import { proxyAbi } from "../constants/index"
import contractAddresses from "../constants/contractAddressess.json" assert { type: "json" }

export default function Home() {
    const { isWeb3Enabled, chainId, account } = useMoralis()
    const { runContractFunction } = useWeb3Contract()
    const chainIdString = chainId ? parseInt(chainId).toString() : "31337"

    useEffect(() => {
        getAdminProxy()
    }, [])

    async function getAdminProxy() {
        const getProxyAdminOpt = {
            abi: proxyAbi,
            contractAddress: contractAddresses[chainIdString]["Proxy"],
            functionName: "admin",
            params: {},
        }

        let proxyAdmin = await runContractFunction({
            params: getProxyAdminOpt,
            onError: console.error("Get admin failed"),
            onSuccess: console.log("Get admin success"),
        })

        console.log("proxyAdmin", proxyAdmin)
    }

    return (
        <div>
            {account == contractAddresses[chainIdString]["ProxyAdmin"] ? <div> Hello_Admin</div> : <div>Hello</div>}
            <Button onClick={getAdminProxy}>Get Admin</Button>
        </div>
    )
}
