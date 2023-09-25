import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';


const popupStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
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
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
  padding: '20px',
  textAlign: 'center',
  position: 'absolute',
  color: "#b2dfee",
  borderRadius: "15px",
  border: "1.5px solid #30A7FF",
};

const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
};

class Enrollment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enrollment_data: [],
      isRunning: false,
      showPopup: false
    };
    this.timer = null;
  }

  componentDidMount = () => {
    console.log('Initialiaing the enrollment component')
    this.getUserHistory()
  }


  deleteUser = (userId) => {
    console.log('getting user - ', userId)

    fetch('https://teams.dev.sondeservices.com/api/user-management/user/' + userId)
      .then(response => response.json())
      .then(result => {
        console.log('Delete Response - ', result)
        this.setState({ showPopup: true })
        this.getUserHistory()
      });

  }
  getUserHistory = () => {

    fetch('https://teams.dev.sondeservices.com/api/user-management/users')
      .then(response => response.json())
      .then(result => {
        console.log('User - history ', result)
        this.setState({ enrollment_data: result })
      });
  }

  updateUserEnrollment = () => {
    const formData = new FormData();
    formData.append("webmasterfile", this.state.blobData);
    var requestOptions = {
      method: 'POST',
      body: formData,
      redirect: 'follow'
    };


    fetch('https://teams.dev.sondeservices.com/user/' + this.state.userId + '/docker-enroll', requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log("Got the response from server for enrollment - ", result)
        this.setState({ enrollmentStatus: true, enrollmentProgress: false })
      })
      .catch(error => console.log('error', error));
  }

  handleContinueClick = () => {
    this.setState({ showPopup: false })
  }



  render() {
    const isEmpty = Object.keys(this.state.enrollment_data).length === 0;
    const tableStyle = {
      border: '1px solid #ccc',
      borderCollapse: 'collapse',
      width: '90%',
      margin: 'auto'
    };

    const cellStyle = {
      border: '1px solid #ccc',
      padding: '8px',
      margin: '0',
      textAlign: 'left',
      backgroundColor: '#f2f2f2',
    };

    return (
      <div>
        <Header />
        <h4>
          User Enrollments
        </h4>
        <div style={{ bottom: '50%' }}>

          <br>
          </br>
          <table style={tableStyle}>
            <thead>
              <tr>
                {isEmpty ? (
                  <p>No User Enrollment Found in System!</p>
                ) : (
                  <>
                    <th style={cellStyle}>Identifier</th>
                    <th style={cellStyle} >Status</th>
                    <th style={cellStyle}>
                      Action
                    </th></>
                )}

              </tr>
            </thead>
            <tbody>
              {this.state.enrollment_data.map((item, index) => (
                <tr key={index}>
                  <td style={cellStyle}>{item.identifier}</td>
                  <td style={cellStyle}>ENROLLED</td>
                  <td style={cellStyle}>
                    <button onClick={() => this.deleteUser(item.identifier)}>
                      DELETE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <br>
        </br>
        <br>
        </br>
        <div style={{ border: "1.5px solid #30A7FF", position: 'absolute', bottom: '0%', left: '50%', transform: 'translate(-50%, -50%)', width: "85%", height: "8%", backgroundColor: "#00344E", borderRadius: "15px", padding: "13px", color: "#b2dfee" }}>
          <h1 style={{ margin: "3px", position: 'absolute', left: '40%', transform: 'translate(-50%, -50%)' }}>
            <Link style={{ textDecoration: 'none', color: 'white', fontSize: '20px' }} to="/recorder"> &nbsp;&nbsp; Enroll New User</Link>
          </h1>

        </div>
        <div>
          {this.state.showPopup && (
            <div style={popupStyle}>
              <div style={popupContentStyle}>
                <p>USER DELETED SUCCESSFULLY!</p>
                <button style={closeButtonStyle} onClick={this.handleContinueClick}>
                  <Link style={{ textDecoration: 'none', color: 'white' }} to="/enrollment"> CONTINUE </Link>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }


}

export default Enrollment;
