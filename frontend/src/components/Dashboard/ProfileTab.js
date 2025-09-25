// ProfileTab.js
import React, { Component } from "react";

class ProfileTab extends Component {
  render() {
    const { profile } = this.props;

    if (!profile) return <p>Profile information not available.</p>;

    return (
      <div>
        <h3>My Profile</h3>
        <table>
          <tbody>
            <tr>
              <td><strong>Name:</strong></td>
              <td>{profile.name}</td>
            </tr>
            <tr>
              <td><strong>Roll Number:</strong></td>
              <td>{profile.roll_no || "-"}</td>
            </tr>
            <tr>
              <td><strong>Role:</strong></td>
              <td>{profile.role}</td>
            </tr>
            <tr>
              <td><strong>Email:</strong></td>
              <td>{profile.email || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default ProfileTab;
