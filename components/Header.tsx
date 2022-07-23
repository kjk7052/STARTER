import { FC } from "react";
import { useRouter } from "next/router";
import { Box, Button, Flex, Image, useColorMode } from "@chakra-ui/react";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";
import { FaDiscord, FaInstagram } from "react-icons/fa";
import { IoMoon, IoSunny } from "react-icons/io5";

// @ 로고 이미지는 public/images를 교체하시면 됩니다. URL은 우리 프로젝트의 URL을 작성하시면 됩니다.
const logoImage = "dollgrock_logo_blue.png";
const logoImageDark = "dollgrock_logo_yellow.png";
const openseaURL = "https://testnets.opensea.io/collection/test-nhkxjzobiz";
const discordURL = "https://discord.gg/6KRWeSdh";
// const instagramURL = "https://www.instagram.com/projectlion.io/";

const Header: FC = () => {
  const scrollLink = ["Story", "Roadmap", "Team"];

  const router = useRouter();

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      position="fixed"
      w="100%"
      top="0"
      justifyContent="space-between"
      alignItems="center"
      px={8}
      zIndex={1}
      flexDir={["column", "column", "row"]}
    >
      <Box fontWeight="bold" fontSize="lg" cursor="pointer">
        <Link href="/">
          <Image
            w={120}
            src={
              colorMode === "light"
                ? `../images/${logoImage}`
                : `../images/${logoImageDark}`
            }
            alt="LOGO"
          />
        </Link>
      </Box>
      <Box>
        {scrollLink.map((v, i) => {
          return (
            <ScrollLink key={i} to={v} spy={true} smooth={true}>
              <Button variant="ghost" mx={[0, 0, 8]} size={["xs", "sm", "md"]}>
                {v}
              </Button>
            </ScrollLink>
          );
        })}
      </Box>
      <Flex alignItems="center" my={[4, 4, 0]}>
        <Link href={openseaURL}>
          <Button variant="ghost" size={["xs", "xs", "sm"]}>
            <Image src="../images/opensea.png" alt="opensea" w={6} />
          </Button>
        </Link>
        <Link href={discordURL}>
          <Button variant="ghost" size={["xs", "xs", "sm"]}>
            <FaDiscord size={24} />
          </Button>
        </Link>
        {/* <Link href={instagramURL}>
          <Button variant="ghost" size={["xs", "xs", "sm"]}>
            <FaInstagram size={24} />
          </Button>
        </Link> */}
        {/* <Box onClick={toggleColorMode}>
          {colorMode === "light" ? (
            <Button variant="ghost" size={["xs", "xs", "sm"]}>
              <IoMoon size={24} />
            </Button>
          ) : (
            <Button variant="ghost" size={["xs", "xs", "sm"]}>
              <IoSunny size={24} />
            </Button>
          )}
        </Box> */}
      </Flex>
    </Flex>
  );
};

export default Header;
