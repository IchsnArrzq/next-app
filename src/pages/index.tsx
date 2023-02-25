import type { NextPageWithLayout } from "./_app";
import {
  ReactElement,
  Reducer,
  SetStateAction,
  useReducer,
  useState,
} from "react";
import App from "@/components/common/layouts/app";
import Container from "@/components/core/container";

import CardProfile from "@/components/card-profile";
import CardInformation from "@/components/card-information";
import CardAbout from "@/components/card-about";
import CardSkill from "@/components/card-skill";
import CardExperience from "@/components/card-experience";
import { githubApi } from "@/http";
import type { GetServerSideProps } from "next";
import CardEducation from "@/components/card-education";
import ChatMe from "@/components/chat-me";

interface HomeProps {
  github?: {
    avatar_url?: string;
    login?: string;
    name?: string;
  };
}

export interface StateProps {
  buttonActive: "experience" | "education" | "chatMe";
}

const Home: NextPageWithLayout<HomeProps> = (props): JSX.Element => {
  const [{ buttonActive }, setState] = useState<StateProps>({
    buttonActive: "experience",
  });
  return (
    <>
      <div className="md:h-10"></div>
      <Container>
        <div className="grid md:gap-4 md:grid-cols-3">
          <div className="md:space-y-4">
            <CardProfile
              avatar={props.github?.avatar_url ?? ""}
              name={props.github?.name}
              login={props.github?.login}
            />
            <CardInformation />
            <CardSkill />
          </div>
          <div className="md:space-y-4 md:col-span-2">
            <CardAbout buttonActive={buttonActive} setState={setState} />
            {buttonActive == "experience" && <CardExperience />}
            {buttonActive == "education" && <CardEducation />}
            {buttonActive == "chatMe" && <ChatMe />}
          </div>
        </div>
      </Container>
      <div className="md:h-10"></div>
    </>
  );
};

Home.getLayout = (page: ReactElement) => {
  return <App>{page}</App>;
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const github = await githubApi().then((res) => res.json());
    return {
      props: {
        github,
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};
