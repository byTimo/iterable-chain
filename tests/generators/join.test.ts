import { buildTest, simpleArray, simpleMap, simpleSet, simpleObject } from "../common";

const identity = <T>(x: T) => x;
const sum = (a: number, b: number) => a + b;

buildTest("join")
    .caseCallback("empty source1", [], [], join => join(simpleArray, identity, identity, sum))
    .caseCallback("empty source2", simpleArray, [], join => join([] as number[], identity, identity, sum))
    .caseCallback("sources not relevant", simpleArray, [], join => join([4, 5, 6], identity, identity, sum))
    .caseCallback("relevant", simpleArray, [2, 4, 6], join => join(simpleArray, identity, identity, sum))
    .caseCallback(
        "sources with duplicated keys",
        [1, 1, 1],
        [3, 3, 3, 3, 3, 3, 3, 3, 3],
        join => join([2, 2, 2], () => "key", () => "key", sum)
    )
    .caseCallback(
        "map",
        simpleMap,
        [["a", 2], ["b", 4]],
        join => join(simpleMap, ([key]) => key, ([key]) => key, ([key, value], [, value2]) => [key, value + value2])
    )
    .caseCallback("set", simpleSet, [2, 4, 6], join => join(simpleSet, identity, identity, sum))
    .objectCallback(
        "object",
        simpleObject,
        [2, 4, 6],
        join => join(simpleArray, ([, value]) => value, identity, ([, value], x) => value + x)
    );
