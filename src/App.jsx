import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { supabase } from "./supabase";
import { Container, Text } from "@chakra-ui/react";
import Channel from "./components/Channel";
import { useCookies } from "react-cookie";
import axios from "axios";
import AdminPanel from "./components/AdminPanel";

function App() {
  const [session, setSession] = useState(supabase.auth.session());
  const [isSearching, setSearching] = useState(false);
  const [cookies, setCookie] = useCookies(["user"]);
  const [term, setTerm] = useState("");
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if (session) {
      if ("provider_token" in session) {
        setCookie("provider_token", session.provider_token, {
          secure: false,
          sameSite: "Strict",
        });
        supabase
          .from("users")
          .select("id,role")
          .eq("id", session.user.id)
          .then((res) => {
            if (res.data.length === 0) {
              supabase
                .from("users")
                .insert([
                  {
                    id: session.user.id,
                  },
                ])
                .then(() => {});
            } else {
              if (res.data[0].role === "admin") {
                setAdmin(true);
              }
            }
          });
      }
      axios
        .get("https://id.twitch.tv/oauth2/validate", {
          headers: {
            Authorization: `Bearer ${cookies.provider_token}`,
          },
        })
        .catch((err) => {
          if (err.response.status === 401) {
            supabase.auth.signOut();
            setAdmin(false);
          }
        });
    } else setAdmin(false);
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        if ("provider_token" in session) {
          setCookie("provider_token", session.provider_token, {
            secure: false,
            sameSite: "Strict",
          });
        }
        supabase
          .from("users")
          .select("id,role")
          .eq("id", session.user.id)
          .then((res) => {
            if (res.data.length === 0) {
              supabase
                .from("users")
                .insert([
                  {
                    id: session.user.id,
                  },
                ])
                .then(() => {});
            } else {
              if (res.data[0].role === "admin") {
                setAdmin(true);
              }
            }
          });
      } else {
        setSession(null);
        setAdmin(false);
      }
    });
  }, []);

  return (
    <div className="App">
      <Navbar props={{ session, setSearching, term, setTerm }} />
      <Container maxWidth="1000">
        {!isSearching ? (
          <>
            <Text>Start by entering a channel name</Text>
            {admin ? <AdminPanel /> : null}
          </>
        ) : (
          <Channel props={{ session, term }} />
        )}
      </Container>
    </div>
  );
}

export default App;
