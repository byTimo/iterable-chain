import { buildTest, simpleArray, simpleMap, simpleSet, simpleObject } from "../common";

buildTest("reverse")
    .case("simple", simpleArray, [3, 2 ,1])
    .case("map", simpleMap, [["b", 2], ["a", 1]])
    .case("set", simpleSet, [3, 2, 1])
    .object("object", simpleObject, [["c", 3], ["b", 2], ["a", 1]]);
