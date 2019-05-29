import React from "react";
import Cell from "./Cell";
import PropTypes from "prop-types";
import ColorPicker from "rc-color-picker";
import "rc-color-picker/assets/index.css";
import "../styles/gridstyle.css";

export default class Grid extends React.Component {
  state = {
    gridData: this.initGridData(
      this.props.squaresY,
      this.props.squaresX,
      this.props.numOfHearts
    ),
    cellBGColour: "#000000",
    cellHoverColour: "#dddddd",
    screenWidth: 0,
    screenHeight: 0
  };

  //Update screen size
  updateScreenSize = () => {
    this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight });
  };

  //Add event listener
  componentDidMount() {
    this.updateScreenSize();
    window.addEventListener("resize", this.updateScreenSize);
  }

  //Remove event listener
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateScreenSize);
  }

  //Calculate grid width and set the max width so does not break the grid on screen resize
  getGridWidth = () => {
    const gsize = this.props.squaresY;
    let ss = this.state.screenWidth - 60;
    if( ss >= 768){
      ss = 768;   
    }

    const newCellSize = parseInt(ss / gsize);
    const gridWidth = gsize * newCellSize;

    return { maxWidth: gridWidth + "px" };

  };

  // get random number given a dimension
  getRandomNumber(dimension) {
    return Math.floor(Math.random() * 1000 + 1) % dimension;
  }

  // Gets initial Grid data
  initGridData(squaresY, squaresX, numOfHearts) {
    let data = [];
    for (let i = 0; i < squaresY; i++) {
      data.push([]);
      for (let j = 0; j < squaresX; j++) {
        data[i][j] = {
          x: i,
          y: j,
          isHeart: false,
          isSelected: false,
          hoverOn: false,
          value: 0,
          neighbour: 0,
          narray: []
        };
      }
    }
    data = this.addHeartsOnGrid(data, squaresY, squaresX, numOfHearts);
    data = this.findAllGridNeighbours(data, squaresY, squaresX);
    return data;
  }

  // Add hearts or 1s on the Grid on a random position
  addHeartsOnGrid(data, squaresY, squaresX, numOfHearts) {
    let randomx,
      randomy,
      heartsAdded = 0;

    while (heartsAdded < numOfHearts) {
      randomx = this.getRandomNumber(squaresX);
      randomy = this.getRandomNumber(squaresY);
      if (!data[randomx][randomy].isHeart) {
        data[randomx][randomy].isHeart = true;
        data[randomx][randomy].value = 1;
        heartsAdded++;
      }
    }

    return data;
  }

  // get the neighbouring hearts for each Grid cell which is a 1/heart and update the state data
  findAllGridNeighbours(data, squaresY, squaresX) {
    for (let i = 0; i < squaresY; i++) {
      for (let j = 0; j < squaresX; j++) {
        this.findCellNeighbours(
          data[i][j].x,
          data[i][j].y,
          data,
          squaresX,
          squaresY
        );
      }
    }

    return this.resetCells(data, squaresY, squaresX);
  }

  getNeighbouringCells(x, y, data) {
    return this.findCellNeighbours(
      x,
      y,
      data,
      this.props.squaresX,
      this.props.squaresY
    );
  }

  //Find all the neighbours which are hearts (positive) for a cell
  findCellNeighbours(i, j, data, rows, cols) {
    let neighbourCount = 0;
    const connectedCells = [];
    const queue = [];
    queue.push([i, j]);
    while (queue.length > 0) {
      const item = queue.pop();
      const x = item[0];
      const y = item[1];
      if (data[x][y].value === 1) {
        neighbourCount++;
        data[x][y].value = -1;
        data[x][y].isSelected = true;
        connectedCells.push(data[x][y]);
        this.pushIfValid(queue, x, y - 1, data, rows, cols);
        this.pushIfValid(queue, x, y + 1, data, rows, cols);
        this.pushIfValid(queue, x - 1, y, data, rows, cols);
        this.pushIfValid(queue, x + 1, y, data, rows, cols);
      }
    }

    //reset and update cells
    connectedCells.forEach(element => {
      element.value = 1;
      element.neighbour = neighbourCount;
      element.narray = connectedCells;
    });

    return data;
  }

  //Check if valid cell
  pushIfValid(q, x, y, mtx, rows, cols) {
    if (x >= 0 && x < rows && y >= 0 && y < cols) {
      q.push([x, y]);
    }
    return q;
  }

  // Reset cells so non are selected
  resetCells(data, squaresY, squaresX) {
    let updatedData = data;

    for (let i = 0; i < squaresY; i++) {
      for (let j = 0; j < squaresX; j++) {
        updatedData[i][j].isSelected = false;
        updatedData[i][j].hoverOn = false;
      }
    }

    return updatedData;
  }

  //----- Handle User Events --------//

  //On cell mouse over - highlight connected cells
  handleCellMouseover(x, y) {

    let updatedData = this.state.gridData;

    if (updatedData[x][y].isHeart && !updatedData[x][y].isSelected) {
      const narray = updatedData[x][y].narray;
      for (let i = 0; i < narray.length; i++) {
        narray[i].hoverOn = true;
      }
    }

    this.setState({ gridData: updatedData });
  }

  handleCellMouseout(x, y) {
    let updatedData = this.state.gridData;

    if (updatedData[x][y].isHeart && !updatedData[x][y].isSelected ) {
      const narray = updatedData[x][y].narray;
      for (let i = 0; i < narray.length; i++) {
        narray[i].hoverOn = false;
      }
    }

    this.setState({gridData: updatedData });
  }

  // Handle Cell click
  handleCellClick(x, y) {
    let updatedData = this.state.gridData;

    if (this.state.gridData[x][y].isHeart) {
      updatedData = this.resetCells(
        this.state.gridData,
        this.props.squaresY,
        this.props.squaresX
      );
      updatedData = this.getNeighbouringCells(x, y, updatedData);
    }

    this.setState({ gridData: updatedData  });
  }

  //Change heart cell BG Colour
  handleCellColourChange = colors => {
    this.setState({
      cellBGColour: colors.color
    });
  };

  //Change heart cell BG Hover Colour
  handleCellHoverColourChange = colors => {
    this.setState({
      cellHoverColour: colors.color
    });
  };

  renderGrid(data) {
    return data.map(datarow => {
      return datarow.map(dataitem => {
        return (
          <div key={dataitem.x * datarow.length + dataitem.y}>
            <Cell
              onClick={() => this.handleCellClick(dataitem.x, dataitem.y)}
              onMouseOver={() =>
                this.handleCellMouseover(dataitem.x, dataitem.y)
              }
              onMouseOut={() => this.handleCellMouseout(dataitem.x, dataitem.y)}
              value={dataitem}
              cellBGColour={this.state.cellBGColour}
              cellHoverColour={this.state.cellHoverColour}
              gridSize={this.props.squaresY}
              screenSize={this.state.screenWidth}
            />
            {datarow[datarow.length - 1] === dataitem ? (
              <div className="clear" />
            ) : (
              ""
            )}
          </div>
        );
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      this.setState({
        gridData: this.initGridData(
          nextProps.squaresY,
          nextProps.squaresX,
          nextProps.numOfHearts
        ),
        cellBGColour: "#000000",
        cellHoverColour: "#dddddd"
      });
    }
  }

  render() {
    return (
      <div className="grid">
        <div className="grid-info">
          <div className="info">
            Change the hearts BG colour :
            <ColorPicker
              color={this.state.cellBGColour}
              onChange={this.handleCellColourChange}
              animation="slide-up"
              className="rc-cp"
            />
          </div>

          <div className="info">
            Change the hearts BG hover colour :
            <ColorPicker
              color={this.state.cellHoverColour}
              onChange={this.handleCellHoverColourChange}
              animation="slide-up"
              className="rc-cp"
            />
          </div>
        </div>

        <div className="gridComponent" style={this.getGridWidth()}>
          {this.renderGrid(this.state.gridData)}
        </div>
      </div>
    );
  }
}

Grid.propTypes = {
  squaresY: PropTypes.number.isRequired,
  squaresX: PropTypes.number.isRequired,
  numOfHearts: PropTypes.number.isRequired
};
