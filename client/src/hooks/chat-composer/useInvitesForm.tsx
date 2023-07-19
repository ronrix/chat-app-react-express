import { useState, useEffect, useContext } from "react";
import { ActionMeta, MultiValue } from "react-select";
import axios from "../../utils/axios";
import {
  MessageContext,
  MessageContextType,
} from "../../context/message.context";
import { toast } from "react-toastify";

export default function useInvitesForm() {
  const [people, setPeople] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [invited, setInvited] = useState<string[]>([]);
  const messageContext = useContext<MessageContextType | null>(MessageContext);

  // fetch people
  async function fetchPeople() {
    try {
      const { data } = await axios.get("/users");
      const formattedPeople = data.map(
        (people: { _id: string; username: string; avatar: string }) => ({
          value: { id: people._id, avatar: people.avatar },
          label: people.username,
        })
      );
      setPeople(formattedPeople);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  // filter people state
  const filterPeople = async (inputValue: string) => {
    // 1. filter from the state
    const defaultState = people.filter((i: { label: string }) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    // 2. if not found in the state, fetch from the server
    const { data } = await axios.get("/user/" + inputValue);

    return defaultState.length ? defaultState : data.data;
  };

  //   fetch search people
  const promiseOptions = (inputValue: string) => {
    return new Promise((resolve) => {
      resolve(filterPeople(inputValue));
    });
  };

  // form submit function
  const handleSubmitInvites = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!people.length) return; // don't execute fetch if state is empty
    try {
      const { data } = await axios.post("/groups/invites", {
        people: invited,
        docId: messageContext?.chatUser.msgDocId,
      });
      console.log(data);
      if (data.status === 201) {
        toast.success(data.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeSelect = (newValue: MultiValue<unknown>) => {
    const values = newValue.map((val: any) => val.value.id);
    setInvited(values);
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  return {
    loading,
    handleChangeSelect,
    handleSubmitInvites,
    promiseOptions,
    people,
  };
}
