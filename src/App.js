import React, { Component } from "react";
import Score from "./score";


class App extends Component {
  state = {
  };


  render() {
    return (
      <div className="main__wrap">
        <main className="container">
          <div>
            <Score />
          </div>
        </main>
      </div>
    );
  }
}

export default App;
