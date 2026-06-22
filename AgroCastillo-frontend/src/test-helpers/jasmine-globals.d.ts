declare function describe(description: string, spec: () => void): void;
declare function xdescribe(description: string, spec: () => void): void;
declare function it(description: string, spec: () => void): void;
declare function xit(description: string, spec: () => void): void;
declare function beforeEach(fn: () => void | Promise<void>): void;
declare function afterEach(fn: () => void | Promise<void>): void;
declare function expect(actual: any): any;
