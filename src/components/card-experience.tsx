import { FC } from "react";
import Card from "@/components/core/card";
import Text from "@/components/core/text";
import Flex from "@/components/core/flex";
import ExperienceList, {
  ExperienceListProps,
} from "@/components/experience-list";

const experiences: [ExperienceListProps] = [
  {
    stack: "Fullstack Web Developer",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rem numquam vitae eum quisquam dolorum unde eveniet totam atque vel sapiente fugiat, voluptatibus, odio harum asperiores explicabo, repellendus magnam expedita possimus.",
    workingTime: "Full Time",
    workplace: "Pt Matra Hillindo Teknologi",
  },
];

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
          {experiences.map((experience, key) => {
            return <ExperienceList key={key} {...experience} />;
          })}
        </Flex>
      </Card.Body>
    </Card>
  );
};

export default CardExperience;
