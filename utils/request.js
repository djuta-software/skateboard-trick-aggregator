import fetch from "node-fetch";

export const getText = async (url, options = {}) => {
    const res = await fetch(url, options);
    return res.text();
};
