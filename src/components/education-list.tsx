import Flex from "@/components/core/flex";
import Text from "@/components/core/text";
import { IconSchool } from "@tabler/icons-react";
import { FC } from "react";

const EducationList: FC = () => {
  return (
    <div>
      <Flex direction="flex-col" gap="gap-y-1" items="items-stretch">
        <Text>Software Engineering</Text>
        <Flex items="items-center" gap="gap-x-2">
          <IconSchool size={18} className="text-gray-500" />
          <Text size="sm" color="text-gray-500">
            Smk Wikrama Bogor
          </Text>
        </Flex>
      </Flex>
    </div>
  );
};

export default EducationList;
