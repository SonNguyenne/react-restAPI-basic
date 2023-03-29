import { Application, Binding, Component } from '@loopback/core';
export declare class TestComponent implements Component {
    bindings: Binding<unknown>[];
    constructor(app: Application);
}
