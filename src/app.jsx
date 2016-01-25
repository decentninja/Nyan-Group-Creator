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
    render() {
        let data = this.props.data;
        const style = {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
        }
        return (
            <div onMouseOver={this.over.bind(this)} onMouseOut={this.out.bind(this)} style={style}>
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
                {this.state.hover ? <div style={{
                                                    position: "absolute",
                                                    fontSize: "75%",
                                                }}>
                    {sep("L" + data.level)}
                    {sep(data.bestat)}
                    {sep(data.degree)}
                    {sep(data.description)}
                    {sep(data.expections)}
                </div> : ""}
            </div>
        )
    }
}


// Group or other collection of people
function Bunch({selection}) {
    let numberofmain = {};
    values.forEach((valuename) => {
        numberofmain[valuename] = 0;
    });
    selection.forEach((person) => {
        numberofmain[person.bestat]++;
    });
    return (
        <div className="row" style={{display: "flex", direction: "row", alignItems: "center"}}>
            <div className="column">
                <RadarChart data={{
                    labels: values,
                    datasets: [{
                        label: "test",
                        pointColor: "rgba(220, 220, 220, 0)",
                        pointStrokeColor: "rgba(220, 220, 0, 0)",
                        data: values.map((valuename) => selection.reduce((b, person) => person.values[valuename] + b, 0))
                    }]
                }} options={{
                    scaleOverride: true,
                    scaleSteps: 100,
                    scaleStepWidth: 5,
                    scaleStartValue: 0,
                    responsive: true,
                    animation: false,
                }}/>
            </div>
            <div className="column column-75" style={{
                display: "flex",
                flexDirection: "row"
            }}>
                {selection.map((person) => <GuyStack key={person.id} data={person}/>)}
            </div>
        </div>
    );
}

class App extends React.Component {
    render() {
        return (
            <div>
                <h1>Group Creator</h1>
                <div className="row">
                    <div className="column">
                        <p>
                            Group Creator is a visual and interactive tool for creating groups from quantitative data. Drag and drop member, represented as lines into groups and see the update realtime. You can at any moment undo you actions with ctrl/cmd-z. All data is saved in your browser (local storage).
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
                <h2>Everyone</h2>
                <Bunch selection={data.sort((a, b) => b.level - a.level)} />
            </div>
        )
    }
}

ReactDOM.render(<App />, document.querySelector(".container"))
