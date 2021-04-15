const sanitizeName = (name = "") =>
    name.replace("\n", "").replace("[edit]", "");

const descriptionSiblingParser = (item) => {
    const MAX_TRIES = 5;
    const trickName = sanitizeName(item?.text);
    let descriptionElement = item.nextElementSibling;
    let trickDescription = "";
    for (let i = 0; i < MAX_TRIES; i++) {
        if (descriptionElement.tagName === "P") {
            trickDescription = descriptionElement?.text;
            break;
        }
        descriptionElement = descriptionElement.nextElementSibling;
    }
    return { trickName, trickDescription };
};

const descriptionListParser = (item) => {
    const trickName = sanitizeName(item.querySelector("dt")?.text);
    const trickDescription = item.querySelector("dd")?.text;
    return { trickName, trickDescription };
};

export default [
    {
        category: "Aerial",
        url: "https://en.wikipedia.org/wiki/Aerial_(skateboarding)",
        trickSelector: "table.wikitable tr",
        trickParser: (item) => {
            const trickName = sanitizeName(
                item.querySelector("td:nth-child(1)")?.text
            );
            const trickDescription = item.querySelector("td:nth-child(2)")
                ?.text;
            return { trickName, trickDescription };
        },
    },
    {
        category: "Ollie",
        url: "https://en.wikipedia.org/wiki/Ollie_(skateboarding)",
        trickSelector:
            "#mw-content-text .mw-parser-output > ul:nth-of-type(2) li",
        trickParser: (item) => {
            const parsedText = item?.text.split(": ");
            const trickName = sanitizeName(parsedText.shift());
            const trickDescription = parsedText.join(": ").trim();
            return { trickName, trickDescription };
        },
    },
    {
        category: "Flip",
        url: "https://en.wikipedia.org/wiki/Flip_trick",
        trickSelector:
            "#mw-content-text .mw-parser-output > h2:nth-of-type(2) ~ h3",
        trickParser: descriptionSiblingParser,
    },
    {
        category: "Freestyle",
        url: "https://en.wikipedia.org/wiki/Freestyle_skateboarding_tricks",
        trickSelector:
            "#mw-content-text .mw-parser-output > h2:nth-of-type(2) ~ h3",
        trickParser: descriptionSiblingParser,
    },
    {
        category: "Slide",
        url: "https://en.wikipedia.org/wiki/Slide_(skateboarding)",
        trickSelector:
            "#mw-content-text .mw-parser-output > h2:nth-of-type(2) ~ dl",
        trickParser: descriptionListParser,
    },
    {
        category: "Grind",
        url: "https://en.wikipedia.org/wiki/Grind_(skateboarding)",
        trickSelector:
            "#mw-content-text .mw-parser-output > h2:nth-of-type(2) ~ dl",
        trickParser: descriptionListParser,
    },
];
