import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const data = [
  {
    "identifier": "Prashant"
  },
  {
    "identifier": "SachinSingh"
  },
  {
    "identifier": "SachinSinghChauhan"
  },
  {
    "identifier": "SachinSinghChauhans"
  }
]



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

  render() {
    return (
      <div>
        <h1>
          This is Enrollment File.
        </h1>

        <Link style={{ textDecoration: 'none', color: 'black' }} to="/dashboard">Dashboard</Link>

        <h1>Data List</h1>
        <table>
          <thead>
            <tr>
              <th>Identifier</th>
              <th>Status</th>
              <th>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {this.state.enrollment_data.map((item, index) => (
              <tr key={index}>
                <td>{item.identifier}</td>
                <td>ENROLLED</td>
                <td><button>
                  RE-ENROLL
                </button></td>
                <td>
                  <button onClick={() => this.deleteUser(item.identifier)}>
                    DELETE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ border: "1.5px solid #30A7FF", position: 'absolute', top: '70%', left: '50%', transform: 'translate(-50%, -50%)', width: "30%", height: "10%", backgroundColor: "#00344E", borderRadius: "15px", padding: "13px", color: "#b2dfee" }}>
          <h1 style={{ position: 'absolute', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <Link style={{ textDecoration: 'none', color: 'white' }} to="/recorder">Enroll New User</Link>
          </h1>
        </div>
      </div>
    );
  }


}

export default Enrollment;
