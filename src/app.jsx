import React from "react"
import ReactDOM from "react-dom"
import {data} from "./dataparsing.js"


console.log(data);

class App extends React.Component {
    render() {
        return (<h1>Hello World</h1>)
    }
}

ReactDOM.render(<App />, document.querySelector(".container"));
