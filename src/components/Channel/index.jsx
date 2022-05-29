import { AddIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Flex,
  Heading,
  Image,
  Link,
  Text,
  Avatar,
  Icon,
  Accordion,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { supabase } from "../../supabase";
import TwitchClips from "../Clip/TwitchClips";
import YTClips from "../Clip/YTClips";
import Editor from "./Editor";

function Channel(props) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [cookies, setCookie] = useCookies("user");
  const [openEditor, setOpenEditor] = useState(false);
  const [channels, setChannels] = useState([]);
  const twitchUrl = import.meta.env.VITE_TWITCH_BASE_URL;
  props = props.props;
  const { session } = props;
  const token = cookies.provider_token;

  useEffect(() => {
    setLoading(true);
    if (session && token) {
      axios
        .get(`${twitchUrl}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Client-Id": import.meta.env.VITE_TWITCH_CLIENT_ID,
          },
          params: {
            login: props.term,
          },
        })
        .then((res) => {
          if (res.data.data.length > 0) {
            setUser(res.data.data[0]);
            supabase
              .from("channels")
              .select("display_name,streamer,channel_id,official")
              .eq("approved", true)
              .eq("streamer", res.data.data[0].id)
              .then((res) => {
                setChannels(res.data);
                setLoading(false);
              });
            const { data, error } = supabase
              .from("streamers")
              .upsert(
                [
                  {
                    twitch_id: res.data.data[0].id,
                    display_name: res.data.data[0].display_name,
                  },
                ],
                { returning: "minimal" }
              )
              .then((res) => {});
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            supabase.auth.signOut();
          }
        });
    }
  }, []);

  if (loading) return <Text>loading</Text>;

  return (
    <Flex direction="column">
      <Flex align="center" justifyContent="center" padding={2}>
        <Avatar
          src={user.profile_image_url}
          name={user.display_name}
          alt={`${user.display_name}'s profile picture`}
          borderRadius="full"
          margin="2"
          size="xl"
        />
        <Flex direction="column" maxW="750">
          <Link href={`https://twitch.tv/${user.login}`}>
            <Heading>
              {user.display_name} <ExternalLinkIcon w={4} h={4} />
            </Heading>
          </Link>
          <Text noOfLines={4}>{user.description}</Text>
        </Flex>
      </Flex>
      <Accordion alignSelf="center">
        <TwitchClips props={{ user, session }} />
        {channels.map((channel) => {
              return <YTClips key={channel.channel_id} props={{ channel }} />;
            })
          }
      </Accordion>
      {!openEditor ? (
        <Button margin="5"
          onClick={() => {
            setOpenEditor(true);
          }}
        >
          <AddIcon padding={1} />
          Add Channel
        </Button>
      ) : (
        <Editor props={{ user }} />
      )}
    </Flex>
  );
}

export default Channel;
