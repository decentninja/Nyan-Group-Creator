import React from "react"
import ReactDOM from "react-dom"
import {data, values} from "./dataparsing.js"
import PieChart from "react-simple-pie-chart"


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
                        height: 5 * data.values[k],
                        width: "10px",
                        backgroundColor: colormap(k),
                    }
                    return <div key={i} style={style}></div>
                })}
                <span style={{fontSize: 8}}>{data.id}</span>
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
                <PieChart slices={[{color: "blue", value: 3}]} />
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
                <div className="row">
                    <div className="column">
                        <h1>Group Creator</h1>
                    </div>
                    <table className="column">
                        <tbody>
                            {values.map((valuename) => 
                                <tr style={{fontSize: "80%"}} key={valuename}>
                                    <td style={{padding: 3, backgroundColor: colormap(valuename)}}></td>
                                    <td style={{padding: 3}} >{valuename}</td>
                                </tr>
                            )}
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
