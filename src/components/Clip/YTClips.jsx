import React, { useEffect, useState } from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import useWindowDimensions from "../../WindowDimensions";
import { supabase } from "../../supabase";
import Clip from "../Clip";

function YTClips(props) {
  const ytIcon = (
    <FontAwesomeIcon icon={faYoutube} color="#FF0000" fixedWidth pull="left" />
  );
  const verified = (
    <FontAwesomeIcon icon={faCheckCircle} color="#00FF00" fixedWidth />
  );
  const { channel } = props.props;
  const { height, width } = useWindowDimensions();
  const [rowSize, setRowSize] = useState(5);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(supabase.auth.session());
  const [videos, setVideos] = useState();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_YT_SERVER}/ytvideos/`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        params: {
          id: channel.channel_id,
        },
      })
      .then((res) => {
        setVideos(res.data.videos);
        setLoading(false);
      });
  }, []);

  useEffect(() => {}, [channel]);

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
              {ytIcon}
              {channel.display_name}
              {channel.official ? verified : null} <AccordionIcon />
            </Heading>
            <Flex columns={rowSize}>
              {videos.slice(0, Math.min(rowSize, videos.length)).map((clip) => {
                return <Clip props={clip} key={clip.videoId} />;
              })}
            </Flex>
          </Flex>
        </AccordionButton>
        <AccordionPanel>
          <SimpleGrid columns={rowSize}>
            {videos.slice(rowSize, videos.length).map((clip) => {
              return <Clip props={clip} key={clip.videoId} />;
            })}
          </SimpleGrid>
        </AccordionPanel>
      </AccordionItem>
    );
  else return null;
}

export default YTClips;
