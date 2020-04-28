import { chain } from "../../src";

describe("repeat", () => {
    it("repeat number", () => {
        const actual = chain.repeat(10, 5).toArray();
        expect(actual).toEqual([10, 10, 10, 10, 10]);
    });
    it("repeat object", () => {
        const obj = { a: 10 };
        const actual = chain.repeat(obj, 3).toArray();
        expect(actual).toEqual([obj, obj, obj]);
        expect(actual[0]).toBe(obj);
        expect(actual[1]).toBe(obj);
        expect(actual[2]).toBe(obj);
    });
})