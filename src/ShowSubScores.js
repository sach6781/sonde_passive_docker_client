import React from 'react'

const percentColors = [
  { pct: 1.0, color: { r: 0x00, g: 0xa5, b: 0 } },
  { pct: 0.5, color: { r: 0xa5, g: 0xa5, b: 0 } },
  { pct: 0.0, color: { r: 0xa5, g: 0x00, b: 0 } }
]

const getColorForPercentage = function (pct) {
  // console.log(typeof(pct), ' - is type ', pct, ' - is value')
  for (var i = 1; i < percentColors.length - 1; i++) {
    if (pct < percentColors[i].pct) {
      break
    }
  }
  const lower = percentColors[i - 1]
  const upper = percentColors[i]
  const range = upper.pct - lower.pct
  const rangePct = (pct - lower.pct) / range
  const pctLower = 1 - rangePct
  const pctUpper = rangePct
  const color = {
    r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
    g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
    b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
  }
  return 'rgb(' + [color.r, color.g, color.b].join(',') + ')'
}

function ShowSubScores (props) {
  const vf_score = props.var
  const agg_score = props.final_score
  const time_stamp = props.time_stamp
  console.log('Got the sub score in UI - ', props.var)
  return (
    <div style={{ width: '100%' }}>
      <h3 style={{ color: '#00B0F0', fontSize: '15px' }}>
        {' '}
        Calculated at - {time_stamp}
      </h3>
      <div
        style={{
          border: '0.5px solid black',
          background: 'white',
          borderRadius: '15px',
          margin: '2px',
          paddingLeft: '2px',
          paddingRight: '2px'
        }}
      >
        <h4
          style={{
            textAlign: 'left',
            float: 'left',
            top: '0%',
            color: '#00B0F0',
            fontSize: '13px'
          }}
        >
          Aggregated Score
        </h4>
        <h4
          style={{
            paddingRight: '10px',
            textAlign: 'right',
            color: getColorForPercentage(vf_score[0].score / 100),
            fontSize: '13px'
          }}
        >
          {agg_score}
        </h4>
      </div>
      <h3 style={{ color: '#00B0F0', fontSize: '15px' }}>
        {' '}
        Your Score Components{' '}
      </h3>
      <div
        style={{
          border: '0.5px solid black',
          background: 'white',
          borderRadius: '15px',
          margin: '2px',
          paddingLeft: '2px',
          paddingRight: '2px'
        }}
      >
        <h4
          style={{
            textAlign: 'left',
            float: 'left',
            color: '#00B0F0',
            fontSize: '13px'
          }}
        >
          {vf_score[0].name}
        </h4>
        <h4
          style={{
            textAlign: 'right',
            fontSize: '13px',
            color: getColorForPercentage(vf_score[0].score / 100)
          }}
        >
          {vf_score[0].score}%
        </h4>
      </div>
      <div
        style={{
          border: '0.5px solid black',
          background: 'white',
          borderRadius: '15px',
          margin: '2px',
          paddingLeft: '2px',
          paddingRight: '2px'
        }}
      >
        <h4
          style={{
            textAlign: 'left',
            float: 'left',
            color: '#00B0F0',
            fontSize: '13px'
          }}
        >
          {vf_score[2].name}
        </h4>
        <h4
          style={{
            textAlign: 'right',
            color: getColorForPercentage(vf_score[2].score / 100),
            fontSize: '13px'
          }}
        >
          {vf_score[2].score}%
        </h4>
      </div>
      <div
        style={{
          border: '0.5px solid black',
          background: 'white',
          borderRadius: '15px',
          margin: '2px',
          paddingLeft: '2px',
          paddingRight: '2px'
        }}
      >
        <h4
          style={{
            textAlign: 'left',
            float: 'left',
            color: '#00B0F0',
            fontSize: '13px'
          }}
        >
          {vf_score[1].name}
        </h4>
        <h4
          style={{
            textAlign: 'right',
            color: getColorForPercentage(vf_score[1].score / 1.0),
            fontSize: '13px'
          }}
        >
          {vf_score[1].score} octaves
        </h4>
      </div>
      <div
        style={{
          border: '0.5px solid black',
          background: 'white',
          borderRadius: '15px',
          margin: '2px',
          paddingLeft: '2px',
          paddingRight: '2px'
        }}
      >
        <h4
          style={{
            textAlign: 'left',
            float: 'left',
            color: '#00B0F0',
            fontSize: '13px'
          }}
        >
          {vf_score[3].name}
        </h4>
        <h4
          style={{
            textAlign: 'right',
            color: getColorForPercentage(vf_score[3].score / 100),
            fontSize: '13px'
          }}
        >
          {vf_score[3].score} dB
        </h4>
      </div>
      <div
        style={{
          border: '0.5px solid black',
          background: 'white',
          borderRadius: '15px',
          margin: '2px',
          paddingLeft: '2px',
          paddingRight: '2px'
        }}
      >
        <h4
          style={{
            textAlign: 'left',
            float: 'left',
            color: '#00B0F0',
            fontSize: '13px'
          }}
        >
          {vf_score[4].name}
        </h4>
        <h4
          style={{
            textAlign: 'right',
            color: getColorForPercentage(vf_score[4].score / 1.0),
            fontSize: '13px'
          }}
        >
          {vf_score[4].score} kHz<sup>2</sup>
        </h4>
      </div>
      <div
        style={{
          border: '0.5px solid black',
          background: 'white',
          borderRadius: '15px',
          margin: '2px',
          paddingLeft: '2px',
          paddingRight: '2px'
        }}
      >
        <h4
          style={{
            textAlign: 'left',
            float: 'left',
            color: '#00B0F0',
            fontSize: '13px'
          }}
        >
          {vf_score[5].name}
        </h4>
        <h4
          style={{
            textAlign: 'right',
            color: getColorForPercentage(vf_score[5].score / 100),
            fontSize: '13px'
          }}
        >
          {vf_score[5].score} ms
        </h4>
      </div>
      <div
        style={{
          border: '0.5px solid black',
          background: 'white',
          borderRadius: '15px',
          margin: '2px',
          paddingLeft: '2px',
          paddingRight: '2px'
        }}
      >
        <h4
          style={{
            textAlign: 'left',
            float: 'left',
            color: '#00B0F0',
            fontSize: '13px'
          }}
        >
          {vf_score[6].name}
        </h4>
        <h4
          style={{
            textAlign: 'right',
            color: getColorForPercentage(vf_score[6].score / 100),
            fontSize: '13px'
          }}
        >
          {vf_score[6].score} words/min
        </h4>
      </div>
      <div
        style={{
          border: '0.5px solid black',
          background: 'white',
          borderRadius: '15px',
          margin: '2px',
          paddingLeft: '2px',
          paddingRight: '2px'
        }}
      >
        <h4
          style={{
            textAlign: 'left',
            float: 'left',
            color: '#00B0F0',
            fontSize: '13px'
          }}
        >
          {vf_score[7].name}
        </h4>
        <h4
          style={{
            textAlign: 'right',
            color: getColorForPercentage(vf_score[7].score / 1.0),
            fontSize: '13px'
          }}
        >
          {vf_score[7].score} seconds
        </h4>
      </div>
    </div>
  )
}

export default ShowSubScores
