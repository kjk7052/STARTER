import { Flex, Heading, Image, Text, useColorMode } from "@chakra-ui/react";
import { FC } from "react";
import "animate.css";
import { useAnimate } from "hooks";

interface RewardCardProps {
  name: string;
  token: number;
  image: string;
  rank: string;
  // animation: string;
}

const TeamCard: FC<RewardCardProps> = ({
  name,
  token,
  image,
  rank,
  // animation,
}) => {
  const { colorMode } = useColorMode();

  const { isAnimated, dom } = useAnimate();

  const color = "green";

  return (
    <Flex
      m={[8, 8, 8, 4]}
      //className={`${isAnimated && "animate__animated animate__" + animation}`}
      ref={dom}
      bgGradient={
        colorMode === "light"
          ? `linear(to-b, ${color}.500, ${color}.400, ${color}.300, ${color}.200)`
          : `linear(to-b, ${color}.100, ${color}.300, ${color}.500, ${color}.700)`
      }
      w={225}
      py={6}
      rounded="xl"
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      shadow="lg"
    >
      <Image src={`${image}`} fallbackSrc="../images/dollgrock_logo_blue.png" w={175} rounded="lg" alt="dollgrock" />
      <Heading mt={4} fontSize="2xl">
        {name}
      </Heading>
      <Text mt={2} fontSize="xl" fontWeight="bold" color="red.600">
        {token}
      </Text>
    </Flex>
  );
};

export default TeamCard;
