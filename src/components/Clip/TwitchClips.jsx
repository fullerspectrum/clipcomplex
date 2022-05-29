import {
  AccordionButton,
  AccordionItem,
  Heading,
  Flex,
  Text,
  AccordionIcon,
  AccordionPanel,
  SimpleGrid,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitch } from "@fortawesome/free-brands-svg-icons";
import { useCookies } from "react-cookie";
import useWindowDimensions from "../../WindowDimensions";
import Clip from "../Clip";

function TwitchClips(props) {
  props = props.props;
  const { user, session } = props;
  const [cookies, setCookie] = useCookies("user");
  const token = cookies.provider_token;
  const twitchUrl = import.meta.env.VITE_TWITCH_BASE_URL;
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { height, width } = useWindowDimensions();
  const [rowSize, setRowSize] = useState(5);
  const twitchIcon = (
    <FontAwesomeIcon icon={faTwitch} color="#9146FF" fixedWidth pull="left" />
  );
  let lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  useEffect(() => {
    axios
      .get(`${twitchUrl}/clips`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-Id": import.meta.env.VITE_TWITCH_CLIENT_ID,
        },
        params: {
          broadcaster_id: user.id,
          started_at: lastWeek.toISOString(),
        },
      })
      .then((res) => {
        setClips(res.data.data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (width > 800) setRowSize(5);
    if (width <= 800) setRowSize(4);
    if (width <= 650) setRowSize(3);
    if (width <= 500) setRowSize(2);
  }, [width]);

  if (!loading)
    return (
      <AccordionItem>
        <AccordionButton textAlign="left">
          <Flex direction="column">
            <Heading size="md">
              {twitchIcon}Clips <AccordionIcon />
            </Heading>
            <Flex columns={rowSize}>
              {clips.slice(0, Math.min(rowSize, clips.length)).map((clip) => {
                return <Clip props={clip} key={clip.id} />;
              })}
            </Flex>
          </Flex>
        </AccordionButton>
        <AccordionPanel>
          <SimpleGrid columns={rowSize}>
            {clips.slice(rowSize, clips.length).map((clip) => {
              return <Clip props={clip} key={clip.id} />;
            })}
          </SimpleGrid>
        </AccordionPanel>
      </AccordionItem>
    );
  else return <Text>Loading...</Text>;
}

export default TwitchClips;
