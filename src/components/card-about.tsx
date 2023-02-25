import { Dispatch, FC, SetStateAction, useContext } from "react";

import Card from "@/components/core/card";
import Flex from "@/components/core/flex";
import Text from "@/components/core/text";
import {
  IconAt,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandGithub,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import { StateProps } from "@/pages";

interface CardAboutType {
  setState: Dispatch<SetStateAction<StateProps>>;
}
const CardAbout: FC<StateProps & CardAboutType> = ({
  buttonActive,
  setState,
}) => {
  return (
    <Card>
      <Card.Action className="relative">
        <div className="absolute flex space-x-1 right-3 top-3">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
        </div>
      </Card.Action>
      <Card.Body>
        <Flex direction={"flex-col"}>
          <Text font="font-semibold" size="xl">
            About me 📝
          </Text>
          <Text color="text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio,
            dolore est sapiente quod vitae facere nisi perspiciatis distinctio
            aut facilis inventore adipisci deleniti, veritatis recusandae sed
            autem laboriosam illum minima!
          </Text>
          <Flex items="items-center" gap="gap-1">
            <Text color="text-purple-800">
              <IconAt size={18} />
            </Text>
            <Text color="text-purple-800">ichsanarrizqi090@gmail.com</Text>
          </Flex>
          <Flex>
            <IconBrandFacebook size={25} />
            <IconBrandInstagram size={25} />
            <IconBrandGithub size={25} />
            <IconBrandLinkedin size={25} />
          </Flex>
        </Flex>
      </Card.Body>
      <Card.Action className="px-6">
        <Flex className="space-x-4 border-t">
          <button
            onClick={() => {
              setState({ buttonActive: "experience" });
            }}
            className={`py-6 ${
              buttonActive == "experience"
                ? "text-purple-500 border-b-2 border-purple-500 font-semibold"
                : ""
            }`}
          >
            Experience
          </button>

          <button
            onClick={() => {
              setState({
                buttonActive: "education",
              });
            }}
            className={`py-6 ${
              buttonActive == "education"
                ? "text-purple-500 border-b-2 border-purple-500 font-semibold"
                : ""
            }`}
          >
            Education
          </button>

          <button
            onClick={() => {
              setState({
                buttonActive: "chatMe",
              });
            }}
            className={`py-6 ${
              buttonActive == "chatMe"
                ? "text-purple-500 border-b-2 border-purple-500 font-semibold"
                : ""
            }`}
          >
            Chat Me
          </button>
        </Flex>
      </Card.Action>
    </Card>
  );
};

export default CardAbout;
