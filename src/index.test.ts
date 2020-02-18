import { chain } from "."

function typeGuard(a: number | string): a is number {
    return typeof a === "number";
}

describe("chain", () => {
    describe("chain global", () => {
        //TODO (byTimo) Set, Map, Record
        it("map", () => {
            const actual = chain.map([1, 2, 3, 4], x => x + 50).toArray();
            expect(actual).toEqual([51, 52, 53, 54]);
        });
        describe("filter", () => {
            it("array - condition return boolean", () => {
                const actual = chain.filter([1, 2, 3, 4], x => x % 2 == 0).toArray()
                expect(actual).toEqual([2, 4])
            })
            it("array - type guard", () => {
                const actual = chain.filter([1, "2", 3, "4"], typeGuard).toArray();
                const first: number = actual[0] //type check
                expect(actual).toEqual([1, 3]);
            })
        })
    })
    describe("chain", () => {
        it("1", () => {
            const actual = chain([1, 2, 3, 4]).map(x => x + 50).toArray();
            expect(actual).toEqual([51, 52, 53, 54])
        });
        it("2", () => {
            const actual = chain(["1", "2"]).map(x => parseInt(x)).toArray();
            expect(actual).toEqual([1, 2]);
        })
    })
})