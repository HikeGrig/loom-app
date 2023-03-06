import React, { useEffect, useState } from 'react';
import { setup, isSupported } from "@loomhq/record-sdk";
import { oembed } from "@loomhq/loom-embed";

const PUBLIC_APP_ID = process.env.app_id;
const BUTTON_ID = "loom-record-sdk-button";

export default function App() {
  const [videoHTML, setVideoHTML] = useState("");

  useEffect(() => {
    async function setupLoom() {
      const { supported, error } = await isSupported();

      if (!supported) {
        console.warn(`Error setting up Loom: ${error}`);
        return;
      }

      const button = document.getElementById(BUTTON_ID);

      if (!button) {
        return;
      }

      let response = await fetch(`/api/getToken`);
      let json;
      if (response.ok) {
        json = await response.json();
      } else {
        alert("Ошибка HTTP: " + response.status);
      }

      const { configureButton } = await setup({
        publicAppId: PUBLIC_APP_ID,
        jws: json.token,
      });

      const sdkButton = configureButton({ element: button });

      sdkButton.on("insert-click", async (video) => {
        const { html } = await oembed(video.sharedUrl, { width: 400 });
        setVideoHTML(html);
      });

      sdkButton.on("recording-complete", async (video) => {
        console.log(video.sharedUrl)
      });

    }

    setupLoom();
  }, []);

  return (
    <>
      <button id={BUTTON_ID}>Record</button>
      <div dangerouslySetInnerHTML={{ __html: videoHTML }}></div>
    </>
  );
}