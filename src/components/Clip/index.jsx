import {
  Text,
  Box,
  Image,
  Heading,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  useDisclosure,
  Spacer,
  Container,
  Drawer,
  DrawerContent,
  DrawerOverlay,
} from "@chakra-ui/react";
import dateFormat from "dateformat";
import Parser from "any-date-parser";
import React, { useState, useEffect } from "react";
import useWindowDimensions from "../../WindowDimensions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEye, faClock} from "@fortawesome/free-solid-svg-icons"

function Clip(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [duration, setDuration] = useState();
  const [url, setUrl] = useState();
  const [thumbnail, setThumbnail] = useState("");
  const { width, height } = useWindowDimensions();
  const [position, setPosition] = useState("top")
  const [created_at, setCreatedAt] = useState("")
  const [views, setViews] = useState("0")
  const placeholderThumbnail = "https://via.placeholder.com/160x90.png?text=";
  const viewIcon = <FontAwesomeIcon icon={faEye} size="xs" />
  const timeIcon = <FontAwesomeIcon icon={faClock} size="xs" />
  const clip = props.props;

  useEffect(() => {
    if ("duration" in clip) {
      setDuration(
        `0:${clip.duration < 10 ? 0 : ""}${Math.floor(clip.duration)}`
      );
      setUrl(clip.embed_url + `&parent=${window.location.hostname}`);
      setThumbnail(clip.thumbnail_url);
      setViews(clip.view_count.toLocaleString())
    } else {
      setDuration(clip.durationText);
      setUrl(`https://www.youtube.com/embed/${clip.videoId}`);
      if (clip.videoThumbnails) setThumbnail(clip.videoThumbnails[clip.videoThumbnails.length - 1].url);
      setViews(clip.viewCount.toLocaleString())
    }
    // setCreatedAt(clip.created_at
    // ? new Date(clip.created_at)
    // : Parser.fromString(clip.publishedText));
    //   console.log(clip.publishedText)
  }, [clip]);

  useEffect(()=>{

  },[width])

  return (
    <Box padding={1} onClick={onOpen}>
      <Image
        src={thumbnail || placeholderThumbnail + clip.title}
        w="160"
        h="90"
      />
      <Heading size="xs" maxW="40" noOfLines={3}>
        {clip.title}
      </Heading>
      <Text fontSize="sm">{timeIcon} {duration} • {viewIcon} {views}</Text>
      <Drawer isOpen={isOpen} onClose={onClose} placement={position}>
        <DrawerOverlay />
        <DrawerContent maxH="75%">
          <iframe src={url} width={width} height={(width /1.78)} />
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default Clip;
