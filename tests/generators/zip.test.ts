import { buildTest, simpleArray, simpleMap, simpleSet, simpleObject } from "../common";

buildTest("zip")
    .case("empty", [], [], [])
    .case("empty source", [], [], simpleArray)
    .case("empty other", simpleArray, [], [])
    .case("two same length array", simpleArray, [[1, 1], [2, 2], [3, 3]], simpleArray)
    .case("two same length array with selector", simpleArray, [2, 4, 6], simpleArray, (a, b: any) => a + b)
    .case(
        "two same length array with selector to another type",
        simpleArray,
        ["11", "22", "33"],
        simpleArray,
        (a, b: any) => "" + a + b
    )
    .case("arrays with unequal length", simpleArray, [[1, 2], [2, 3]], simpleArray.slice(1))
    .case("maps", simpleMap, [[["a", 1], ["a", 1]], [["b", 2], ["b", 2]]], simpleMap)
    .case("set", simpleSet, [[1, 1], [2, 2], [3, 3]], simpleSet)
    .object("object", simpleObject, [[["a", 1], 1]], [1]);
