import { FC } from "react";
import Card from "@/components/core/card";
import Flex from "@/components/core/flex";
import Text from "@/components/core/text";
import Button from "@/components/core/button";
import { IconDownload } from "@tabler/icons-react";
import Image from "next/image";

interface CardProfileProps {
  avatar?: string;
  name?: string;
  login?: string;
}

const CardProfile: FC<CardProfileProps> = ({ avatar, name, login }) => {
  return (
    <Card className="overflow-hidden">
      <Card.Action className="relative h-40 bg-gradient-to-r from-red-500 via-purple-500 to-pink-500">
        <Image
          className="absolute translate-x-1/2 rounded-full top-10 right-1/2"
          src={avatar ?? ""}
          width={150}
          height={150}
          alt="profile"
        />
      </Card.Action>
      <Card.Body className="mt-6">
        <Flex direction="flex-col" justify="justify-center">
          <Text size="2xl" font="font-semibold">
            {name ?? "Ichsan Arrizqi"} {login ? `(${login}🐱‍🏍)` : "🐱‍🏍"}
          </Text>
          <Text size="md" color="text-gray-400">
            Web Developer
          </Text>
          <a href="/ichsan-arrizqi.pdf" download={true}>
            <Button
              className="animate-bounce"
              icon={
                <div className="mr-3">
                  <IconDownload size={20} />
                </div>
              }
            >
              <Text size="xs" font="font-semibold" color="text-white">
                Download CV
              </Text>
            </Button>
          </a>
        </Flex>
      </Card.Body>
    </Card>
  );
};

export default CardProfile;
