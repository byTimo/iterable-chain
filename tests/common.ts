import { IterableChain } from "../src/iterableChain";
import { IterableObject, isIterable, KeyValue, Keyable, isIterableChain } from "../src/common";
import { chain } from "../src";

export const simpleArray = [1, 2, 3];
export const complexArray: Array<{ a: number }> = [{ a: 10 }, { a: 20 }, { a: 30 }];
export const simpleMap = new Map([["a", 1], ["b", 2]]);
export const simpleSet = new Set(simpleArray);
export const simpleObject = { a: 1, b: 2, c: 3 };

export const objectStringifier = (item: { a: number }) => item.a.toString();
export const keyStringifier = <T extends Array<Keyable>>([key]: T): string => key.toString();
export const valueStringifier = <T extends Array<Keyable>>([, value]: T): string => value.toString();

type Method = keyof IterableChain<any> & string;
type Args<TMethod extends Method, TData> = IterableChain<TData>[TMethod] extends (...args: infer TArgs) => infer _ ? TArgs : never;

export function buildTest<TMethod extends Method>(method: TMethod) {
    return {
        case: function <TData>(
            name: string,
            source: Iterable<TData>,
            expected: any,
            ...args: Args<TMethod, TData>
        ) {
            return this.caseCallback<TData>(
                name,
                source,
                expected,
                func => (func as Function).apply(null, args),
            );
        },
        caseCallback: function <TData>(
            name: string,
            source: Iterable<TData>,
            expected: any,
            callback: (method: IterableChain<TData>[TMethod]) => any,
        ) {
            describe(method, () => {
                if (method in chain && isIterable(source)) {
                    it(`static: ${name}`, () => {
                        const func: Function = (chain as any)[method];
                        const lol = (...args: unknown[]) => func.apply(null, [source, ...args]) as any;
                        let actual = callback(lol as IterableChain<TData>[TMethod]);
                        actual = typeof actual === "object" && isIterableChain(actual) ? actual.toArray() : actual;
                        expect(actual).toEqual(expected);
                    });
                }
                it(`chain: ${name}`, () => {
                    const func = (chain as any)(source)[method];
                    let actual = callback(func);
                    actual = typeof actual === "object" && isIterableChain(actual) ? actual.toArray() : actual;
                    expect(actual).toEqual(expected);
                });
            });
            return this;
        },
        objectCallback: function <TValue>(
            name: string,
            source: IterableObject<TValue>,
            expected: any,
            callback: (method: IterableChain<KeyValue<Keyable, TValue>>[TMethod]) => any,
        ) {
            const iterable = chain(source);
            return this.caseCallback(name, iterable, expected, callback);
        },
        object: function <TValue>(
            name: string,
            source: IterableObject<TValue>,
            expected: any,
            ...args: Args<TMethod, KeyValue<Keyable, TValue>>
        ) {
            return this.objectCallback(name, source, expected, func => (func as Function).apply(null, args));
        },
    };
}
