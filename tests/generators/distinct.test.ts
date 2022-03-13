import { buildTest, objectStringifier, valueStringifier } from "../common";

buildTest("distinct")
    .case("primitive", [1, 1, 2, 3, 4, 4, 10], [1, 2, 3, 4, 10])
    .case("objects without stringifier", [{ a: 10 }, { a: 10 }], [{ a: 10 }, { a: 10 }])
    .case("objects with stringifier", [{ a: 10 }, { a: 10 }], [{ a: 10 }], objectStringifier)
    .case("map", new Map([["a", 2], ["b", 2]]), [["a", 2]], valueStringifier)
    .case("set", new Set([{ a: 10 }, { a: 10 }]), [{ a: 10 }], objectStringifier)
    .object("object", { a: 20, b: 20 }, [["a", 20]], valueStringifier);
