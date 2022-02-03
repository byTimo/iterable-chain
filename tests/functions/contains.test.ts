import { buildTest, simpleArray, simpleMap, simpleSet, simpleObject } from "../common";

buildTest("contains")
    .case("array", simpleArray, true, 1)
    .case("array without value", simpleArray, false, 4)
    .case("array with comparer", simpleArray, false, 1, (a, b) => a + 100 === b)
    .case("map", simpleMap, true, ["a", 1], ([keyA], [keyB]) => keyA === keyB)
    .case("set", simpleSet, true, 1)
    .object("object", simpleObject, true, ["a", 10], ([keyA], [keyB]) => keyA === keyB);
