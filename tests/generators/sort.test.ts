import { buildTest, simpleMap, simpleSet, simpleObject } from "../common";

buildTest("sort")
    .caseCallback("empty", [], [], sort => sort())
    .caseCallback("primitives without comparer", [20, 10, 1, 2, 3], [1, 10, 2, 20, 3], sort => sort())
    .caseCallback("primitives with comparer", [20, 10, 1, 2, 3], [1, 2, 3, 10, 20], sort => sort((a, b) => a - b))
    .caseCallback("map", simpleMap, [["b", 2], ["a", 1]], sort => sort(([, value1], [, value2]) => value2 - value1))
    .caseCallback("set", simpleSet, [3, 2, 1], sort => sort((a, b) => b - a))
    .objectCallback(
        "object",
        simpleObject,
        [["c", 3], ["b", 2], ["a", 1]],
        sort => sort(([, value1], [, value2]) => value2 - value1)
    );
