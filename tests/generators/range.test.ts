import { chain } from "../../src";

describe("range", () => {
    it("start from zero", () => {
        const actual = chain.range(0, 5).toArray();
        expect(actual).toEqual([0, 1, 2, 3, 4]);
    });
    it("start from 5", () => {
        const actual = chain.range(5, 5).toArray();
        expect(actual).toEqual([5, 6, 7, 8, 9]);
    });
    it("count is zero", () => {
        const actual = chain.range(5, 0).toArray();
        expect(actual).toEqual([]);
    });
    it("count less then zero", () => {
        const actual = chain.range(5, -1).toArray();
        expect(actual).toEqual([]);
    });
})