import React from "react";

import styled from "styled-components";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { io } from "socket.io-client";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

const Chat = () => {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [loggedUser, setLoggedUser] = useState(undefined);
  const { currentUser } = useUser();

  // -----------------------------------------------------------checking the user------------------------------------------//

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else {
      setLoggedUser(currentUser);
    }
  }, []);

  // ------------------------------------------------------------Socket connection--------------------------------------------//

  useEffect(() => {
    if (loggedUser) {
      socket.current = io("http://localhost:8001");
      socket.current.emit("add-user", loggedUser._id);
    }
  }, [loggedUser]);

  // ------------------------------------------------------------Loading all contacts------------------------------------------//

  useEffect(() => {
    const func1 = async () => {
      if (loggedUser) {
        if (loggedUser.isAvatarImageSet) {
          const response = await axios.get(
            `http://localhost:8001/auth/getAllUsers/${loggedUser._id}`
          );
          setContacts(response.data);
        } else {
          navigate("/setAvatar");
        }
      }
    };
    func1();
  }, [loggedUser]);

  // ---------------------------------------------- handleChange---------------------------------------------------------------//

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  // ---------------------------------------------- return statement--------------------------------------------------------//
  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;
