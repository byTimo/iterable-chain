import {
    buildTest,
    simpleArray,
    complexArray,
    keyStringifier,
    objectStringifier,
    simpleMap,
    simpleSet,
    simpleObject
} from "../common";

buildTest("union")
    .case("simple", simpleArray, [...simpleArray, 4], [...simpleArray, 4])
    .case(
        "objects without stringifier",
        complexArray,
        [...complexArray, ...complexArray],
        [{ a: 10 }, { a: 20 }, { a: 30 }]
    )
    .case("objects with stringifier", complexArray, [...complexArray], complexArray, objectStringifier)
    .case("map", simpleMap, [["a", 1], ["b", 2], ["c", 3]], [["a", 1], ["c", 3]], keyStringifier)
    .case("set", simpleSet, [...simpleArray, 4], [...simpleArray, 4])
    .object("object", simpleObject, [["a", 1], ["b", 2], ["c", 3], ["d", 4]], [["c", 3], ["d", 4]], keyStringifier);
