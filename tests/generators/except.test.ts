import {
    buildTest,
    simpleArray,
    complexArray,
    simpleMap,
    simpleSet,
    simpleObject,
    objectStringifier,
    keyStringifier
} from "../common";

buildTest("except")
    .case("primitive", simpleArray, [1], [2, 3, 4])
    .case("same objects without stringifier", complexArray, complexArray.slice(0, 1), complexArray.slice(1))
    .case("objects without stringifier", complexArray, complexArray, [{ a: 10 }])
    .case("objects with stringifier", complexArray, [{ a: 10 }], complexArray.slice(1), objectStringifier)
    .case("map", simpleMap, [["b", 2]], [["a", 1], ["c", 1]], keyStringifier)
    .case("set", simpleSet, [1], [2, 3, 4])
    .object("object", simpleObject, [["a", 1]], [["b", 1], ["c", 1]], keyStringifier);
