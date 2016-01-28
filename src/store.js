import {createStore} from 'redux'


const default_state = {
    everyone: [],
    groups: [[]],
    unpicked: []
};

export function groupbuilding(state=default_state, action) {
    switch(action.type) {
    case "add people":
        const not_already_added = action.people.filter((person) => state.everyone.filter((other) => other.id == person.id).length == 0);
        console.log(not_already_added);
        return {
            unpicked: state.unpicked.concat(not_already_added),
            group: state.group,
            everyone: state.everyone.concat(not_already_added)
        }
    default:
        return state;
    }
}

let b = `
    constructor(props) {
        super(props);
        this.state = JSON.parse(localStorage.getItem("storage")) || {
            groups: [[]],
            unpicked: props.defaultdata
        }
    }
    save(data) {
        this.setState(data, () => {
            localStorage.setItem("storage", JSON.stringify(this.state));
        });
    }
    add_group() {
        this.save({
            groups: this.state.groups.concat([[]])
        });
    }
    remove_group(i) {
        let removed = this.state.groups[i];
        this.save({
            groups: this.state.groups.slice(0, i).concat(this.state.groups.slice(i+1)),
            unpicked: this.state.unpicked.concat(removed)
        });
    }
    move(e, to) {
        e.preventDefault(); // Is this needed?
        let data;
        try {
            data = JSON.parse(e.dataTransfer.getData('text'));
        } catch (e) {
            console.error(e);
            return;
        }
        let notthatguy = (person) => person.id != data.id;
        let groups = this.state.groups.map((group) => group.filter(notthatguy));
        let unpicked = this.state.unpicked.filter(notthatguy);
        if(to == "unpicked") { 
            unpicked.push(data);
        } else {
            groups[to].push(data);
        }
        this.save({
            groups,
            unpicked
        });
    }
`
export const store = createStore(groupbuilding);
