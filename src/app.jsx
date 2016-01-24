import React from "react"
import ReactDOM from "react-dom"
import {data, values} from "./dataparsing.js"


function colormap(k) {
    const i = values.indexOf(k);
    return `hsl(${i * 360 / 9.}, 100%, 50%)`
}

function GuyStack({data}) {
    const style = {
        display: "inline-block"
    }
    return (<div style={style}>
        {Object.keys(data.values).map((k, i) => {
            const style = {
                height: 1 * data.values[k],
                width: "10px",
                backgroundColor: colormap(k),
            }
            return <div key={i} style={style}></div>
        })}
    </div>)
}

class App extends React.Component {
    render() {
        return (
            <div>
                <h1>Hello World</h1>
                {data.map((person) => <GuyStack key={person.id} data={person}/>)}
            </div>
        )
    }
}

ReactDOM.render(<App />, document.querySelector(".container"))
