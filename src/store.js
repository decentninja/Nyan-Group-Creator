import {createStore} from 'redux'


const default_state = {
    everyone: [],
    groups: [[]],
    unpicked: [],
    dragging: false
};

export function groupbuilding(state=default_state, action) {
    console.log(action);
    switch(action.type) {
    case "add people":
        const not_already_added = action.people.filter((person) => state.everyone.filter((other) => other.id == person.id).length == 0);
        return {
            unpicked: state.unpicked.concat(not_already_added),
            groups: state.groups,
            everyone: state.everyone.concat(not_already_added)
        }
    case "load from localstorage":
        let b = JSON.parse(localStorage.getItem("storage"));
        if(b)
            return b;
        else
            return state
    case "save to localstorage":
        localStorage.setItem("storage", JSON.stringify({
            unpicked: state.unpicked,
            groups: state.groups,
            everyone: state.everyone
        }));
    case "add group":
        return Object.assign({}, state, {groups: state.groups.concat([[]])});
    case "remove group":
        let removed = state.groups.filter((_, i) => i == action.id);
        let groups = state.groups.filter((_, i) => i != action.id)
        return Object.assign({}, state, {groups: groups, unpicked: state.unpicked.concat(removed[0])});
    case "drag person":
        return Object.assign({}, state, {dragging: action.person});
    case "drop person":
        let notthatguy = (person) => person.id != state.dragging.id;
        let groups2 = state.groups.map((group) => group.filter(notthatguy));
        let unpicked = state.unpicked.filter(notthatguy);
        let newstate = Object.assign({}, state, {groups: groups2, unpicked});
        if(action.on == "unpicked")
            newstate.unpicked.push(state.dragging);
        else
            newstate.groups[action.on].push(state.dragging)
        return newstate;
    case "select person":
        const hoverate = (person) => Object.assign({}, person, {hover: action.person.id == person.id ? true : undefined});
        return Object.assign({}, state, {
            groups: state.groups.map((group) => group.map(hoverate)),
            unpicked: state.unpicked.map(hoverate)
        });
    case "deselect person":
        const dehover = (person) => Object.assign({}, person, {hover: undefined});
        return Object.assign({}, state, {
            groups: state.groups.map((group) => group.map(dehover)),
            unpicked: state.unpicked.map(dehover)
        });
    default:
        return state;
    }
}

export const store = createStore(groupbuilding);
