import { FC } from "react";
import Card from "@/components/core/card";
import Button from "@/components/core/button";
import Flex from "@/components/core/flex";
import Text from "@/components/core/text";
import { IconBrandWhatsapp } from "@tabler/icons-react";
const ChatMe: FC = () => {
  return (
    <Card>
      <Card.Body>
        <Flex direction="flex-col" justify="justify-center" items="items-start">
          <Text size="2xl" font="font-semibold">
            Chat Me 📱
          </Text>
          <a target="_blank" href="https://wa.me/+6281296031743">
            <Button
              icon={
                <div className="mr-3">
                  <IconBrandWhatsapp size={20} />
                </div>
              }
              className="bg-green-500 focus:ring-green-500 hover:bg-green-600 focus:bg-green-700"
            >
              Whatsapp
            </Button>
          </a>
        </Flex>
      </Card.Body>
    </Card>
  );
};

export default ChatMe;
