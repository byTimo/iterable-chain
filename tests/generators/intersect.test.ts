import {
    buildTest,
    simpleArray,
    complexArray,
    objectStringifier,
    simpleMap,
    keyStringifier,
    simpleSet,
    simpleObject
} from "../common";

buildTest("intersect")
    .case("simple", simpleArray, [2, 3], [2, 3, 4])
    .case("objects without stringifier", complexArray, [], [{ "a": 20 }])
    .case("objects with stringifier", complexArray, complexArray.slice(1, 3), complexArray.slice(1), objectStringifier)
    .case("map", simpleMap, [["a", 1]], [["a", 1], ["c", 3]], keyStringifier)
    .case("set", simpleSet, [2, 3], [2, 3, 4])
    .object("object", simpleObject, [["c", 3]], [["c", 3], ["d", 4]], keyStringifier);
