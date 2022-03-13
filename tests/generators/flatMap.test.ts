import { buildTest, simpleArray, complexArray, simpleMap, simpleSet, simpleObject } from "../common";

buildTest("flatMap")
    .case("simple", simpleArray, simpleArray, x => [x])
    .case("objects", complexArray, ["a", 10, "a", 20, "a", 30], x => ["a", x.a])
    .case("map", simpleMap, ["a", 1, "b", 2], x => x)
    .case("set", simpleSet, simpleArray, x => [x])
    .object("object", simpleObject, ["a", 1, "b", 2, "c", 3], x => x);
