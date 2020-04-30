import { chain } from "../../src";

describe("append, prepend, concat", () => {
    it("append", () => {
        const actual = chain.append([1, 2, 3, 4, 5], 15).toArray();
        expect(actual).toEqual([15, 1, 2, 3, 4, 5]);
    });
    it("prepend", () => {
        const actual = chain.prepend([1, 2, 3, 4, 5], 15).toArray();
        expect(actual).toEqual([1, 2, 3, 4, 5, 15]);
    });
    it("concat same type", () => {
        const actual = chain.concat([1, 2, 3], [4, 5, 6]).toArray();
        expect(actual).toEqual([1, 2, 3, 4, 5, 6]);
    });
    it("concat different types", () => {
        const actual = chain.concat([1, 2, 3], ["4", "5", "6"]).toArray();
        expect(actual).toEqual([1, 2, 3, "4", "5", "6"]);
    });
})