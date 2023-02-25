import { FC } from "react";
import Card from "@/components/core/card";
import Text from "@/components/core/text";
import Flex from "@/components/core/flex";

const CardExperience: FC = () => {
  return (
    <Card>
      <Card.Body>
        <Flex
          direction="flex-col"
          justify="justify-center"
          items="items-stretch"
        >
          <Text size="2xl" font="font-semibold">
            Experience 💼
          </Text>
        </Flex>
      </Card.Body>
    </Card>
  );
};

export default CardExperience;
