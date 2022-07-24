import type { NextPage } from "next";
import { Flex } from "@chakra-ui/layout";

const Custom404: NextPage = () => {
    return (
        <Flex
        justifyContent="center"
        alignItems="center"
        minH="100vh"
        flexDir="column"
        >
            <h1>404 - Page Not Found</h1>
        </Flex>
    )
}

export default Custom404;