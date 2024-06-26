import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean,
  interval: NodeJS.Timeout,
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph: false,
      interval: {} as NodeJS.Timeout,
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    if (this.state.showGraph)
      return (<Graph data={this.state.data}/>)
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
      clearInterval(this.state.interval)
      this.setState({ data: [], showGraph: true });
      let interval = setInterval(() => {
            DataStreamer.getData((serverResponds: ServerRespond[]) => {
                if (serverResponds.length === 0)
                    clearInterval(interval);
                this.setState({ data: [...this.state.data, ...serverResponds] });
            });
      }, 100);
      this.setState({ interval });
  }

  /**
   * Render the App react component
   */
  render() {



    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {this.getDataFromServer()}}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
