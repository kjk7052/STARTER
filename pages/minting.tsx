import { Box, Button, Flex, Image, Text, useColorMode, Spacer, Heading ,
  Slider, SliderTrack, SliderFilledTrack, SliderThumb, SliderMark,
  Divider, useInterval  } from "@chakra-ui/react";
import axios from "axios";
import { DOLLGROCK_NFT_ADDRESS } from "caverConfig";
import { useCaver } from "hooks";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect } from "react";
import { useState } from "react";

const Minting: NextPage = () => {
  const [account, setAccount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [newNFT, setNewNFT] = useState<any>(undefined);

  const [startBlockHeight, setStartBlock] = useState<number>(99999999);
  const [currentBlockHeight, setCurrentBlock] = useState<number>(0);
  
  const [nftMaxCapacity, setNFTMaxCapacity] = useState<number>(0);
  const [nftCurrentCapacity, setNFTCurrentCapacity] = useState<number>(0);
  const [nftPrice, setNFTPrice] = useState<number>(0);
  
  const [limitPerTransaction, setLimitPerTransaction] = useState<number>(1);
  const [limitPerWallet, setLimitPerWallet] = useState<number>(1);
  const [mintAmount, setMintAmount] = useState<number>(1);
  const [mintStatus, setMintStatus] = useState<string>("");

  const { caver, dollgrockNFTContract } = useCaver();

  const { colorMode } = useColorMode();
  const [isSoldOut, setSoldOut] = useState<boolean>(false);

  const MAX_NFT_PUBLISH_AMOUNT = 100;  //  NFT 최대 발행 예정 수량

  const onClickKaikas = async () => {
    try {
      const accounts = await window.klaytn.enable();
      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    try {
      refreshDataLongInterval();
      console.log("Long Intaval Refresh");
    } catch (error) {
      console.error(error);
    }
  }, [account]);

  // // 민팅된 수량 실시간 갱신
  // useEffect(() => {
  //   try {
  //     if (account != "") {
  //       // 1초 마다 갱신
  //       setInterval(() => {
  //         const fetchTotalNum = async () => {
  //           const block1 = await dollgrockNFTContract?.methods // 민팅 시작 블록
  //             .viewMintStartBlockHeight()
  //             .call();
  //           setStartBlock(block1);
  //           const block3 = await dollgrockNFTContract?.methods // 현재 블록
  //             .viewCurrentBlockHeight()
  //             .call();
  //           setCurrentBlock(block3);
      
  //           const limit1 = await dollgrockNFTContract?.methods  // 트랜젝션당 민팅 수량 제한
  //             .viewLimitPerTransaction()
  //             .call();
  //           setLimitPerTransaction(limit1);
  //           const limit2 = await dollgrockNFTContract?.methods  // 지갑당 민팅 수량 제한
  //             .viewLimitPerWallet()
  //             .call();
  //           setLimitPerWallet(limit2);
      
  //           const nftCap = await dollgrockNFTContract?.methods  // NFT 최대수량
  //             .viewMaxCapacity()
  //             .call();
  //           setNFTMaxCapacity(nftCap);
  //           const num1 = await dollgrockNFTContract?.methods // 지금까지 발행된 NFT 수량
  //             .totalSupply()
  //             .call();
  //           setNFTCurrentCapacity(num1);
  //           if(num1 >= nftMaxCapacity) setSoldOut(true);  // 민팅된 수량이 최대수량보다 같거나 많아지면 매진
  //           else setSoldOut(false);
  //           const price = await dollgrockNFTContract?.methods // 민팅 가격
  //             .viewPrice()
  //             .call();
  //           setNFTPrice(price);
  //           const stat = await dollgrockNFTContract?.methods  // 민팅 상태
  //             .viewCurrentStage()
  //             .call();
      
  //           if(stat == 0) setMintStatus("Not Minting Now");
  //           else if(stat == 1) setMintStatus("WhiteList Minting");
  //           else if(stat == 2) setMintStatus("WhiteList Minting 2");
  //           else if(stat == 3) setMintStatus("Public Minting");
  //           else setMintStatus("");
  //         }
  //         fetchTotalNum();
  //       }, 1000);
  //     } else {
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [])

  useInterval(()=>{
    refreshDataMidiumInterval();
    // console.log("Midium Intaval Refresh");
  },1000);

  useInterval(()=>{
    refreshDataShortInterval();
    // console.log("Short Intaval Refresh");
  },300);



  // 긴 주기로 데이터 갱신
  const refreshDataLongInterval = async() =>
  {
    const block1 = await dollgrockNFTContract?.methods // 민팅 시작 블록
      .viewMintStartBlockHeight()
      .call();
    setStartBlock(block1);

    const limit1 = await dollgrockNFTContract?.methods  // 트랜젝션당 민팅 수량 제한
      .viewLimitPerTransaction()
      .call();
    setLimitPerTransaction(limit1);
    const limit2 = await dollgrockNFTContract?.methods  // 지갑당 민팅 수량 제한
      .viewLimitPerWallet()
      .call();
    setLimitPerWallet(limit2);

    const nftCap = await dollgrockNFTContract?.methods  // NFT 최대수량
      .viewMaxCapacity()
      .call();
    setNFTMaxCapacity(nftCap);
    const price = await dollgrockNFTContract?.methods // 민팅 가격
      .viewPrice()
      .call();
    setNFTPrice(price);
    const stat = await dollgrockNFTContract?.methods  // 민팅 상태
      .viewCurrentStage()
      .call();

    if(stat == 0) setMintStatus("Not Minting Now");
    else if(stat == 1) setMintStatus("WhiteList Minting");
    else if(stat == 2) setMintStatus("WhiteList Minting 2");
    else if(stat == 3) setMintStatus("Public Minting");
    else setMintStatus("");
  }

  // 중간 주기로 데이터 갱신
  const refreshDataMidiumInterval = async() =>
  {
    const num1 = await dollgrockNFTContract?.methods // 지금까지 발행된 NFT 수량
      .totalSupply()
      .call();
    setNFTCurrentCapacity(num1);
    if(num1 >= nftMaxCapacity) setSoldOut(true);  // 민팅된 수량이 최대수량보다 같거나 많아지면 매진
    else setSoldOut(false);
  }

  // 짧은 주기로 데이터 갱신
  const refreshDataShortInterval = async() =>
  {
    const block3 = await dollgrockNFTContract?.methods // 현재 블록
      .viewCurrentBlockHeight()
      .call();
    setCurrentBlock(block3);
  }

  // // 현재 블록 높이 실시간 갱신
  // useEffect(() => {
  //   try {
  //     if (account != "") {
  //       // 0.1초 마다 갱신
  //       setInterval(() => {
  //         const fetchCurrentBlock = async () => {
  //           const block = await dollgrockNFTContract?.methods
  //             .viewCurrentBlockHeight()
  //             .call();
  //             setCurrentBlock(block);
  //         }
  //         fetchCurrentBlock();
  //       }, 100);
  //     } else {
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [currentBlockHeight])

  // 선택된 수량만큼 NFT 민팅
  const onClickMint = async () => {
    try {
      // const response = await dollgrockNFTContract?.methods.mintNFT().send({
      //   from: account,
      //   value: caver?.utils.convertToPeb(2, "KLAY"),
      //   gas: 3000000,
      // });
      if(mintAmount < 1) return;

      setIsLoading(true);

      const response = await caver?.klay.sendTransaction({
        type: "SMART_CONTRACT_EXECUTION",
        from: account,
        to: DOLLGROCK_NFT_ADDRESS,
        value: caver.utils.convertToPeb(nftPrice * mintAmount, "KLAY"),
        gas: 3000000,
        data: dollgrockNFTContract?.methods.batchMintNFT(mintAmount).encodeABI(),
      });

      if (response?.status) {
        console.log(1);
        console.log(response);
      }
      else{
        console.log(2);
        console.log(response);
      }
      // if (response?.status) {
      //   const balanceOf = await dollgrockNFTContract?.methods
      //     .balanceOf(account)
      //     .call();

      //   if (balanceOf) {
      //     const myNewNFT = await dollgrockNFTContract?.methods
      //       .tokenOfOwnerByIndex(account, balanceOf - 1)
      //       .call();

      //     if (myNewNFT) {
      //       const tokenURI = await dollgrockNFTContract?.methods
      //         .tokenURI(myNewNFT)
      //         .call();

      //       if (tokenURI) {
      //         const imageResponse = await axios.get(tokenURI);

      //         if (imageResponse.status === 200) {
      //           setNewNFT(imageResponse.data);
      //         }
      //       }
      //     }
      //   }
      // }

      // const blockNumber = await dollgrockNFTContract?.methods.viewCurrentBlockNumber().call();

      setIsLoading(false);
    } catch (error) {
      console.error(error);

      setIsLoading(false);
              }
  };
  
  // 민팅 수량 감소
  const onClickSub = async () => {
    try {
      setIsLoading(true);

      if(mintAmount > 1) setMintAmount(mintAmount-1);
      else setMintAmount(1);

      setIsLoading(false);
    } catch (error) {
      console.error(error);

      setIsLoading(false);
            }
  };

  // 민팅 수량 증가 (최대 : MAX_MINT_AMOUNT)
  const onClickAdd = async () => {
    try {
      setIsLoading(true);

      if(mintAmount < limitPerTransaction) setMintAmount(mintAmount+1);
      else setMintAmount(limitPerTransaction);  // 예기치 않은 오류로 더 큰 값이 들어가 있더라도 최대치로 초기화

      setIsLoading(false);
    } catch (error) {
      console.error(error);

      setIsLoading(false);
    }
  };
  

  const labelStyles = {
    mt: '2',
    ml: '-2.5',
    fontSize: 'sm',
  }

  return (
    <Flex
      // justifyContent="center"
      alignItems="center"
      minH="100vh"
      flexDir="column"
    >
      <br></br><br></br><br></br><br></br>
      {/*********************************** 카이카스 연결 버튼 ***********************************/}
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
        ////////////////////////////////// 연결 후 //////////////////////////////////
        <Flex>
          <Button fontSize="2xl" colorScheme="orange" variant="ghost">
            Account - {account}
          </Button>
          <Button onClick={() => setAccount("")} colorScheme="orange">
            Disconnect
          </Button>
        </Flex>
      )}
      {/*********************************** 민팅 페이지 ***********************************/}
      <Flex mt="8" justifyContent="center" alignItems="center">
        <Flex
          justifyContent="center"
          alignItems="center"
          w={500}
          h={500}
          // border="2px"
          // borderColor={colorMode === "light" ? "gray.300" : "gray.500"}
          // borderRadius="lg"
        >
            <Image
            src="../images/utopia.png"
            alt="img"
            />
        </Flex>
        <Flex direction="column" minH={700} minW={500}>
          {/* <Text>민팅 시작 블록 : {startBlockHeight}</Text>
          <Text>현재 블록 높이 : {currentBlockHeight}</Text>
          <Text>민팅 종료 블록 : {endBlockHeight}</Text>
          <Text>민팅 가능 수량 : {nftMaxCapacity}</Text>
          <Text>민팅된 수량 : {nftCurrentCapacity}</Text>
          <Text>민팅 가격: {nftPrice} Klay</Text>
          <Text>현재 상태 : {mintStatus}</Text> */}
          
          {/*********************************** 블록 정보 ***********************************/}
          
          <br/><Heading fontSize='3xl'>{mintStatus}</Heading><br/><br/>
          <Heading fontSize='sm'>Minting Block Number</Heading>
          <br/>
          <Flex direction="row" minW={500}>
            <Flex direction="row" alignItems="center">
              <Flex direction="column">
                <Text fontSize='sm'>CURRENT</Text>
                <Text fontSize='sm'>BLOCK</Text>
              </Flex>
              <Heading fontSize='2xl' ml={3}>#{currentBlockHeight}</Heading>
            </Flex>
            <Spacer/>
            <Divider orientation="vertical"/>
            <Spacer/>
            <Flex direction="row" alignItems="center">
              <Flex direction="column">
                <Text fontSize='sm'>MINTING</Text>
                <Text fontSize='sm'>STARTS AT</Text>
              </Flex>
              <Heading fontSize='2xl' ml={3}>#{startBlockHeight}</Heading>
            </Flex>
          </Flex>
          <br/>
          <Divider/>
          <br/>
          {/*********************************** 민팅 정보 ***********************************/}
          <Flex direction="row" minW={500}>
            <Flex direction="column">
              <Text fontSize='sm'>Price</Text>
              <Heading fontSize='lg'>{nftPrice} KLAY</Heading>
            </Flex>
            <Spacer/>
            <Divider orientation='vertical'/>
            <Spacer/>
            <Flex direction="column">
              <Text fontSize='sm'>Per Transaction</Text>
              <Flex direction="row" alignItems="center">
                <Text fontSize='xs'>최대</Text>
                <Heading  fontSize='lg' ml={1}>{limitPerTransaction}개</Heading >
              </Flex>
            </Flex>
            <Spacer/>
            <Divider orientation='vertical' />
            <Spacer/>
            <Flex direction="column">
              <Text fontSize='sm'>Per Wallet</Text>
              <Flex direction="row" alignItems="center">
                <Text fontSize='xs'>최대</Text>
                <Heading  fontSize='lg' ml={1}>{limitPerWallet}개</Heading >
              </Flex>
            </Flex>
          </Flex>
          <br/>
          <Divider/>
          <br/>
          {/*********************************** 슬라이더 ***********************************/}
          <Heading fontSize='sm' colorScheme='green'>NFT 판매 수량</Heading>
          <br/>
          <Box pt={6} pb={2} minH={90}>
            <Slider aria-label='minted_amount'
                value={nftCurrentCapacity}
                max={MAX_NFT_PUBLISH_AMOUNT}
                isReadOnly={true} size='lg'>
              <SliderMark value={0} {...labelStyles}>
                0
              </SliderMark>
              <SliderMark value={nftMaxCapacity} {...labelStyles}>
                {nftMaxCapacity}
              </SliderMark>
              <SliderMark value={MAX_NFT_PUBLISH_AMOUNT} {...labelStyles}>
                {MAX_NFT_PUBLISH_AMOUNT}
              </SliderMark>
              <SliderMark
                value={nftCurrentCapacity}
                textAlign='center'
                bg='blue.500'
                color='white'
                mt='-10'
                ml='-5'
                w='12'
              >
                {nftCurrentCapacity}
              </SliderMark>
              <SliderTrack bg='lightblue'>
                <SliderFilledTrack/>
              </SliderTrack>
              <SliderThumb bg=''>
              </SliderThumb>
            </Slider>
          </Box>
          <Divider/>
          <br/>
          {/*********************************** 민팅 ***********************************/}
          <Heading fontSize='sm' minH={5}>Amount</Heading>
          <Flex direction="row" minH={59} minW={500} alignItems="center">
            <Button
              size="md"
              colorScheme="blue"
              onClick={onClickSub}
              loadingText=""
            >
              -
            </Button>
            <Spacer />
            <Heading fontSize='3xl' textAlign="center">{mintAmount}</Heading>
            <Spacer />
            <Button
              size="md"
              colorScheme="blue"
              onClick={onClickAdd}
              loadingText=""
            >
              +
            </Button>
          </Flex>
          <Text fontSize='sm' textAlign="center" minH={8}>[민팅은 새로고침 없이 진행됩니다]</Text>
          <Button
            size="lg"
            colorScheme="green"
            onClick={onClickMint}
            disabled={account === "" || isLoading || isSoldOut}
            isLoading={isLoading}
            loadingText="Loading ..."
          >
            {isSoldOut?"Sold Out":"Minting"}
          </Button>
        </Flex>
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
