import { readFileSync, writeFileSync } from "fs";
import fetch from "node-fetch";

const WAIT_TIME = 2000;

const sleep = () => new Promise((r) => setTimeout(r, WAIT_TIME));

const constructQuery = (trickName, category) =>
    `how to ${trickName} skateboard ${category}`;

const getVideos = async (query) => {
    const res = await fetch(
        "https://youtube.googleapis.com/youtube/v3/search?" +
            new URLSearchParams({
                key: process.env.YOUTUBE_API_KEY,
                maxResults: 5,
                part: "id",
                q: query,
                type: "video",
            })
    );
    const { items } = await res.json();
    return items.map(({ id }) => id?.videoId);
};

const getVideoData = async () => {
    const tricks = JSON.parse(readFileSync("data/tricks.json"), "utf-8");
    for (const { data, title } of tricks) {
        for (const trick of data) {
            if (trick.hasVideos) {
                continue;
            }
            const query = constructQuery(trick.name, title);
            try {
                const videos = await getVideos(query);
            } catch (e) {
                console.log(
                    "API limit reached or another error occured, returning updated data"
                );
                return tricks;
            }
            trick.youtubeIds = videos;
            trick.hasVideos = true;
            console.log("videos retrieved:", query, videos);
            await sleep();
        }
    }
    return tricks;
};

const main = async () => {
    const data = await getVideoData();
    writeFileSync("data/tricks.json", JSON.stringify(data, null, 4));
};

main();
