import React from "react";
import firebase from "firebase";
import PropTypes from "prop-types";
import AddFishForm from "./AddFishForm";
import EditFishForm from "./EditFishForm";
import Login from "./Login";
import base, { firebaseApp } from "../base";

class Inventory extends React.Component {
  static propTypes = {
    fishes: PropTypes.shape({
      image: PropTypes.string,
      name: PropTypes.string,
      desc: PropTypes.string,
      status: PropTypes.string,
      price: PropTypes.number,
    }),
    updateFish: PropTypes.func,
    deleteFish: PropTypes.func,
    addFish: PropTypes.func,
    loadSampleFishes: PropTypes.func,
  };

  state = {
    uid: null,
    owner: null,
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.authHandler({ user });
      }
    });
  }

  authHandler = async (authData) => {
    // 1. LOOK UP THE CURRENT STORE IN THE FIREBASE DATABASE
    const store = await base.fetch(this.props.storeId, { context: this });
    console.log(store);
    // 2. CLAIM IT IF THERE IS NO OWNER
    if (!store.owner) {
      // SAVE IS AS OUR STORE
      await base.post(`${this.props.storeId}/owner`, {
        data: authData.user.uid,
      });
    }
    // 3. SET THE STATE OF THE INVENTORY COMPONENT TO REFLECT THE CURRENT USER
    this.setState({
      uid: authData.user.uid,
      owner: store.owner || authData.user.uid,
    });
    console.log(authData);
  };

  authenticate = (provider) => {
    // CREATE AN AUTH PROVIDER BASED ON WHAT THEY WANT TO SIGN IN WITH
    const authProvider = new firebase.auth[`${provider}AuthProvider`]();
    // ONCE SOMEONE COMES BACK FROM THIS POP UP => .THEN
    firebaseApp.auth().signInWithPopup(authProvider).then(this.authHandler);
  };

  logout = async () => {
    await firebase.auth().signOut();
    this.setState({ uid: null });
  };

  render() {
    const logout = <button onClick={this.logout}>Log Out!</button>;

    // CHECK IF THEY ARE LOGGED IN
    if (!this.state.uid) {
      return <Login authenticate={this.authenticate} />;
    }
    // CHECK IF THEY ARE THE OWNER OF THE STORE
    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry you are not the store owner!</p>
          {logout}
        </div>
      );
    }
    // NO OBJECTIONS - THEY MUST BE THE OWNER
    return (
      <div className="inventory">
        <h2>INVENTORY</h2>
        {logout}
        {Object.keys(this.props.fishes).map((key) => (
          <EditFishForm
            key={key}
            index={key}
            fish={this.props.fishes[key]}
            updateFish={this.props.updateFish}
            deleteFish={this.props.deleteFish}
          />
        ))}
        <AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSampleFishes}>
          Load Sample Fishes
        </button>
      </div>
    );
  }
}

export default Inventory;
