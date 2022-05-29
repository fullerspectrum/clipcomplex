import {
  Avatar,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  Link,
  Select,
  Spacer,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "../../supabase";

function Editor(props) {
  const [searching, isSearching] = useState(true);
  const [url, setUrl] = useState("");
  const [session, setSession] = useState(supabase.auth.session());
  const [channel, setChannel] = useState({});
  const [official, setOfficial] = useState(true)
  const [searchStatus, setSearchStatus] = useState('gray')
  const [confirmStatus, setConfirmStatus] = useState('gray')
  const { user } = props.props;
  const urlFilter = /http.:\/\/.+\/(?:c|user|channel)\//g;

  function handleSubmit(e) {
    e.preventDefault();
    isSearching(true);
    let filteredUrl = url.replace(urlFilter, "");
    filteredUrl = filteredUrl.replace("/", "");
    if (filteredUrl) {
      axios
        .get(`${import.meta.env.VITE_YT_SERVER}/ytchannel/`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          params: {
            id: url,
          },
        })
        .then((res) => {
          setChannel(res.data);
          // console.log(res.data)
          isSearching(false);
          setSearchStatus("green")
        }).catch(err => {
          // console.log(err.response.status)
          setSearchStatus("red")
        }).finally(()=>{
          setTimeout(() => {
            setSearchStatus("gray")
          }, 750);
        })
    }
  }

  function handleConfirm(e) {
    supabase
      .from("channels")
      .select("*")
      .eq("channel_id", channel.channelId)
      .eq("streamer", user.id)
      .then((res) => {
        if (res.data.length === 0) {
          supabase.from("channels").upsert([
            {
              added_by: session.user.id,
              display_name: channel.channelName,
              streamer: user.id,
              channel_id: channel.channelId,
              official: official
            },
          ]).then(()=>{
            setConfirmStatus("green")
          }).catch(()=>{
            setConfirmStatus("red")
          }).finally(()=>{
            setTimeout(() => {
              setConfirmStatus("gray")
            }, 750);
          })
        }
      });
  }

  return (
    <Container paddingY={3} paddingBottom={5} marginY="1" maxWidth={900}>
      <Heading size="md" padding="1" marginY="3">
        Channels
      </Heading>
      <form onSubmit={handleSubmit}>
        <Flex>
          <InputGroup>
            <Input
              placeholder="Channel URL..."
              name="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <InputRightAddon padding="0">
              <Select name="official" onChange={(e) => setOfficial(e.target.value)} required>
                <option value={true}>Official</option>
                <option value={false}>Unofficial</option>
              </Select>
            </InputRightAddon>
          </InputGroup>
          <Button onClick={handleSubmit} marginX="1"  variant="outline" colorScheme={searchStatus}>
            Search
          </Button>
        </Flex>
      </form>
      {!searching ? (
        <Flex justify="center" align="center" paddingY="5">
          <Avatar
            src={channel.channelAvatar}
            marginX="1"
            borderRadius="full"
            alt={`${channel.channelName}'s Avatar`}
          />
          <Heading size="md">
            <Link href={`https://www.youtube.com/channel/${channel.channelId}`}>
              {channel.channelName}
            </Link>
          </Heading>
          <Spacer />
          <Button onClick={handleConfirm} colorScheme={confirmStatus}>Confirm</Button>
        </Flex>
      ) : null}
    </Container>
  );
}

export default Editor;
