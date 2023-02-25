import { FC } from "react";
import Card from "@/components/core/card";
import Flex from "@/components/core/flex";
import Text from "@/components/core/text";

const CardEducation: FC = () => {
  return (
    <Card>
      <Card.Body>
        <Flex
          direction="flex-col"
          justify="justify-center"
          items="items-stretch"
        >
          <Text size="2xl" font="font-semibold">
            Education 🎓
          </Text>
        </Flex>
      </Card.Body>
    </Card>
  );
};

export default CardEducation;
