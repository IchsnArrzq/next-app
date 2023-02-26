import Badge from "@/components/core/badge";
import Flex from "@/components/core/flex";
import Text from "@/components/core/text";
import { IconBriefcase } from "@tabler/icons-react";
import { FC } from "react";

export interface ExperienceListProps {
  stack: string;
  workplace: string;
  description: string;
  workingTime: "Full Time" | "Part Time" | "Freelance";
}

const ExperienceList: FC<ExperienceListProps> = ({
  stack,
  workplace,
  description,
  workingTime,
}) => {
  return (
    <div>
      <Flex direction="flex-col" gap="gap-y-1" items="items-stretch">
        <Flex items="items-center" justify="justify-between">
          <Text>{stack}</Text>
          <Badge>
            <Text color="text-purple-500">{workingTime}</Text>
          </Badge>
        </Flex>
        <Flex items="items-center" gap="gap-x-2">
          <IconBriefcase size={18} className="text-gray-500" />
          <Text size="sm" color="text-gray-500">
            {workplace}
          </Text>
        </Flex>
      </Flex>
      <div className="h-3"></div>
      <Text color="text-gray-600">{description}</Text>
    </div>
  );
};

export default ExperienceList;
