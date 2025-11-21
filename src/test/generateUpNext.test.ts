import { describe, expectTypeOf, it } from "vitest";
import { generateUpNext } from "../generateUpNext";
import type { BlockDef } from "../blockControl";


describe("generateUpNext", () => {
    it("returns an object of type BlockDef", () => {
        const newBlock = generateUpNext();

        expectTypeOf(newBlock).toMatchObjectType<BlockDef>();
    });
});