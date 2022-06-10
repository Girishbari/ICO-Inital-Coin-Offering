import { useEffect, useState } from 'react'
import contract_abi from "./contractABI.json";
import { ethers } from "ethers";

import './App.css'

function App() {

  const contractAddress = '0x4E0d7594A25eb1df5D1707307Bf8a2F368364005';

  const [currentAccount, setCurrentAccount] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const [connect, setConnected] = useState("Connect wallet");
  const [value, setValue] = useState();
  const [Timing, setTiming] = useState();
  const [Tokens, setTokens] = useState();

  useEffect(() => {
    checkIfWalletConnected();

  }, [])

  const checkIfWalletConnected = async () => {
    try {

      const { ethereum } = window;
      if (!ethereum) {
        alert("Get Metamask");
        return;
      }
      else {
        console.log("We have an ethereum object", ethereum)

        const accounts = await ethereum.request({ method: "eth_accounts" })
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an account", account)
          setCurrentAccount(account);
          setConnected("Connected");
        }

      }


    } catch (error) {
      console.log("error from checkifwallet", error)

    }
  }

  const walletcall = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get Metamask");
        return;
      }
      else {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        })
        console.log("Connected successfully", accounts[0])
        setCurrentAccount(accounts[0]);
        setConnected("Connected");
      }

    } catch (error) {
      console.log("Error from walletcall", error)
    }

  }

  const RaisedAmount = async () => {
    try {

      const { ethereum } = window;
      if (currentAccount) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contract_abi,
          signer
        )

        const tx = await contract.totalRaisedAmount();
        console.log(tx);
        setTotalAmount(JSON.parse(tx));
      }

    } catch (error) {
      console.log("Error from RaisedAmount", error)

    }
  }


  const Investing = async () => {
    try {

      const { ethereum } = window;
      if (currentAccount) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contract_abi,
          signer
        )

        const tx = await contract.Invest({
          value: ethers.utils.parseEther(value)
        });
        console.log(tx);
        setTotalAmount(JSON.parse(tx));
      }

    } catch (error) {
      console.log("Error from Investing", error)

    }

  }

  const Timer = async () => {
    try {
      const { ethereum } = window;
      if (currentAccount) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contract_abi,
          signer
        )
        let tx = await contract.icoEndTime();
        console.log(tx);
        setTiming(JSON.parse(tx));


      }
    } catch (error) {
      console.log("Error from Timer", error)
    }
  }

  const Check_Allocated = async () => {
    try {
      const { ethereum } = window;
      if (currentAccount) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contract_abi,
          signer
        )
        let tx = await contract.balances(currentAccount);
        console.log(tx);
        setTokens(JSON.parse(tx));


      }
    } catch (error) {
      console.log("Error from Check_allocated", error)
    }

  }



  return (
    <div className="App">
      {/* Connect wallet with below  div */}
      <div>
        <button
          style={{ margin: '2rem' }}
          onClick={walletcall}>{connect}
        </button>
        <h3>Connect address: {currentAccount}</h3>

      </div>

      {/* See Total raised amount for ICO with below  div */}

      <div>
        <button
          style={{ margin: '2rem' }}
          onClick={RaisedAmount}>See Amount
        </button>
        <h3>Total Raised amount Raised(wei): {totalAmount}</h3>

      </div>

      {/* Invest this div with below  div */}

      <div>
        <input
          type="text"
          id="value"
          placeholder='0.1 ether'
          value={value}
          onChange={(e => setValue(e.target.value))}
          style={{ height: '10px', padding: '10px', marginBottom: '2rem' }}
        />
        <button
          style={{ margin: '1rem' }}
          onClick={Investing}>Invest
        </button>


      </div>

      {/* Check End Time with below  div */}

      <div>
        <button
          style={{ margin: '1rem' }}
          onClick={Timer}>Check End Time
        </button>
        <h3>ICO End Time: {Timing}</h3>

      </div>

      <div>
        <button
          style={{ margin: '1rem' }}
          onClick={Check_Allocated}>See my tokens
        </button>
        <h3>Your allocated Tokens: {Tokens}</h3>

      </div>



    </div>
  )
}


export default App
