import {
  Table,
  TableCaption,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import ListChannels from "./ListChannels";

function AdminPanel(props) {
  const [channels, setChannels] = useState([]);
  useEffect(() => {
    getChannels();
  }, []);

  function getChannels() {
    supabase
      .from("channels")
      .select("*, streamers!inner(display_name)")
      .eq("approved", false)
      .then((res) => {
        setChannels(res.data);
      });
  }

  return (
    <>
      <Table variant="striped">
        <TableCaption>Unapproved channels</TableCaption>
        <Thead>
          <Tr>
            <Th>Channel</Th>
            <Th>Streamer</Th>
            <Th>Added by</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {channels.map((channel) => {
            return (
              <ListChannels
                key={channel.id}
                props={channel}
                getChannels={getChannels}
              />
            );
          })}
        </Tbody>
      </Table>
    </>
  );
}

export default AdminPanel;
