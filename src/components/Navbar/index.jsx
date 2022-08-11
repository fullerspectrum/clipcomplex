import React, { useState, useEffect } from "react";
import {
  Flex,
  Input,
  Text,
  Button,
  Spacer,
  InputGroup,
  InputRightElement,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitch } from "@fortawesome/free-brands-svg-icons";
import { supabase } from "../../supabase";
import useWindowDimensions from "../../WindowDimensions";
import { faArrowRightFromBracket, faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";

function Navbar(props) {
  props = props.props;
  const { colorMode, toggleColorMode } = useColorMode();
  const {width} = useWindowDimensions()
  const [shrink, setShrink] = useState(false)
  const twitchIcon = (
    <FontAwesomeIcon icon={faTwitch} color="#9146FF" fixedWidth pull="left" />
  );
  const logInIcon = (<FontAwesomeIcon icon={faArrowRightToBracket} fixedWidth pull="left" />)
  const logOutIcon = (<FontAwesomeIcon icon={faArrowRightFromBracket} fixedWidth pull="left" />)

  useEffect(() => {
    if(width <= 500) setShrink(true)
    else setShrink(false)
  },[width])

  function handleSubmit(e) {
    e.preventDefault();
    props.setSearching(true);
  }

  function handleInput(e) {
    const regex = /[^a-zA-Z0-9-_]/g
    props.setTerm(e.target.value.replace(regex,''))
    props.setSearching(false)
  }

  return (
    <div className="Navbar">
      <Flex alignItems="baseline" padding={2}>
        {!shrink ? <Text whiteSpace="nowrap" marginX={2}>
          CLIP COMPLEX
        </Text> : null }
        
        <form onSubmit={handleSubmit}>
          <Tooltip
            isDisabled={props.session ? true : false}
            label="Can't get channel info without login. Sorry!"
          >
            <InputGroup>
              <Input
                placeholder={
                  props.session ? "Channel name..." : "Sign-in required"
                }
                marginLeft={2}
                maxWidth={250}
                value={props.term}
                onChange={(e) => handleInput(e)}
                isRequired
                disabled={props.session ? false : true}
              ></Input>
              <InputRightElement>
                <Button
                  type="submit"
                  size="sm"
                  marginX={1}
                  disabled={props.session ? false : true}
                >
                  Go
                </Button>
              </InputRightElement>
            </InputGroup>
          </Tooltip>
        </form>
        <Spacer />
        <Flex direction="row-reverse" alignItems="baseline">
          {props.session ? (
            <Button variant="outline" onClick={() => supabase.auth.signOut()}>
              {twitchIcon} {logOutIcon} 
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => supabase.auth.signIn({ provider: "twitch" }, {redirectTo: "https://isaiah.moe/clipcomplex/"})}
            >
              {twitchIcon} {logInIcon}
            </Button>
          )}
          <IconButton
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            variant="ghost"
            onClick={toggleColorMode}
            marginX={1}
          />
        </Flex>
      </Flex>
    </div>
  );
}

export default Navbar;
