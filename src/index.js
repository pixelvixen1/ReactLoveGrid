import React from "react";
import ReactDOM from "react-dom";
import Grid from "./components/Grid";
import "./styles/gridstyle.css";

class GridApp extends React.Component {
  state = {
    squaresY: 8,
    squaresX: 8,
    numOfHearts: 20,
    gridSize: 8
  };

  handleGridSize = () => {
    const numOfSquaresOn = Math.floor(
      this.state.gridSize * 2 + this.state.gridSize / 2
    );
    this.setState({
      squaresY: this.state.gridSize,
      squaresX: this.state.gridSize,
      numOfHearts: numOfSquaresOn
    });
  };

  onSliderValueChanged = e => {
    this.setState({
      gridSize: e.target.valueAsNumber
    });
  };

  render() {
    const { squaresY, squaresX, gridSize, numOfHearts } = this.state;
    return (
      <div className="grid">
        <div className="grid-info">
          <h1>The Love Connection&nbsp;Grid</h1>
          <div>
            <div className="info">Number of Hearts <span role="img" aria-label="heart">❤️</span> = {numOfHearts}</div>
            <div className="info">Resize grid to : {gridSize}x{gridSize}</div>
          </div>
          <div className="slider">
            <input
              id="grid_size_input"
              type="range"
              min="5"
              max="20"
              value={gridSize}
              onChange={this.onSliderValueChanged}
              step="1"
              className="slider white"
            />
          </div>
          <button onClick={this.handleGridSize} className="small blue button">
            Resize
          </button>
        </div>

        <Grid
          squaresY={squaresY}
          squaresX={squaresX}
          numOfHearts={numOfHearts}
        />
      </div>
    );
  }
}

ReactDOM.render(<GridApp />, document.getElementById("root"));
