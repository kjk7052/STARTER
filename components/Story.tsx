import { Box, Flex, Image, Text, useColorMode } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";

// @ 이미지는 public/images, 스토리 내용은 public/locales의 json 파일을 각각 수정해서 사용하시면 됩니다.
// const storyImage = "lion.gif";
const storyImage = "dollgrock_toon.jpeg";
const storyConfig = [
  {
    mt: 0,
    title: "storyTitle1",
    description: ["story1-1", "story1-2", "story1-3"],
  },
  {
    mt: 0,
    title: "storyTitle2",
    description: ["story2-1"],
  },
  {
    mt: 0,
    title: "storyTitle3",
    description: ["story3-1", "story3-2"],
  },
  {
    mt: 0,
    title: "storyTitle4",
    description: ["story4-1"],
  },
  {
    mt: 8,
    title: "storyTitle5",
    description: ["story5-1"],
  },
  {
    mt: 8,
    title: "storyTitle6",
    description: ["story6-1"],
  },
  {
    mt: 8,
    title: "storyTitle7",
    description: ["story7-1"],
  },
  {
    mt: 8,
    title: "storyTitle8",
    description: ["story8-1", "story8-2", "story8-3"],
  },
  {
    mt: 8,
    title: "storyTitle9",
    description: ["story9-1"],
  },
];

const Story: FC = () => {
  const { t } = useTranslation("common");

  const { colorMode } = useColorMode();

  return (
    <Flex
      minH="100vh"
      justifyContent="center"
      alignItems="center"
      id="Story"
      flexDir={["column", "column", "row"]}
    >
      <Flex w={["full", "full%", "50%"]}>
        <Box w={["full", "full%"]} p={8}>
          <Text textAlign="center" mb={8} fontSize="4xl" fontWeight="bold">
            {t("story")}
          </Text>
          <Image
            src={`../images/${storyImage}`}
            borderRadius="2xl"
            alt="story"
          />
        </Box>
      </Flex>
      <Flex
        w={["full", "full%", "50%"]}
        justifyContent="center"
        alignItems="center"
      >
        <Box
          mx={8}
          bgColor={colorMode === "light" ? "gray.100" : "gray.700"}
          px={4}
          py={8}
          borderRadius="2xl"
        >
          {storyConfig.map((v, i) => {
            return (
              // 1안
              <Box key={i} mt={v.mt}>
                {
                  v.description.map((_story, _i)=>{return(
                    <Text key={_i}>{t(_story)}</Text>
                  )})
                }
              </Box>
              // 2안
              // <>
              // {
              //   v.description.map((_story, _i)=>{return(
              //     <Text key={_i}>{t(_story)}</Text>
              //   )})
              // }
              // </>
            );
          })}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Story;
