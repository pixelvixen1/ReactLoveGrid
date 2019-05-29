import React from "react";
import PropTypes from "prop-types";

export default class Cell extends React.Component {
  getCellValue = () => {
    if (this.props.value.isHeart && this.props.value.isSelected) {
      return this.props.value.neighbour;
    }

    if (this.props.value.isHeart) {
      return "❤️";
    }

    return null;
  };

  getStyle = () => {
    let cellStyle;
    let cellSize = "38px";
    let gsize = parseInt(this.props.gridSize);
    let ss = this.props.screenSize - 60;
    let fontSize;

    if( ss >= 768){
      ss = 768;   
    }

    let new_cell_size = parseInt(ss / gsize);
    gsize <= 7
      ? (new_cell_size = new_cell_size - 1)
      : (new_cell_size = new_cell_size - 1);
    cellSize = new_cell_size + "px";

    fontSize = parseInt(new_cell_size / 2.5) + "px";

    if (this.props.value.isHeart) {
      cellStyle = {
        backgroundColor: this.props.cellBGColour,
        color: this.props.value.isSelected ? "#458af3" : "#fc543c",
        width: cellSize,
        height: cellSize,
        lineHeight: cellSize,
        fontSize: fontSize
      };
    } else {
      cellStyle = {
        width: cellSize,
        height: cellSize,
        lineHeight: cellSize,
        fontSize: fontSize
      };
    }

    if (this.props.value.isHeart && this.props.value.hoverOn) {
      cellStyle = {
        backgroundColor: this.props.value.hoverOn
          ? this.props.cellHoverColour
          : this.props.cellBGColour,
        color: "#5c93e6",
        width: cellSize,
        height: cellSize,
        lineHeight: cellSize,
        fontSize: fontSize
      };
    }

    return cellStyle;
  };

  render() {
    return (
      <div
        ref="cell"
        onClick={this.props.onClick}
        onMouseOver={this.props.onMouseOver}
        onMouseOut={this.props.onMouseOut}
        className="cell"
        style={this.getStyle()}
      >
        {this.getCellValue()}
      </div>
    );
  }
}

Cell.propTypes = {
  onClick: PropTypes.func.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onMouseOut: PropTypes.func.isRequired,
  value: PropTypes.object.isRequired,
  cellBGColour: PropTypes.string.isRequired,
  cellHoverColour: PropTypes.string.isRequired,
  gridSize: PropTypes.number.isRequired,
  screenSize: PropTypes.number.isRequired
};
