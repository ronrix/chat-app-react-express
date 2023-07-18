import { Spinner } from "@material-tailwind/react";
import { useRef, useEffect } from "react";
import ErrorMessage from "../../../components/errors/error-messages";
import Bubble from "./bubble";
import { IMessageType } from "./types";
import ComposerHeader from "./composer-header";

type Props = {
  msgs: [];
  loading: boolean;
};

// extract src from img tag
function extractSrcFromImgTag(imgTag: string) {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = imgTag;
  const imgElement = tempElement.querySelector("img");

  return imgElement?.getAttribute("src") || "";
}

export default function ComposeContainer(props: Props) {
  const { msgs, loading } = props;
  const chatboxRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // scroll chat box to the bottom
    if (chatboxRef.current && chatboxRef.current?.scrollHeight > 600) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [chatboxRef, loading, msgs]);

  return (
    <div className='flex-3 overflow-auto flex flex-col h-full'>
      <ComposerHeader />

      {/* body */}
      <section
        ref={chatboxRef}
        className='flex flex-col gap-5 overflow-auto h-full'
      >
        {loading ? (
          <Spinner className='mx-auto mt-10' />
        ) : msgs.length ? (
          msgs.map((msg: IMessageType, i: number) => {
            const imgRegex = /<img.*?>/g; // regex to match <img /> tags
            const imgTags = msg.msg.match(imgRegex); // get the img tags from string msg
            const imgSrcs = imgTags?.map(
              (
                imgTag // extract the src from img tags, returns an array of src
              ) => extractSrcFromImgTag(imgTag)
            );

            const text = msg.msg.replace(imgRegex, ""); // replace <img /> with empty string to exclude it from the message text
            if (msg?.sender) {
              return (
                <Bubble
                  key={i}
                  text={text}
                  msg={msg}
                  imgSrcs={imgSrcs}
                  msgId={msg._id}
                  msgReactions={msg.reactions}
                />
              );
            }

            // for group chat. 'user joined the room'
            return (
              <div key={i} className='text-sm text-gray-400 mx-auto'>
                {msg.msg}
              </div>
            );
          })
        ) : (
          <ErrorMessage msg='No mesasge yet' />
        )}
      </section>
    </div>
  );
}
