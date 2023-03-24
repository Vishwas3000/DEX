import { Chicle, Inter } from "next/font/google"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { exchangeAbi, contractAddresses } from "../constants/index"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { Card, useNotification, Button, Form } from "web3uikit"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
    return <>Hello</>
}
