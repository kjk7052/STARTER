import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { FC, useState } from "react";
import { Link as ScrollLink } from "react-scroll";

// @ 타이틀 이미지는 이미지에 마우스를 올리면 Gif 이미지가 나오도록 하였습니다. public/images 교체하셔서 사용하시면 됩니다.
const titleImage = "utopia.png";
const titleImageGif = "utopia.gif";

const Title: FC = () => {
  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <Flex
      minH="100vh"
      justifyContent="space-between"
      alignItems="center"
      flexDir="column"
      id="Title"
      px={4}
      w="full"
    >
      <Box></Box>
      <Box position="relative">
        <Image
          src={`../images/${titleImage}`}
          position="absolute"
          opacity={isHover ? 0 : 1}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          alt="title"
          w={500}
          mt={10}
        />
        <Image
          src={`../images/${titleImageGif}`}
          alt="title"
          w={500}
          mt={10}
        />
      </Box>
      <ScrollLink to="Story" spy={true} smooth={true}>
        <Button
          variant="ghost"
          fontSize="4xl"
          mb={8}
          className="animate__animated animate__heartBeat animate__infinite"
        >
          ↓
        </Button>
      </ScrollLink>
    </Flex>
  );
};

export default Title;
