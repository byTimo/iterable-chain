import { buildTest, simpleArray } from "../common";

buildTest("min")
    .case("empty", [], Number.POSITIVE_INFINITY)
    .case("array", simpleArray, 1);

buildTest("max")
    .case("empty", [], Number.NEGATIVE_INFINITY)
    .case("array", simpleArray, 3);

buildTest("sum")
    .case("empty", [], 0)
    .case("array", simpleArray, 6);
