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
        <div draggable="true" onDragStart={() => dispatch({type: "drag person", person: data})} onMouseOver={() => dispatch({type: "select person", person: data})} onMouseOut={() => dispatch({type: "deselect person"})} style={style}>
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
        <div  className="column" style={row}>
            <div className="column column-10" style={{fontSize: 40, display: "flex", justifyContent: "center", flexDirection: "column"}}>
                {people.length}
            </div>
            <div className="column column-60" style={row}>
                {people.length == 0 ? "Empty Group. Drag people (colored sticks) here." : people.sort((a, b) => 10000 * (b.level - a.level) + (b.id - a.id)).map((person) => <GuyStack key={person.id} data={person}/>)}
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
            <h2>Roster</h2>
            <div className="row" onDragOver={(e) => e.preventDefault()} onDrop={() => dispatch({type: "drop person", on: "unpicked"})}>
                <Bunch people={unpicked}/>
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
                <div className="column" onDragOver={(e) => e.preventDefault()} onDrop={() => dispatch({type: "drop person", on: i})}>
                    <Bunch people={group} />
                </div>
                <div className="column column-20">
                    <button onClick={() => dispatch({type: "remove group", id: i})}>Remove Group</button>
                </div>
            </div>)}
            <button onClick={() => dispatch({type: "add group"})}>Add Group</button>
        </div>
    );
};
 
function App({data}) {
    return (<div>
        <h1>Nyan Group Creator<span style={{fontSize: "30%", marginLeft: 10}}>By Andreas Linn</span></h1>
        <div className="row">
            <div className="column">
                <p>
                    Nyan Group Creator is a visual and interactive tool for creating groups from quantitative data created as an assignment for the course DH2321 at KTH. Drag and drop members, represented as colored sticks into groups. The ID at bottom of each stack are from the raw input data and are used when comparing results from different tools. All data is saved in your browser, even when you close the tab (localstorage). This application is only known to work in the latest release of Chrome. No there are currently no way to input you own data aside from hacks (localstorage?). The application will be open sourced on <a href="http://github.com/decentninja/nyan-group-creator">github.com/decentninja/nyan-group/creator</a> as soon as the deadline for the assignment has passed.
                </p>
            </div>
            <div className="column column-50">
                <table>
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
                <p>
                    The focus of the visualization is to showcase group balance and difference in total skill. This allows you to create groups where as many students as possible have someone to learn from, someone to teach and feel like they are on the same total skill level so that they are not dragged down by anyone. 
                </p>
                <p>
                    Happy Nyan-Grouping! (Maybe not the best catchphrase, I have to work on that one.)
                </p>
            </div>
        </div>
        <Groups groups={data.groups} unpicked={data.unpicked} />
    </div>);
}

dispatch({type: "load from localstorage"});
dispatch({type: "add people", people: people_list});

function update() {
    ReactDOM.render(<App data={store.getState()} />, document.querySelector(".container"));
}
store.subscribe(update);
update();
