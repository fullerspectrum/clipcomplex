import { Button, Link, Td, Tr } from "@chakra-ui/react";
import { useEffect } from "react";
import { supabase } from "../../supabase";

function ListChannels(props) {
  const channel = props.props;

  useEffect(() => {
  }, []);

  function approve() {
    supabase
      .from("channels")
      .update({
        approved: true,
      })
      .eq("id", channel.id)
      .then(() => {
        props.getChannels();
      });
  }

  return (
    <Tr>
      <Td>
        <Link href={`https://youtube.com/channel/${channel.channel_id}`}>
          {channel.display_name}
        </Link>
      </Td>
      <Td>
        <Link href={`https://twitch.tv/${channel.streamers.display_name}`}>
          {channel.streamers.display_name}
        </Link>
      </Td>
      <Td>{channel.added_by}</Td>
      <Td>
        <Button onClick={approve}>Approve</Button>
      </Td>
    </Tr>
  );
}
export default ListChannels;
