import { Box, Button, Flex, Grid, Image, Text, useColorMode, useInterval } from "@chakra-ui/react";
import axios from "axios";
import { DOLLGROCK_NFT_ADDRESS, JOYAKDOL_TOKEN_ADDRESS } from "caverConfig";
import { useCaver } from "hooks";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect } from "react";
import { useState } from "react";

import RewardNFTCard from "../components/RewardNftCard";
import { DollgRockMetadata } from "interfaces";

const Minting: NextPage = () => {
  const [account, setAccount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newNFT, setNewNFT] = useState<any>(undefined);

  const { caver, dollgrockNFTContract, joyakdolTokenContract } = useCaver();
  const { colorMode } = useColorMode();

  const [totalReward, setTotalReward] = useState<number>(0);
  const [ownNftList, setOwnNftList] = useState<number[]>();
  const [nftMetadataList, setNftMetadataList] = useState<any[]>();
  const [nftDataList, setNftDataList] = useState<DollgRockMetadata[]>();

  const TOKEN_DECIMAL = 10000000000000000;

  // const fetcher = url => axios.get(url).then(res => res.data)
  // const { data, error } = useSWR('/api/data', fetcher)

  useEffect(() => console.log(joyakdolTokenContract), [joyakdolTokenContract]);

  const rewardNftDataList = [
    {
      name: "1",
      image: "1.png",
      rank: "common",
      token: 0.0,
      // animation: "tada",
    },
    // {
    //   name: "#2",
    //   position: "0.0412",
    //   image: "2.png",
    //   color: "purple",
    //   animation: "tada",
    // },
  ];


  const onClickKaikas = async () => {
    try {
      const accounts = await window.klaytn.enable();
      setAccount(accounts[0]);

      ///////////////////////////////////////////////////////
      const a = await joyakdolTokenContract?.methods
        .viewCollectedTokenAll(accounts[0])
        .call();
      const b = a/TOKEN_DECIMAL;
      setTotalReward(b);              // 채굴된 토큰 총량
    
      // console.log(b);
      rewardNftDataList.pop();
      
      const nftList = await joyakdolTokenContract?.methods
        .ownedNFTList(accounts[0])
        .call();
      setOwnNftList(nftList);    // 연결된 지갑이 소유하고 있는 NFT ID 목록

      if(nftList.length > 0)
      {
        // console.log(nftList);
        
        const uriList = new Array();
        const metadataList = new Array();

        for(let i=0; i < nftList.length; i++)  
        {
          // NFT들의 tokenURI를 받아옴
          const tokenURI = await dollgrockNFTContract?.methods
          .tokenURI(nftList[i])
          .call();
          uriList.push(tokenURI);

          // tokenURI로부터 메타데이터를 받아옴
          const imageResponse = await axios.get(uriList[i]);

          metadataList.push(imageResponse.data);
          if (imageResponse.status !== 200) {
            console.log(imageResponse);
          }

          // NFT별 채굴된 토큰 수량 확인
          const amount = await joyakdolTokenContract?.methods
          .viewCollectedToken(nftList[i])
          .call();

          rewardNftDataList.push({
            name: imageResponse.data.name,
            image: imageResponse.data.image,
            rank: "common",
            token: amount/TOKEN_DECIMAL,
          })
        }
        // rewardNftDataList.push({id:5, token:1, image:"2.png", color:"puple"});
        // for(let i=0; i < uriList.length; i++)  
        // {
        // }
        setNftMetadataList(metadataList);
        setNftDataList(rewardNftDataList);
        console.log(rewardNftDataList);
      }

      ///////////////////////////////////////////////////////

    } catch (error) {
      console.error(error);
    }
  };
  
  // // 수령할 수 있는 토큰의 총액을 실시간으로 갱신
  // useEffect(() => {
  //   let id = setInterval(()=>{});
  //   if (account != "") {
  //     // 1초 마다 갱신
  //     id = setInterval(() => {
  //       const fetchTotalReward = async () => {
  //         const a = await joyakdolTokenContract?.methods
  //           .viewCollectedTokenAll(account)
  //           .call();
  //         const b = a/10000000000000000;
  //         setTotalReward(b);
          
  //         console.log(b);
  //       }
  //       fetchTotalReward();
  //     }, 1000);
  //   } else {
  //   }
  //   return () => { clearInterval(id) };
  // }, [totalReward])

  // 수령할 수 있는 토큰 실시간으로 갱신
  useInterval(()=>{
    if (account != "") {
      fetchTotalReward();
    }
  },1000);

  const fetchTotalReward = async () => {
    const a = await joyakdolTokenContract?.methods
      .viewCollectedTokenAll(account)
      .call();
    const b = a/TOKEN_DECIMAL;

    const dataList = [
      {
        name: "1",
        image: "1.png",
        rank: "common",
        token: 0.0,
      },
    ];
    dataList.pop();
    
    ownNftList?.forEach(async (item, index) => {
      const amount = await joyakdolTokenContract?.methods
      .viewCollectedToken(item)
      .call();

      // const dataList = [...nftDataList];
      if(nftDataList!=null&&nftDataList!=undefined)
      {
        const data = nftDataList[index];
        data.token = amount/TOKEN_DECIMAL;
        dataList.push(data);
      }
    });

    setTotalReward(b);
  }

  // 채굴된 토큰 수령 (가지고 있는 NFT 전체)
  const onClickReward = async () => {
    try {
      setIsLoading(true);

      const response = await caver?.klay.sendTransaction({
        type: "SMART_CONTRACT_EXECUTION",
        from: account,
        to: JOYAKDOL_TOKEN_ADDRESS,
        gas: 3000000,
        data: joyakdolTokenContract?.methods.rewardTokenAll().encodeABI(),
      });

      if (response) {
        console.log(response);
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);

      setIsLoading(false);
    }
  };

  // 토큰 채굴 시작 (가지고 있는 NFT중 시작하지 않은 것 전부)
  const onClickStartReward = async () => {
    try {
      setIsLoading(true);

      const response = await caver?.klay.sendTransaction({
        type: "SMART_CONTRACT_EXECUTION",
        from: account,
        to: JOYAKDOL_TOKEN_ADDRESS,
        gas: 3000000,
        data: joyakdolTokenContract?.methods.rewardStartAll().encodeABI(),
      });

      if (response) {
        console.log(response);
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);

      setIsLoading(false);
    }
  };
  

  // useEffect(() => {
  //   if (account != "") {
  //     // 1초 마다 갱신
  //     setInterval(() => {
  //       const fetchTotalNum = async () => {
  //         const block = await dollgrockNFTContract?.methods
  //           .viewCurrentBlockHeight()
  //           .call();
  //           setCurrentBlock(block);
  //       }
  //       fetchTotalNum();
  //     }, 100);
  //   } else {
  //   }
  // }, [currentBlockHeight])

  // const onClickMint = async () => {
  //   try {

  //     setIsLoading(true);

  //     const response = await caver?.klay.sendTransaction({
  //       type: "SMART_CONTRACT_EXECUTION",
  //       from: account,
  //       to: DOLLGROCK_NFT_ADDRESS,
  //       gas: 3000000,
  //       data: dollgrockNFTContract?.methods.batchMintNFT(1).encodeABI(),
  //     });

  //     if (response?.status) {
  //       const balanceOf = await dollgrockNFTContract?.methods
  //         .balanceOf(account)
  //         .call();

  //       if (balanceOf) {
  //         const myNewNFT = await dollgrockNFTContract?.methods
  //           .tokenOfOwnerByIndex(account, balanceOf - 1)
  //           .call();

  //         if (myNewNFT) {
  //           const tokenURI = await dollgrockNFTContract?.methods
  //             .tokenURI(myNewNFT)
  //             .call();

  //           if (tokenURI) {
  //             const imageResponse = await axios.get(tokenURI);

  //             if (imageResponse.status === 200) {
  //               setNewNFT(imageResponse.data);
  //             }
  //           }
  //         }
  //       }
  //     }

  //     // const blockNumber = await dollgrockNFTContract?.methods.viewCurrentBlockNumber().call();

  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error(error);

  //     setIsLoading(false);
  //   }
  // };
  

  
  // const { t } = useTranslation("common");


  return (
    <Flex
   //   justifyContent="center"
      alignItems="center"
      minH="100vh"
      flexDir="column"
    >
      <br></br><br></br><br></br><br></br>
      {account === "" ? (
        <Button onClick={onClickKaikas} size="lg" colorScheme="orange">
          <Image
            src={
              colorMode === "light"
                ? "../images/kaikas-white.png"
                : "../images/kaikas.png"
            }
            w={8}
            mr={2}
            alt="kaikas"
          />
          Connect to Kaikas
        </Button>
      ) : (
        <Flex>
          <Button fontSize="2xl" colorScheme="orange" variant="ghost">
            Account - {account}
          </Button>
          <Button onClick={() => setAccount("")} colorScheme="orange">
            Disconnect
          </Button>
        </Flex>
      )}
      <br></br><br></br>
      <Flex alignItems="center">
        <Button onClick={onClickStartReward} colorScheme="blue">Start Rewarding</Button>
        <Button fontSize="6x1" fontWeight="bold" colorScheme="pink" variant="ghost" minH={50} minW={500}>TotalReward : {totalReward}</Button>

        <Button onClick={onClickReward} colorScheme="pink">Claim Reward</Button>
      </Flex>
      <br></br>
      <Flex minH="100vh" alignItems="center" id="Team" flexDir="column">
      <Box fontSize="6xl" fontWeight="bold" mt={4}>
        REWARDING
      </Box>
      <Grid
        mt={16}
        templateColumns={[
          "repeat(1, 1fr)",
          "repeat(1, 1fr)",
          "repeat(2, 1fr)",
          "repeat(4, 1fr)",
        ]}
      >
        {nftDataList?.map((value, i) => {
          return (
            <RewardNFTCard
              key={i}
              name={value.name}
              image={value.image}
              rank={value.rank}
              token={value.token}
              // color={value.rank}
              // animation={value.animation}
            />
          );
        })}
      </Grid>
    </Flex>
    </Flex>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default Minting;
