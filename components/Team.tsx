import { Box, Flex, Grid } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import TeamCard from "./TeamCard";

// @ name: 팀원 이름, position: 포지션, image: public/images에 있는 이미지 이름, color: color 이름 (모든 색상이 가능하지는 않습니다.)
const teamCardConfig = [
  {
    name: "정빛나",
    position: "Product Manager",
    image: "team1.png",
    color: "blue",
    animation: "tada",
  },
  {
    name: "한승종",
    position: "Frontend",
    image: "team2.png",
    color: "yellow",
    animation: "tada",
  },
  {
    name: "김중건",
    position: "Graphic Design",
    image: "team3.png",
    color: "green",
    animation: "tada",
  },
  {
    name: "이영기",
    position: "Smart Contract",
    image: "team4.png",
    color: "red",
    animation: "tada",
  },
  {
    name: "권오정",
    position: "Frontend",
    image: "team2.png",
    color: "yellow",
    animation: "tada",
  },
  {
    name: "김백승",
    position: "Graphic Design",
    image: "team3.png",
    color: "green",
    animation: "tada",
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
