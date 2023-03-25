import styles from "../styles/Home.module.css"
import { Card, Input, useNotification, Button, Information } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { cryptoDevTokenAbi, contractAddresses } from "../constants/index"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { GetMinimumTokenMintUtil, GetTotalCDTokenOwnUtil, MintCryptoDevTokenUtil } from "../utils/CDTokenFunctions"

export default function MintCryptoDev() {
    const { isWeb3Enabled, account } = useMoralis()
    const { chainId } = useMoralis()
    const { runContractFunction } = useWeb3Contract()

    const [minTokenMint, setMinTokenMint] = useState("")
    const [currentCDOwned, setCurrentCDOwned] = useState("")
    const [mintAmount, setMintAmount] = useState("")
    const [EthValue, setEthValue] = useState("")
    const [disableButton, setDisableButton] = useState(false)

    const chainIdString = chainId ? parseInt(chainId).toString() : "31337"

    const dispatch = useNotification()

    const contractAddress = contractAddresses[chainIdString].CryptoDevToken[0]

    useEffect(() => {
        GetMinimumTokenMint()
        GetTotalCDTokenOwn()
    }, [isWeb3Enabled, mintAmount])

    async function GetMinimumTokenMint() {
        const minTokenMint = await GetMinimumTokenMintUtil(cryptoDevTokenAbi, contractAddress, runContractFunction)
        setMinTokenMint(minTokenMint)
    }

    async function GetTotalCDTokenOwn() {
        const currentCDOwned = await GetTotalCDTokenOwnUtil(
            cryptoDevTokenAbi,
            contractAddress,
            runContractFunction,
            account
        )
        setCurrentCDOwned(currentCDOwned)
    }

    async function MintCryptoDevToken() {
        await MintCryptoDevTokenUtil(
            EthValue,
            mintAmount,
            contractAddress,
            cryptoDevTokenAbi,
            runContractFunction,
            handleMintSuccess
        )
    }
    async function handleMintSuccess(tx) {
        console.log(mintAmount)
        await tx.wait(1)
        dispatch({
            type: "success",
            title: "NFT listed",
            position: "topR",
            message: `Minted ${mintAmount} CryptoDevToken`,
        })
        setMintAmount(0)
        setDisableButton(false)
    }

    return (
        <div className=" flex flex-col p-2 space-y-10">
            <div className="flex flex-col p-2 place-content-evenly space-y-4">
                <Information
                    className="p-5"
                    information={`${minTokenMint} CDT`}
                    topic="Minimum Token to mint"
                    fontSize="text-2xl"
                />
                <Information
                    className=""
                    information={`${currentCDOwned} CDT`}
                    topic="Current CryptoDevToken Owned"
                    fontSize="text-2xl"
                />
            </div>

            <div className="px-10 space-y-5">
                <h1 className="text-2xl font-bold text-sky-900">Mint CD Token</h1>
                <Input
                    label="CD Token"
                    onChange={(event) => {
                        setMintAmount(event.target.value)
                    }}
                />
                <Input
                    label="Eth Value"
                    onChange={(event) => {
                        setEthValue(event.target.value)
                    }}
                />
                <Button
                    text="Mint"
                    color="green"
                    theme="colored"
                    isLoading={disableButton}
                    onClick={() => {
                        setDisableButton(true)
                        MintCryptoDevToken()
                    }}
                />
            </div>
        </div>
    )
}
