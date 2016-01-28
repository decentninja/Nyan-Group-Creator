import React from "react"
import ReactDOM from "react-dom"
import {data, values} from "./dataparsing.js"
var RadarChart = require("react-chartjs").Radar;


function colormap(k) {
    const i = values.indexOf(k);
    return `hsl(${i * 360 / 9.}, 100%, 50%)`
}


const sep = (what) => <span style={{marginRight: 5}}>{what}</span>

class GuyStack extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false
        }
    }
    over() {
        this.setState({hover: true});
    }
    out() {
        this.setState({hover: false});
    }
    dragStart(event) {
        event.dataTransfer.setData("text", JSON.stringify(this.props.data));
    }
    render() {
        let data = this.props.data;
        const style = {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginTop: this.state.hover ? -10 : 0
        }
        return (
            <div draggable="true" onDragStart={this.dragStart.bind(this)} onMouseOver={this.over.bind(this)} onMouseOut={this.out.bind(this)} style={style}>
                <span style={{backgroundColor: colormap(data.bestat), margin: 1.5, width: 7, height: 7, borderRadius: 5}}></span>
                {Object.keys(data.values).map((k, i) => {
                    const style = {
                        height: 1.5 * data.values[k],
                        width: "10px",
                        backgroundColor: colormap(k),
                    }
                    return <div key={i} style={style}></div>
                })}
                <span style={{fontSize: 8, textAlign: "center"}}>{data.id}</span>
            </div>
        )
    }
}

const row = {
    display: "flex",
    flexDirection: "row"
}

// Group or other collection of people
function Bunch({people, onDrop}) {
    let numberofmain = {};
    values.forEach((valuename) => {
        numberofmain[valuename] = 0;
    });
    people.forEach((person) => {
        numberofmain[person.bestat]++;
    });
    return (
        <div onDrop={(e) => onDrop(e)} onDragOver={(e) => e.preventDefault()} className="column" style={row}>
            <div className="column column-10" style={{fontSize: 40, display: "flex", justifyContent: "center", flexDirection: "column"}}>
                {people.length}
            </div>
            <div className="column column-60" style={row}>
                {people.length == 0 ? "Empty Group. Drag people (colored sticks) here." : people.sort((a, b) => 10000 * (b.level - a.level) + (b.id - a.id)).map((person) => <GuyStack key={person.id} data={person}/>)}
            </div>
        </div>
    );
}

class Groups extends React.Component {
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
    render() {
        const largest_skill = Math.max(...values.map((valuename) =>
            Math.max(...this.state.groups.map((group) =>
                group.reduce((b, person) =>
                    b + person.values[valuename],
                    0)))));
        return (
            <div>
                <h2>Unpicked</h2>
                <div className="row">
                    <Bunch people={this.state.unpicked} onDrop={(e) => this.move(e, 'unpicked')} />
                    </div>
                <h2>Groups</h2>
                {this.state.groups.length == 0 ? "No groups yet. Press ADD GROUP." : this.state.groups.map((group, i) => <div key={i} className="row" style={{marginBottom: 10}}>
                        <div className="column column-20">
                            <RadarChart redraw data={{
                                labels: values,
                                datasets: [{
                                    label: "test",
                                    pointColor: "rgba(220, 220, 220, 0)",
                                    pointStrokeColor: "rgba(220, 220, 0, 0)",
                                    data: values.map((valuename) => group.reduce((b, person) => person.values[valuename] + b, 0))
                                }]
                            }} options={{
                                scaleOverride: true,
                                scaleSteps: 1,
                                scaleStepWidth: largest_skill,
                                scaleStartValue: 0,
                                responsive: true,
                                animation: false,
                            }}/>
                        </div>
                        <Bunch className="column" people={group} onDrop={(e) => this.move(e, i)} />
                        <div className="column column-10">
                            <button onClick={() => this.remove_group(i)}>Remove</button>
                        </div>
                    </div>)}
                <button onClick={this.add_group.bind(this)}>Add Group</button>
            </div>
        );
    }
}


class App extends React.Component {
    render() {
        return (
            <div>
                <h1>Group Creator</h1>
                <div className="row">
                    <div className="column">
                        <p>
                            Group Creator is a visual and interactive tool for creating groups from quantitative data. Drag and drop member, represented as colored sticks into groups and see the update realtime. You can at any moment undo you actions with ctrl/cmd-z. All data is saved in your browser (local storage).
                        </p>
                    </div>
                    <table className="column column-60">
                        <tbody style={{fontSize: "80%"}}>
                            <tr>
                                {values.map((valuename) => 
                                    <td key={valuename} style={{padding: 3, backgroundColor: colormap(valuename)}}></td>
                                )}
                            </tr>
                            <tr>
                                {values.map((valuename) => 
                                    <td key={valuename} style={{padding: 3}}>{valuename}</td>
                                )}
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Groups defaultdata={data} />
            </div>
        )
    }
}

ReactDOM.render(<App />, document.querySelector(".container"))
