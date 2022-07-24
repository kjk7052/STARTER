import { Box, Button, Flex, Grid, Image, Text, useColorMode } from "@chakra-ui/react";
import axios from "axios";
import { MINT_NFT_ADDRESS, DGR_TOKEN_ADDRESS } from "caverConfig";
import { useCaver } from "hooks";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect } from "react";
import { useState } from "react";

import { FC } from "react";
import RewardNFTCard from "./RewardNftCard";

const Minting: NextPage = () => {
  const [account, setAccount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newNFT, setNewNFT] = useState<any>(undefined);

  const { caver, mintNFTContract, dgrTokenContract } = useCaver();
  const { colorMode } = useColorMode();

  const [totalReward, setTotalReward] = useState<number>(0);
  const [ownNftList, setOwnNftList] = useState<number[]>();
  const [nftMetadataList, setNftMetadataList] = useState<any[]>();


  // useEffect(() => console.log(dgrTokenContract), [dgrTokenContract]);


  const onClickKaikas = async () => {
    try {
      const accounts = await window.klaytn.enable();
      setAccount(accounts[0]);

      ///////////////////////////////////////////////////////
      const a = await dgrTokenContract?.methods
        .viewCollectedTokenAll(accounts[0])
        .call();
      const b = a/10000000000000000;
      setTotalReward(b);              // 채굴된 토큰 총량
    
      // console.log(b);
      // rewardNftCardConfig.pop();
      
      const list = await dgrTokenContract?.methods
        .ownedNFTList(accounts[0])
        .call();
      setOwnNftList(list);    // 연결된 지갑이 소유하고 있는 NFT ID 목록

      if(list.length > 0)
      {
        console.log(list);
        
        const uriList = new Array();
        const metadataList = new Array();

        for(let i=0; i < list.length; i++)  // NFT들의 tokenURI를 받아옴
        {
          const tokenURI = await mintNFTContract?.methods
          .tokenURI(list[i])
          .call();
          uriList.push(tokenURI);
        }
        
        for(let i=0; i < uriList.length; i++)  // tokenURI로부터 메타데이터를 받아옴
        {
          const imageResponse = await axios.get(uriList[i]);

          metadataList.push(imageResponse.data);
          if (imageResponse.status !== 200) {
            console.log(imageResponse);
          }
        }
        setNftMetadataList(metadataList);
        console.log(metadataList);
      }

      ///////////////////////////////////////////////////////

    } catch (error) {
      console.error(error);
    }
  };
  
  // 수령할 수 있는 토큰의 총액을 실시간으로 갱신
  useEffect(() => {
    if (account != "") {
      // 1초 마다 갱신
      setInterval(() => {
        const fetchTotalReward = async () => {
          const a = await dgrTokenContract?.methods
            .viewCollectedTokenAll(account)
            .call();
          const b = a/10000000000000000;
          setTotalReward(b);
          
          console.log(b);
        }
        fetchTotalReward();
      }, 1000);
    } else {
    }
  }, [totalReward])


  // 채굴된 토큰 수령 (가지고 있는 NFT 전체)
  const onClickReward = async () => {
    try {
      setIsLoading(true);

      const response = await caver?.klay.sendTransaction({
        type: "SMART_CONTRACT_EXECUTION",
        from: account,
        to: DGR_TOKEN_ADDRESS,
        gas: 3000000,
        data: dgrTokenContract?.methods.rewardTokenAll().encodeABI(),
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
        to: DGR_TOKEN_ADDRESS,
        gas: 3000000,
        data: dgrTokenContract?.methods.rewardStartAll().encodeABI(),
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
  //         const block = await mintNFTContract?.methods
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
  //       to: MINT_NFT_ADDRESS,
  //       gas: 3000000,
  //       data: mintNFTContract?.methods.batchMintNFT(1).encodeABI(),
  //     });

  //     if (response?.status) {
  //       const balanceOf = await mintNFTContract?.methods
  //         .balanceOf(account)
  //         .call();

  //       if (balanceOf) {
  //         const myNewNFT = await mintNFTContract?.methods
  //           .tokenOfOwnerByIndex(account, balanceOf - 1)
  //           .call();

  //         if (myNewNFT) {
  //           const tokenURI = await mintNFTContract?.methods
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

  //     // const blockNumber = await mintNFTContract?.methods.viewCurrentBlockNumber().call();

  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error(error);

  //     setIsLoading(false);
  //   }
  // };
  

  
  const rewardNftCardConfig = [
    {
      name: "#1",
      position: "0.0231",
      image: "team/정빛나님.png",
      color: "purple",
      animation: "tada",
    },
    {
      name: "#2",
      position: "0.0412",
      image: "team/한승종님.png",
      color: "purple",
      animation: "tada",
    },
  ];

  const { t } = useTranslation("common");


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
        <Button fontSize="2x1" colorScheme="pink" variant="ghost" minW={500}>TotalReward : {totalReward}</Button>

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
        {rewardNftCardConfig.map((v, i) => {
          return (
            <RewardNFTCard
              key={i}
              name={v.name}
              position={v.position}
              image={v.image}
              color={v.color}
              animation={v.animation}
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
