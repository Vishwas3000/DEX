import styles from "../styles/Home.module.css"
import { Card, Form, useNotification, Button } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { cryptoDevTokenAbi, contractAddresses } from "../constants/index"
import { ethers } from "ethers"
import { useEffect, useState } from "react"

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
        const minTokenMintOpt = {
            abi: cryptoDevTokenAbi,
            contractAddress: contractAddress,
            functionName: "MIN_TOKEN_TO_MINT",
        }

        await runContractFunction({
            params: minTokenMintOpt,
            onSuccess: (result) => setMinTokenMint(ethers.utils.formatUnits(result, 0)),
            onError: (error) => console.log(error),
        })
    }

    async function GetTotalCDTokenOwn() {
        const currentCDOwnedOpt = {
            abi: cryptoDevTokenAbi,
            contractAddress: contractAddress,
            functionName: "balanceOf",
            params: { account: account },
        }
        console.log("account: ", account)

        await runContractFunction({
            params: currentCDOwnedOpt,
            onSuccess: (result) => setCurrentCDOwned(ethers.utils.formatUnits(result, 18)),
            onError: (error) => console.log(error),
        })
    }

    async function MintCryptoDevToken(data) {
        console.log("Minting...")

        const EthValue = ethers.utils.parseEther(data.data[1].inputResult)
        const mintAmount = data.data[0].inputResult

        console.log("Minting " + mintAmount + " CryptoDevToken")
        console.log("eth sent " + EthValue + " Eth")

        const mintOption = {
            abi: cryptoDevTokenAbi,
            contractAddress: contractAddress,
            functionName: "mint",
            msgValue: EthValue,
            params: { amount: mintAmount },
        }

        await runContractFunction({
            params: mintOption,
            onSuccess: handleMintSuccess,
            onError: (error) => console.log(error),
        })
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
                <div>Minimum token to Mint : {minTokenMint} CD </div>
                <div>Your current CD token : {currentCDOwned} CD</div>
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
                // customFooter={<Button type="submit" text="Submit" onClick={MintCryptoDevToken} />}
            />
        </div>
    )
}
