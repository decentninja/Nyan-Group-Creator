import {groupbuilding} from "./store.js"
import {createStore} from 'redux'



export function setUp(callback) {
    this.store = createStore(groupbuilding);
    this.dispatch = this.store.dispatch;
    callback();
}

export function add_people(test) {
    this.dispatch({type: "add people", people: [{id: 0}, {id: 1}]});
    test.deepEqual(this.store.getState().unpicked, [{id: 0}, {id: 1}]);
    this.dispatch({type: "add people", people: [{id: 0}, {id: 1}]});
    test.deepEqual(this.store.getState().unpicked, [{id: 0}, {id: 1}]);
    test.done();
};

export function add_group(test) {
    this.dispatch({type: "add group"});
    test.deepEqual(this.store.getState().groups, [[], []]);
    test.done();
};

export function remove_group(test) {
    let store = createStore(groupbuilding, Object.assign({}, this.store.getState(), {groups: [[{id: 0}, {id: 1}]]}));
    store.dispatch({type: "remove group", id: 0});
    test.deepEqual(store.getState().unpicked, [{id: 0}, {id: 1}]);
    test.deepEqual(store.getState().groups, []);
    test.done();
};

export function drag_person(test) {
    this.dispatch({type: "drag person", person: {id: 0}});
    test.deepEqual(this.store.getState().dragging, {id: 0});
    test.done();
}

export function drop_on_same_group(test) {
    let store = createStore(groupbuilding, Object.assign({}, this.store.getState(), {groups: [[{id: 0}, {id: 1}]], dragging: {id: 0}}));
    store.dispatch({type: "drop person", on: 0});
    test.deepEqual(store.getState().groups, [[{id: 1}, {id: 0}]]);
    test.done();
};

export function drop_on_another_group(test) {
    let store = createStore(groupbuilding, Object.assign({}, this.store.getState(), {groups: [[{id: 0}, {id: 1}], []], dragging: {id: 0}}));
    store.dispatch({type: "drop person", on: 1});
    test.deepEqual(store.getState().groups, [[{id: 1}], [{id: 0}]]);
    test.done();
};

export function drop_on_unpicked(test) {
    let store = createStore(groupbuilding, Object.assign({}, this.store.getState(), {groups: [[{id: 0}, {id: 1}]], dragging: {id: 0}}));
    store.dispatch({type: "drop person", on: "unpicked"});
    test.deepEqual(store.getState().unpicked, [{id: 0}]);
    test.deepEqual(store.getState().groups, [[{id: 1}]]);
    test.done();
};

export function from_unpicked_to_self(test) {
    let store = createStore(groupbuilding, Object.assign({}, this.store.getState(), {unpicked: [[{id: 0}, {id: 1}]], dragging: {id: 0}}));
    store.dispatch({type: "drop person", on: 0});
    test.deepEqual(store.getState().unpicked, [[{id: 0}, {id: 1}]]);
    test.done();
};

export function from_unpicked_to_group(test) {
    let store = createStore(groupbuilding, Object.assign({}, this.store.getState(), {unpicked: [{id: 0}], dragging: {id: 0}}));
    store.dispatch({type: "drop person", on: 0});
    test.deepEqual(store.getState().groups, [[{id: 0}]], "groups");
    test.deepEqual(store.getState().unpicked, [], "unpicked");
    test.done();
};

export function select_n_deselect_by_hover(test) {
    let store = createStore(groupbuilding, Object.assign({}, this.store.getState(), {unpicked: [{id: 0}], dragging: {id: 0}}));
    store.dispatch({type: "select person", person: {id: 0}});
    test.deepEqual(store.getState().unpicked[0], {id: 0, hover: true});
    test.done();
};
