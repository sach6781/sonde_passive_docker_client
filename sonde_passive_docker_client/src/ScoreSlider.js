import React, { Component } from 'react';

const data = {
  "sachin": [],
  "nikhil": [23, 43, 22, 83, 90],
  "singh": [10, 100]
};

class ScoreSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score: null
    };
  }

  scoreGridStyle = {
    display: 'grid',
    margin: '5px',
    padding: '10px',
    gridTemplateColumns: 'repeat(10, minmax(50px, 1fr))', // Adjust the number of columns as needed
    gridGap: '1px', // Adjust the gap between the boxes as needed
    justifyContent: 'center', // Center align the boxes horizontally
    alignContent: 'center', // Center align the boxes vertically
  };

  scoreBoxStyle = {
    width: '50px', // Minimum width for each box
    height: '50px', // Minimum height for each box
    border: '1px solid #000', // Add a border around each box
    justifyContent: 'center', // Center the text horizontally
    alignItems: 'center', // Center the text vertically
    fontSize: '20px', // Adjust the font size as needed
    fontWeight: 'bold', // Make the text bold
    padding: '10px',
    margin: '5px',
    
  };

  render() {
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {Object.keys(data).map((name) => (
            <div key={name} style={this.scoreGridStyle}>
              <h2>{name}</h2>
              <br />
              <div>
                {data[name].map((score, index) => (
                  <span key={index} style={this.scoreBoxStyle}>
                    {score}
                  </span>
                ))}
                {Array.from({ length: 10 - data[name].length }, (_, index) => (
                  <span key={index} style={this.scoreBoxStyle}></span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ScoreSlider;
