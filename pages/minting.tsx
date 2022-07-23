import { Box, Button, Flex, Image, Text, useColorMode } from "@chakra-ui/react";
import axios from "axios";
import { MINT_NFT_ADDRESS } from "caverConfig";
import { useCaver } from "hooks";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect } from "react";
import { useState } from "react";

const Minting: NextPage = () => {
  const [account, setAccount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newNFT, setNewNFT] = useState<any>(undefined);

  const [startBlockHeight, setStartBlock] = useState<number>(99999999);
  const [endBlockHeight, setEndBlock] = useState<number>(99999999);
  const [currentBlockHeight, setCurrentBlock] = useState<number>(0);
  
  const [nftMaxCapacity, setNFTMaxCapacity] = useState<number>(0);
  const [nftCurrentCapacity, setNFTCurrentCapacity] = useState<number>(0);
  const [nftPrice, setNFTPrice] = useState<number>(0);
  const [mintAmount, setMintAmount] = useState<number>(1);
  const [mintStatus, setMintStatus] = useState<string>("");

  const { caver, mintNFTContract } = useCaver();

  const { colorMode } = useColorMode();

  const MAX_MINT_AMOUNT = 10;


  const onClickKaikas = async () => {
    try {
      const accounts = await window.klaytn.enable();
      setAccount(accounts[0]);

      ///////////////////////////////////////////////////////
      const block1 = await mintNFTContract?.methods
        .viewMintStartBlockHeight()
        .call();
      setStartBlock(block1);
      const block2 = await mintNFTContract?.methods
        .viewMintEndBlockHeight()
        .call();
      setEndBlock(block2);
      const block3 = await mintNFTContract?.methods
        .viewCurrentBlockHeight()
        .call();
      setCurrentBlock(block3);

      const num = await mintNFTContract?.methods
        .viewMaxCapacity()
        .call();
      setNFTMaxCapacity(num);
      const num1 = await mintNFTContract?.methods
        .totalSupply()
        .call();
      setNFTCurrentCapacity(num1);
      const num2 = await mintNFTContract?.methods
        .viewPrice()
        .call();
      setNFTPrice(num2);
      const txt = await mintNFTContract?.methods
        .viewCurrentStage()
        .call();
      setMintStatus(txt);
      ///////////////////////////////////////////////////////

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (account != "") {
      // 1초 마다 갱신
      setInterval(() => {
        const fetchTotalNum = async () => {
          const num1 = await mintNFTContract?.methods
            .totalSupply()
            .call();
          setNFTCurrentCapacity(num1);
        }
        fetchTotalNum();
      }, 1000);
    } else {
    }
  }, [nftCurrentCapacity])

  useEffect(() => {
    if (account != "") {
      // 0.1초 마다 갱신
      setInterval(() => {
        const fetchCurrentBlock = async () => {
          const block = await mintNFTContract?.methods
            .viewCurrentBlockHeight()
            .call();
            setCurrentBlock(block);
        }
        fetchCurrentBlock();
      }, 100);
    } else {
    }
  }, [currentBlockHeight])

  const onClickMint = async () => {
    try {
      // const response = await mintNFTContract?.methods.mintNFT().send({
      //   from: account,
      //   value: caver?.utils.convertToPeb(2, "KLAY"),
      //   gas: 3000000,
      // });
      if(mintAmount < 1) return;

      setIsLoading(true);

      const response = await caver?.klay.sendTransaction({
        type: "SMART_CONTRACT_EXECUTION",
        from: account,
        to: MINT_NFT_ADDRESS,
        value: caver.utils.convertToPeb(nftPrice * mintAmount, "KLAY"),
        gas: 3000000,
        data: mintNFTContract?.methods.batchMintNFT(mintAmount).encodeABI(),
      });

      if (response?.status) {
        const balanceOf = await mintNFTContract?.methods
          .balanceOf(account)
          .call();

        if (balanceOf) {
          const myNewNFT = await mintNFTContract?.methods
            .tokenOfOwnerByIndex(account, balanceOf - 1)
            .call();

          if (myNewNFT) {
            const tokenURI = await mintNFTContract?.methods
              .tokenURI(myNewNFT)
              .call();

            if (tokenURI) {
              const imageResponse = await axios.get(tokenURI);

              if (imageResponse.status === 200) {
                setNewNFT(imageResponse.data);
              }
            }
          }
        }
      }

      // const blockNumber = await mintNFTContract?.methods.viewCurrentBlockNumber().call();

      setIsLoading(false);
    } catch (error) {
      console.error(error);

      setIsLoading(false);
    }
  };
  
  const onClickSub = async () => {
    try {
      setIsLoading(true);

      if(mintAmount > 0) setMintAmount(mintAmount-1);

      setIsLoading(false);
    } catch (error) {
      console.error(error);

      setIsLoading(false);
    }
  };
  
  const onClickAdd = async () => {
    try {
      setIsLoading(true);

      if(mintAmount < MAX_MINT_AMOUNT) setMintAmount(mintAmount+1);

      setIsLoading(false);
    } catch (error) {
      console.error(error);

      setIsLoading(false);
    }
  };

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      minH="100vh"
      flexDir="column"
    >
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
      <Flex mt="8" justifyContent="center" alignItems="center">
        <Flex
          justifyContent="center"
          alignItems="center"
          w={256}
          h={256}
          border="2px"
          borderColor={colorMode === "light" ? "gray.300" : "gray.500"}
          borderRadius="lg"
        >
          {newNFT ? (
            <Image
              src={newNFT.image}
              borderRadius="lg"
              fallbackSrc="../images/loading.png"
              alt="nft"
            />
          ) : (
            <Image
              src="../images/loading.png"
              borderRadius="lg"
              alt="loading"
            />
          )}
        </Flex>
        <Flex ml={8} direction="column" minH={512} minW={300}>
          <Text>민팅 시작 블록 : {startBlockHeight}</Text>
          <Text>현재 블록 높이 : {currentBlockHeight}</Text>
          <Text>민팅 종료 블록 : {endBlockHeight}</Text>
          <Text>민팅 가능 수량 : {nftMaxCapacity}</Text>
          <Text>민팅된 수량 : {nftCurrentCapacity}</Text>
          <Text>민팅 가격: {nftPrice} Klay</Text>
          <Text>현재 상태 : {mintStatus}</Text>
          <Flex ml={8} direction="row" minH={12} minW={300} alignItems="center">
            <Button
              size="lg"
              colorScheme="blue"
              onClick={onClickSub}
              loadingText=""
            >
              ◀
            </Button>
            <Text minW={140} textAlign="center">{mintAmount}</Text>
            <Button
              size="lg"
              colorScheme="blue"
              onClick={onClickAdd}
              loadingText=""
            >
              ▶
            </Button>
          </Flex>
          <Button
            size="lg"
            colorScheme="green"
            onClick={onClickMint}
            disabled={account === "" || isLoading}
            isLoading={isLoading}
            loadingText="Loading ..."
          >
            Minting
          </Button>
          <Box mt={8}>
            {newNFT ? (
              <>
                <Flex fontSize="xl" mt={4}>
                  <Text w="50%">Name</Text>
                  <Text>: {newNFT.name}</Text>
                </Flex>
                <Flex fontSize="xl" mt={4}>
                  <Text w="50%">Description</Text>
                  <Text>: </Text>
                </Flex>
                <Text fontSize="xl" mt={4}>
                  {newNFT.description}
                </Text>
                <Flex fontSize="xl" mt={4}>
                  <Text w="50%">Attributes</Text>
                </Flex>
                {newNFT.attributes.map((v: any, i: number) => {
                  return (
                    <Flex key={i} fontSize="xl" mt={4}>
                      <Text w="50%">{v.trait_type}</Text>
                      <Text>: {v.value}</Text>
                    </Flex>
                  );
                })}
              </>
            ) : (
              <>
                <Flex fontSize="xl" mt={4}>
                  <Text w="50%">Name</Text>
                  <Text>:</Text>
                </Flex>
                <Flex fontSize="xl" mt={4}>
                  <Text w="50%">Description</Text>
                  <Text>:</Text>
                </Flex>
                <Flex fontSize="xl" mt={4}>
                  <Text w="50%">Attributes</Text>
                </Flex>
              </>
            )}
          </Box>
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
