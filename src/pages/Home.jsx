import { useWeb3React } from "@web3-react/core";
import { injected } from "../lib/connectors";
import { useEffect, useState } from "react";
import Card from "../components/product/Card";

const Home = () => {
  const [balance, setBalance] = useState(""); // 토큰

  // 사용자가 연결된 네트워크를 id가 아닌 name 또는 symbol로 보여주기 위한 배열
  const chainIds = {
    1: { name: "Ethereum mainnet", symbol: "ETH" },
    3: { name: "Ropsten", symbol: "RopstenETH" },
    4: { name: "Rinkeby", symbol: "RinkebyETH" },
    5: { name: "Goerli", symbol: "GoerliETH" },
    42: { name: "Kovan", symbol: "KovanETH" },
    11155111: { name: "Sepolia", symbol: "SepoliaETH" },
    56: { name: "Binance Smart Chain Mainnet", symbol: "BNB" },
    97: { name: "Binance Smart Chain Testnet", symbol: "tBNB" },
    43114: { name: "Avalanche C-Chain", symbol: "AVAX" },
    137: { name: "Polygon Mainnet", symbol: "MATIC" },
    80001: { name: "Mumbai", symbol: "MATIC" },
    42161: { name: "Arbitrum One", symbol: "ETH" },
    10: { name: "Optimism", symbol: "ETH" },
    250: { name: "Fantom Opera", symbol: "FTM" },
    8217: { name: "Klaytn Mainnet Cypress", symbol: "KLAY" },
    1001: { name: "baobob", symbol: "KLAY" },
    61: { name: "Ethereum Classic Mainnet", symbol: "ETC" },
  };

  /* web3 react에서 제공하는 함수와 변수들
        connector: 현재 dapp에 연결된 월렛의 connector 값
        library: web3 provider 제공
        chainId: dapp에 연결된 account의 chainId
        account: dapp에 연결된 account address
        active: dapp 유저가 로그인 된 상태인지 체크
        activate: dapp 월렛 연결 기능 수행함수
        deactivate: dapp 월렛 해제 수행함수
    */
  const { chainId, account, library, active, activate, deactivate } =
    useWeb3React();
  console.log(injected);

  // 연결 버튼 눌렀을 때 대준 내 목소리가 들려??
  const handdleConnect = () => {
    // 만약 이미 연결 돼있으면 연결 해제
    if (active) {
      deactivate();
      return;
    }

    // 메타마스크 계정
    activate(injected, (error) => {
      // 크롬 익스텐션 없을 경우 오류 핸들링
      if ("/No Ethereum provider was found on window.ethereum/".test(error)) {
        window.open("https://metamask.io/download.html");
      }
    });
  };

  useEffect(() => {
    // 계정 연결 됐으면
    if (account) {
      // 계정에 연결된 네트워크 코인 가져오기
      library?.getBalance(account).then((result) => {
        setBalance(result._hex / 10 ** 18); // 16진수로 보기 힘들게 나와서 바꿔주기
        console.log("result : ", result);
      });
    }
  }, [account]);

  const testProductList = {
    code: 200,
    message: "",
    data: {
      items: [
        {
          itemId: 100111,
          name: "이쁜 옷1",
          image1: "image1",
          price: 100,
          rate: 3.4,
          reviewCount: 10,
          remaining: 9,
        },
        {
          itemId: 100112,
          name: "이쁜 옷2",
          image1: "image1",
          price: 100,
          rate: 3.4,
          reviewCount: 10,
          remaining: 9,
        },
        {
          itemId: 100113,
          name: "이쁜 옷3",
          image1: "image1",
          price: 100,
          rate: 3.4,
          reviewCount: 10,
          remaining: 9,
        },
        {
          itemId: 100114,
          name: "이쁜 옷3",
          image1: "image1",
          price: 100,
          rate: 3.4,
          reviewCount: 10,
          remaining: 9,
        },
        {
          itemId: 200115,
          name: "이쁜 옷3",
          image1: "image1",
          price: 100,
          rate: 3.4,
          reviewCount: 10,
          remaining: 9,
        },
        {
          itemId: 300110,
          name: "이쁜 옷3",
          image1: "image1",
          price: 100,
          rate: 3.4,
          reviewCount: 10,
          remaining: 9,
        },
      ],
    },
  };

  return (
    <div>
      <div>
        <p>Account: {account}</p>
        <p>ChainId: {chainIds[chainId]?.name}</p>
        <p>
          Balance : {active ? balance + " " + chainIds[chainId]?.symbol : ""}
        </p>
      </div>
      <div>
        <button type="button" onClick={handdleConnect}>
          {active ? "disconnect" : "connect"}
        </button>
      </div>

      <div className="card-list">
        {testProductList.data.items.map((product) => (
          <Card key={product.itemId} product={product} />
        ))}
      </div>

      <style jsx>{`
        .card-list {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
          grid-template-rows: 1fr 1fr 1fr;
          grid-gap: 20px;
          width: 960px;
        }
      `}</style>
    </div>
  );
};

export default Home;