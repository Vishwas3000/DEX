import styles from "../styles/Home.module.css"
import { Card, Form, useNotification, Button, Information } from "web3uikit"
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

    async function MintCryptoDevToken(data) {
        const EthValue = ethers.utils.parseEther(data.data[1].inputResult)
        const mintAmount = data.data[0].inputResult

        await MintCryptoDevTokenUtil(
            EthValue,
            mintAmount,
            contractAddress,
            cryptoDevTokenAbi,
            runContractFunction,
            handleMintSuccess
        )
        await setMintAmount(mintAmount)
    }
    async function handleMintSuccess(tx) {
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
        <div>
            <div className="">
                <Information
                    className=""
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
            <Form
                buttonConfig={{
                    theme: "primary",
                    text: "mint",
                }}
                onSubmit={MintCryptoDevToken}
                data={[
                    {
                        inputWidth: "30%",
                        name: "Crypto Dev Token amount",
                        type: "text",
                        value: "",
                        key: "CryptoDevAmount",
                    },
                    {
                        inputWidth: "30%",
                        name: "Eth Value",
                        type: "text",
                        value: "",
                        key: "EthValue",
                    },
                ]}
                title="Mint CD Token"
                id="main form"
                isDisabled={disableButton}
            />
        </div>
    )
}
