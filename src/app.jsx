import React from "react"
import ReactDOM from "react-dom"
import {data, values} from "./dataparsing.js"


function colormap(k) {
    const i = values.indexOf(k);
    return `hsl(${i * 360 / 9.}, 100%, 50%)`
}

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
                <span style={{fontSize: 8}}>{data.level}</span>
                {Object.keys(data.values).map((k, i) => {
                    const style = {
                        height: 5 * data.values[k],
                        width: "10px",
                        backgroundColor: colormap(k),
                    }
                    return <div key={i} style={style}></div>
                })}
                {this.state.hover ? <div style={{position: "absolute", fontSize: "75%"}}>
                    #{data.id}
                    L{data.level}
                    B{data.bestat}
                    D{data.degree}
                    {data.description}
                    {data.expections}
                </div> : ""}
            </div>
        )
    }
}


function Bunch({selected, selection}) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "row"
        }}>
        {selection.map((person) => <GuyStack key={person.id} data={person}/>)}
    </div>);
}

class App extends React.Component {
    render() {
        return (
            <div>
                <h1>Group Creator</h1>
                <h2>Everyone</h2>
                <Bunch selection={data.sort((a, b) => b.level - a.level)} />
            </div>
        )
    }
}

ReactDOM.render(<App />, document.querySelector(".container"))
