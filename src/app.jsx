import React from "react"
import ReactDOM from "react-dom"
import {people_list, values} from "./dataparsing.js"
import {store} from "./store.js"
var RadarChart = require("react-chartjs").Radar;

let dispatch = store.dispatch;


function colormap(k) {
    const i = values.indexOf(k);
    return `hsl(${i * 360 / 9.}, 100%, 50%)`
}

function GuyStack({data}) {
    const style = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        marginTop: data.hover ? -10 : 0
    }
    return (
        <div draggable="true" onDragStart={dispatch({type: "drag person", person: data})} onMouseOver={dispatch({type: "select person", id: data.id})} onMouseOut={dispatch({type: "deselect person"})} style={style}>
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
    );
}

const row = {
    display: "flex",
    flexDirection: "row"
}

function Bunch({people}) {
    let numberofmain = {};
    values.forEach((valuename) => {
        numberofmain[valuename] = 0;
    });
    people.forEach((person) => {
        numberofmain[person.bestat]++;
    });
    return (
        <div onDragOver={(e) => ononone.preventDefault()} className="column" style={row}>
            <div className="column column-10" style={{fontSize: 40, display: "flex", justifyContent: "center", flexDirection: "column"}}>
                {people.length}
            </div>
            <div className="column column-60" style={row}>
                {people.length == 0 ? "Empty G;roup. Drag people (colored sticks) here." : people.sort((a, b) => 10000 * (b.level - a.level) + (b.id - a.id)).map((person) => <GuyStack key={person.id} data={person}/>)}
            </div>
        </div>
    );
}

function Groups({groups, unpicked}) {
    const largest_skill = Math.max(...values.map((valuename) =>
        Math.max(...groups.map((group) =>
            group.reduce((b, person) =>
                b + person.values[valuename],
                0)))));
    return (
        <div>
            <h2>Unpicked</h2>
            <div className="row">
                <Bunch people={unpicked} onDrop={(e) => {e.preventDefault(e); dispatch("drop person", {on: "unpicked"})}} />
                </div>
            <h2>Groups</h2>
            {groups.length == 0 ? "No groups yet. Press ADD GROUP." : groups.map((group, i) => <div key={i} className="row" style={{marginBottom: 10}}>
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
                <Bunch className="column" people={group} onDrop={dispatch({type: "drop person", on: i})} />
                <div className="column column-20">
                    <button onClick={dispatch({type: "remove group", id: i})}>Remove Group</button>
                </div>
            </div>)}
            <button onClick={dispatch("add_group")}>Add Group</button>
        </div>
    );
};
 
function App({data}) {
    return (<div>
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
        <Groups groups={data.groups} unpicked={data.unpicked} />
    </div>);
}

dispatch({type: "load localstorage"});
dispatch({type: "add people", people: people_list});

function update() {
    ReactDOM.render(<App data={store.getState()} />, document.querySelector(".container"));
}
store.subscribe(update);
update();
