import {groupbuilding} from "./store.js"
import {createStore} from 'redux'


let dispatch;

export function setUp(callback) {
    this.store = createStore(groupbuilding);
    this.dispatch = this.store.dispatch;
    callback();
}

export function add_people(test) {
    test.expect(2);
    this.dispatch({type: "add people", people: [{id: 0}, {id: 1}]});
    test.deepEqual(this.store.getState().unpicked, [{id: 0}, {id: 1}]);
    this.dispatch({type: "add people", people: [{id: 0}, {id: 1}]});
    test.deepEqual(this.store.getState().unpicked, [{id: 0}, {id: 1}]);
    test.done();
};
