import React, { Component } from 'react';
import ShowSubScores from './ShowSubScores';
import { Link, useNavigate } from 'react-router-dom';


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
  width: '70%'
};

const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
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
      showPopup: false
    };
  }

  scoreGridStyle = {
    margin: '2px',
    padding: '10px',
    gridTemplateColumns: 'repeat(10, minmax(50px, 1fr))', // Adjust the number of columns as needed
    gridGap: '1px', // Adjust the gap between the boxes as needed
    justifyContent: 'center', // Center align the boxes horizontally
    alignContent: 'center', // Center align the boxes vertically
  };

  openPopup = (score) => {
    this.setState({ showPopup: true })
    console.log('I got clicked for score - ', score)
    // setIsPopupOpen(true);
  };

  handleContinueClick = () => {
    this.setState({ showPopup: false })
  }


  render() {
    const receivedData = this.props.data;
    const isEmpty = Object.keys(receivedData).length === 0;
    return (
      <div>
        <div >
          {isEmpty ? (
            <>No user history data found in System!</>
          ) : (
            <></>
          )}
          {Object.keys(receivedData).map((name) => (

            <div>

              <h2 >{name}</h2>
              {receivedData[name].map((score, index) => (

                <span onClick={() => this.openPopup(score)} key={index} style={{
                  borderRadius: "10px", width: '1px', height: '25px', border: '1px solid #000', justifyContent: 'center', alignItems: 'center', fontSize: '20px', fontWeight: 'bold',
                  padding: '5px', margin: '2px', color: getColorForPercentage(score), cursor: 'pointer'
                }}>

                  {score}
                </span>
              ))}
              {Array.from({ length: 10 - receivedData[name].length }, (_, index) => (
                <span key={index} style={{
                  borderRadius: "10px", width: '10px', height: '25px', border: '1px solid #000', justifyContent: 'center', alignItems: 'center', fontSize: '20px', fontWeight: 'bold',
                  padding: '5px', margin: '2px', color: 'white'
                }}>{<>....</>}</span>
              ))}
              {/* </div> */}
            </div>
          ))}
        </div>

        <div>
          {this.state.showPopup && (
            <div style={popupStyle}><button style={closeButtonStyle} onClick={this.handleContinueClick}>
            <h3 style={{left: '0%', color: 'white'}}>
             CONTINUE
            </h3>
           </button>    
              <div style={popupContentStyle}>
                <ShowSubScores var={this.state.data} final_score={50}> </ShowSubScores>
                
              </div>
             
            </div>
          )}
        </div>

      </div>
    );
  }
}

export default ScoreSlider;
