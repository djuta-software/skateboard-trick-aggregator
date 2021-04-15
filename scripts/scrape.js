import { parse } from "node-html-parser";
import { writeFileSync } from "fs";
import slugify from "slugify";
import sources from "./sources.js";
import { getText } from "../utils/request.js";

const createId = (str) => slugify(str.toLowerCase());

const main = async () => {
    const tricksData = [];

    await Promise.all(
        sources.map(
            async ({
                category,
                url,
                trickSelector,
                trickNameSelector,
                trickDescriptionSelector,
                trickParser,
            }) => {
                const html = await getText(url);
                const root = parse(html);
                const tricks = root.querySelectorAll(trickSelector);

                tricks.forEach((item) => {
                    const { trickName, trickDescription } = trickParser(
                        item,
                        trickNameSelector,
                        trickDescriptionSelector
                    );
                    if (!trickName || !trickDescription) {
                        return;
                    }
                    tricksData.push({
                        id: createId(`${category}-${trickName}`),
                        categoryId: createId(category),
                        category,
                        trickName,
                        trickDescription,
                    });
                });
            }
        )
    );
    writeFileSync("data/tricks.json", JSON.stringify(tricksData, null, 4));
};

main();
