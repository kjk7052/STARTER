import { Box, Flex, Grid } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import TeamCard from "./TeamCard";

// @ name: 팀원 이름, position: 포지션, image: public/images에 있는 이미지 이름, color: color 이름 (모든 색상이 가능하지는 않습니다.)
const teamCardConfig = [
  {
    name: "정빛나",
    position: "Graphic Design",
    image: "team/정빛나님.png",
    color: "pink",
    animation: "pulse",
  },
  {
    name: "한승종",
    position: "Product Manager",
    image: "team/한승종님.png",
    color: "yellow",
    animation: "pulse",
  },
  {
    name: "이영기",
    position: "Product Manager",
    image: "team/이영기님.png",
    color: "red",
    animation: "pulse",
  },
  {
    name: "김중건",
    position: "Smart Contract",
    image: "team/김중건님.png",
    color: "purple",
    animation: "pulse",
  },
  {
    name: "권오정",
    position: "Frontend",
    image: "team/권오정님.png",
    color: "blue",
    animation: "pulse",
  },
  {
    name: "김백승",
    position: "Frontend",
    image: "team/김백승님.png",
    color: "green",
    animation: "pulse",
  },
];

const Team: FC = () => {
  const { t } = useTranslation("common");

  return (
    <Flex minH="100vh" alignItems="center" id="Team" flexDir="column">
      <Box fontSize="6xl" fontWeight="bold" mt={4}>
        {t("team")}
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
        {teamCardConfig.map((v, i) => {
          return (
            <TeamCard
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
  );
};

export default Team;
