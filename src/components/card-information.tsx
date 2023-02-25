import { FC } from "react";
import Card from "@/components/core/card";
import Flex from "@/components/core/flex";
import Text from "@/components/core/text";

const CardInformation: FC = () => {
  return (
    <Card>
      <Card.Body>
        <Flex
          direction="flex-col"
          justify="justify-center"
          items="items-stretch"
        >
          <Text size="2xl" font="font-semibold">
            Information 📣
          </Text>
          <Flex justify={"justify-between"}>
            <Text size="md" color="text-gray-400">
              Location
            </Text>
            <Text size="md" color="text-gray-800">
              Bogor
            </Text>
          </Flex>
          <Flex justify={"justify-between"}>
            <Text size="md" color="text-gray-400">
              Experience
            </Text>
            <Text size="md" color="text-gray-800">
              1+ Years
            </Text>
          </Flex>
          <Flex justify={"justify-between"}>
            <Text size="md" color="text-gray-400">
              Availability
            </Text>
            <Text size="md" color="text-gray-800">
              1 week
            </Text>
          </Flex>
          <Flex justify={"justify-between"}>
            <Text size="md" color="text-gray-400">
              Relocation
            </Text>
            <Text size="md" color="text-gray-800">
              No
            </Text>
          </Flex>
        </Flex>
      </Card.Body>
    </Card>
  );
};

export default CardInformation;
