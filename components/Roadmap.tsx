import { Box, Flex } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import RoadmapCard from "./RoadmapCard";

// @ 로드맵에 맞게 추가, 삭제하여 작성해주시면 됩니다. 로드맵의 타이틀과 설명은 public/locales 의 json 파일을 작성 후 NextJS를 재 실행 해야 합니다.
const roadmapCardConfig = [
  {
    justifyContent: "",
    animation: "slideInLeft",
    title: "roadmapTitle1",
    description: "roadmap1",
    color: "yellow",
    colorDark: "purple",
  },
  {
    justifyContent: "end",
    animation: "slideInRight",
    title: "roadmapTitle2",
    description: "roadmap2",
    color: "yellow",
    colorDark: "purple",
  },
  {
    justifyContent: "",
    animation: "slideInLeft",
    title: "roadmapTitle3",
    description: "roadmap3",
    color: "yellow",
    colorDark: "purple",
  },
  {
    justifyContent: "end",
    animation: "slideInRight",
    title: "roadmapTitle4",
    description: "roadmap4",
    color: "yellow",
    colorDark: "purple",
  },
  {
    justifyContent: "",
    animation: "slideInLeft",
    title: "roadmapTitle5",
    description: "roadmap5",
    color: "yellow",
    colorDark: "purple",
  },
  {
    justifyContent: "end",
    animation: "slideInRight",
    title: "roadmapTitle6",
    description: "roadmap6",
    color: "yellow",
    colorDark: "purple",
  },
  {
    justifyContent: "",
    animation: "slideInLeft",
    title: "roadmapTitle7",
    description: "roadmap7",
    color: "yellow",
    colorDark: "purple",
  },
  {
    justifyContent: "end",
    animation: "slideInRight",
    title: "roadmapTitle8",
    description: "roadmap8",
    color: "yellow",
    colorDark: "purple",
  },
];

const Roadmap: FC = () => {
  const { t } = useTranslation("common");

  return (
    <Flex
      minH="100vh"
      alignItems="center"
      id="Roadmap"
      flexDir="column"
      mb={24}
    >
      <Box fontSize="6xl" fontWeight="bold" mt={4} mb={16}>
        {t("roadmap")}
      </Box>
      {roadmapCardConfig.map((v, i) => {
        return (
          <RoadmapCard
            key={"roadmap_"+i}
            justifyContent={v.justifyContent}
            animation={v.animation}
            title={t(v.title)}
            description={t(v.description)}
            color={v.color}
            colorDark={v.colorDark}
          />
        );
      })}
    </Flex>
  );
};

export default Roadmap;
