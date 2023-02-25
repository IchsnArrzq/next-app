import { FC, ReactNode } from "react";
import {
  IconBrandTypescript,
  IconBrandLaravel,
  IconBrandNextjs,
  IconBrandTailwind,
  IconBrandMantine,
} from "@tabler/icons-react";

import IconBrandLivewire from "@/assets/livewire.svg";

import Card from "@/components/core/card";
import Text from "@/components/core/text";
import Flex from "@/components/core/flex";
import Badge from "@/components/core/badge";
import Image from "next/image";

interface SkillType {
  value: string;
  icon: ReactNode;
  textColor: string;
}

const skills: SkillType[] = [
  {
    value: "NextJs",
    icon: <IconBrandNextjs className="text-black" />,
    textColor: "text-black",
  },
  {
    value: "Laravel",
    icon: <IconBrandLaravel className="text-red-600" />,
    textColor: "text-red-600",
  },
  {
    value: "Mantine",
    icon: <IconBrandMantine className="text-sky-600" />,
    textColor: "text-sky-600",
  },
  {
    value: "Tailwindcss",
    icon: <IconBrandTailwind className="text-cyan-600" />,
    textColor: "text-cyan-600",
  },
  {
    value: "Typescript",
    icon: <IconBrandTypescript className="text-blue-700" />,
    textColor: "text-blue-700",
  },
  {
    value: "Livewire",
    icon: (
      <Image
        src={IconBrandLivewire.src}
        width={24}
        height={24}
        alt="livewire"
      />
    ),
    textColor: "text-pink-600",
  },
];

const CardSkill: FC = () => {
  const skillList = skills.map((skill, key) => (
    <Badge color="purple" key={key}>
      <Flex>
        <Text color={skill.textColor} font="font-semibold">
          {skill.value}
        </Text>
        {skill.icon}
      </Flex>
    </Badge>
  ));
  return (
    <Card>
      <Card.Body>
        <Flex direction="flex-col" justify="justify-center">
          <Text size="2xl" font="font-semibold">
            Skills 🎯
          </Text>
          <Flex className="flex-wrap">{skillList}</Flex>
        </Flex>
      </Card.Body>
    </Card>
  );
};

export default CardSkill;
