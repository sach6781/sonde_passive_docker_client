import React, { Component } from 'react';
import ShowSubScores from './ShowSubScores';
import { Link, useNavigate } from 'react-router-dom';

const Users = [{ "identifier": "Sachin" }, { "identifier": "Nikhil" }, { "identifier": "Yo" }]


const popupStyle = {
  position: 'fixed',
  top: '5%',
  left: '5%',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const popupContentStyle = {
  backgroundColor: '#00344E',
  borderRadius: '8px',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  position: 'absolute',
  color: "#b2dfee",
  borderRadius: "15px",
  border: "1.5px solid #30A7FF",
  width: '70%',
  top: '10%'
};

const closeButtonStyle = {
  position: 'fixed',
  top: '10%',
  right: '10%',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
};

var percentColors = [
  { pct: 1.0, color: { r: 0x00, g: 0xa5, b: 0 } },
  { pct: 0.5, color: { r: 0xa5, g: 0xa5, b: 0 } },
  { pct: 0.0, color: { r: 0xa5, g: 0x00, b: 0 } }];

var getColorForPercentage = function (pct) {
  for (var i = 1; i < percentColors.length - 1; i++) {
    if (pct < percentColors[i].pct) {
      break;
    }
  }
  var lower = percentColors[i - 1];
  var upper = percentColors[i];
  var range = upper.pct - lower.pct;
  var rangePct = (pct - lower.pct) / range;
  var pctLower = 1 - rangePct;
  var pctUpper = rangePct;
  var color = {
    r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
    g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
    b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
  };
  return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
};

class ScoreSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score: null,
      data: [{ "name": "Smoothness", "score": "99" }, { "name": "Liveliness", "score": "0.45" }, { "name": "Control", "score": "98" }, { "name": "Energy Range", "score": "13" }, { "name": "Clarity", "score": "0.21" }, { "name": "Crispness", "score": "134" }, { "name": "Speech Rate", "score": "31" }, { "name": "Pause Duration", "score": "0.88" }],
      showPopup: false,
      subScores: [],
      final_score: '',
      final_timestamp: '',
      remainingChunks: 0,
      chunksMap: {},
      showPopUpChunks: false
    };
  }

  scoreGridStyle = {
    margin: '2px',
    padding: '8px',
    gridTemplateColumns: 'repeat(10, minmax(50px, 1fr))', // Adjust the number of columns as needed
    gridGap: '1px', // Adjust the gap between the boxes as needed
    justifyContent: 'center', // Center align the boxes horizontally
    alignContent: 'center', // Center align the boxes vertically
  };

  openPopup = (id, timestamp, score) => {
    console.log('I got clicked for id - ', id, ' and timestamp - ', timestamp)
    this.getSubScores(id, score, timestamp)
  };

  handleContinueClick = () => {
    this.setState({ showPopup: false })
  }

  handleContinueClickChunks = () => {
    this.setState({ showPopUpChunks: false })
  }

  getRemainingChunks = (name) => {
    fetch('https://teams.dev.sondeservices.com/api/user-management/user/' + name + '/chunks')
      .then(response => response.json())
      .then(result => {
        // console.log('Chunks for - ', name, 'are - ', result.chunks)
        this.setState({ remainingChunks: result.chunks, showPopUpChunks: true })
      });
    console.log('Chunks Maps - ', this.state.chunksMap)
  }

  getSubScores = (score_id, score, timestamp) => {
    fetch('https://teams.dev.sondeservices.com/api/user-management/score/' + score_id)
      .then(response => response.json())
      .then(result => {
        console.log('Sub Scores are ', result.voiceFeatures)
        this.setState({ subScores: result.voiceFeatures, showPopup: true, final_score: score, final_timestamp: timestamp })
      });
  }

  render() {
    const test_data = this.props.data;
    const isEmpty = Object.keys(test_data).length === 0;
    const crossStyle = {
      width: '25px',
      height: '25px',
      position: 'relative',
    };

    const lineStyle = {
      position: 'absolute',
      width: '100%',
      height: '2px',
      background: 'white',
      color: 'white',
      transformOrigin: 'center',
    };
    return (
      <div>


        <div >
          {isEmpty ? (
            <>No user history data found in System!</>
          ) : (
            <></>
          )}

          {Object.keys(test_data).map((name) => (
            <div key={name}>
              <h2><button style={{'background-color': 'transparent', 'border': 'none', cursor: 'pointer', fontSize: '18px'}} onClick={() => this.getRemainingChunks(name)}>{name} </button></h2>
              {test_data[name].map((data, index) => (
                <span
                  onClick={() => this.openPopup(data.id, data.calculated_at, data.score)} // Access the score property
                  key={index}
                  style={{
                    borderRadius: '10px',
                    width: '1px',
                    height: '25px',
                    border: '1px solid #000',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '15px',
                    fontWeight: 'bold',
                    padding: '5px',
                    margin: '2px',
                    color: getColorForPercentage(data.score), // Access the score property
                    cursor: 'pointer',
                  }}
                >
                  {data.score} {/* Display the score */}
                </span>

                // <span
                //   // Access the score property
                //   key={index}
                //   style={{
                //     borderRadius: '10px',
                //     width: '1px',
                //     height: '25px',
                //     border: '1px solid #000',
                //     justifyContent: 'center',
                //     alignItems: 'center',
                //     fontSize: '15px',
                //     fontWeight: 'bold',
                //     padding: '5px',
                //     margin: '2px',
                //     color: getColorForPercentage(data.score), // Access the score property
                //     cursor: 'pointer',
                //   }}
                // >
                //   {data.score} {/* Display the score */}
                // </span>
              ))}
              {Array.from({ length: 10 - test_data[name].length }, (_, index) => (
                <span
                  key={index}
                  style={{
                    borderRadius: '10px',
                    width: '10px',
                    height: '25px',
                    border: '1px solid #000',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '15px',
                    fontWeight: 'bold',
                    padding: '5px',
                    margin: '2px',
                    color: 'white',
                  }}
                >
                  {'....'}
                </span>
              ))}
            </div>
          ))}

        </div>

        <div>
          {/* <button style={closeButtonStyle} onClick={this.handleContinueClick}>
              <h3 style={{ color: 'white' }}>
                CONTINUE
              </h3>
            </button> */}

          {this.state.showPopup && (
            <div style={popupStyle}><button style={closeButtonStyle} onClick={this.handleContinueClick}>
              {/* <h3 style={{ color: 'white' }}>
                CONTINUE
              </h3> */}
              <div className="cross" style={crossStyle}>
                <div className="line line1" style={{ ...lineStyle, transform: 'rotate(45deg)' }}></div>
                <div className="line line2" style={{ ...lineStyle, transform: 'rotate(-45deg)' }}></div>
              </div>
            </button>
              <div style={popupContentStyle}>
                <ShowSubScores var={this.state.subScores} final_score={this.state.final_score} time_stamp={this.state.final_timestamp}> </ShowSubScores>
              </div>

            </div>
          )}

          {this.state.showPopUpChunks && (
            <div style={popupStyle}><button style={closeButtonStyle} onClick={this.handleContinueClickChunks}>
              <div className="cross" style={crossStyle}>
                <div className="line line1" style={{ ...lineStyle, transform: 'rotate(45deg)' }}></div>
                <div className="line line2" style={{ ...lineStyle, transform: 'rotate(-45deg)' }}></div>
              </div>
            </button>
              <div style={popupContentStyle}>
                <h1>
                  Segments Analyzed - {this.state.remainingChunks}
                </h1>
              </div>

            </div>
          )}


        </div>

      </div>
    );
  }
}

export default ScoreSlider;
