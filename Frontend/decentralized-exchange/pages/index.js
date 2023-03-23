import Head from "next/head"
import Image from "next/image"
import { Chicle, Inter } from "next/font/google"
import styles from "@/styles/Home.module.css"
import { useMoralis } from "react-moralis"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()
    const chainIdString = chainId ? parseInt(chainId).toString() : "31337"

    return <></>
}
