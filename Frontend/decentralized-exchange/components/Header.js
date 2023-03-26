import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav className="border-b-4 border-solid p-5 flex flex-row justify-between items-center">
            <h1 className="py-4 px-4 font-bold text-3xl">Decentralized Exchange</h1>
            <div className="flex flex-row items-center">
                <Link href="/" className="mr-4 p-6">
                    Swap
                </Link>
                <Link href="/buy-CDtoken" className="mr-4 p-6">
                    Buy CD Token
                </Link>
                <Link href="/liquidity" className="mr-4 p-6">
                    Liquidity
                </Link>
                <Link href="/requestAllowance" className="mr-4 p-6">
                    Request Allowance
                </Link>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
