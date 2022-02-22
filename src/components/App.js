import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import Order from "./Order";
import Inventory from "./Inventory";
import sampleFishes from "../sample-fishes";
import Fish from "./Fish";
import { object } from "prop-types";
import base from "../base";

class App extends React.Component {
  state = {
    fishes: {},
    order: {},
  };

  static propTypes = {
    match: PropTypes.object,
  };

  componentDidMount() {
    const { params } = this.props.match;
    // FIRST REINSTATE LOCAL STORAGE
    const localStorageRef = localStorage.getItem(params.storeId);
    if (localStorageRef) {
      this.setState({ order: JSON.parse(localStorageRef) });
    }
    this.ref = base.syncState(`${params.storeId}/fishes`, {
      context: this,
      state: "fishes",
    });
  }

  componentDidUpdate() {
    localStorage.setItem(
      this.props.match.params.storeId,
      JSON.stringify(this.state.order)
    );
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  addFish = (fish) => {
    // 1. TAKE A COPY OF THE EXISTING STATE
    const fishes = { ...this.state.fishes };
    // 2. ADD OUR NEW FISH TO THAT FISHES VARIABLE
    fishes[`fish${Date.now()}`] = fish;
    // 3. SET THE NEW FISHES OBJECT TO STATE
    this.setState({ fishes });
  };

  updateFish = (key, updatedFish) => {
    // 1. TAKE A COPY OF EXISTING STATE
    const fishes = { ...this.state.fishes };
    // 2. UPDATE THAT STATE
    fishes[key] = updatedFish;
    // 3. SET THAT TO STATE
    this.setState({ fishes });
  };

  deleteFish = (key) => {
    // 1. TAKE A COPY OF THE EXISTING STATE
    const fishes = { ...this.state.fishes };
    // 2. UPDATE THE STATE
    fishes[key] = null;
    // 3. UPDATE THE STATE
    this.setState({ fishes });
  };

  loadSampleFishes = () => {
    this.setState({ fishes: sampleFishes });
  };

  addToOrder = (key) => {
    // 1. TAKE A COPY OF THE EXISTING STATE
    const order = { ...this.state.order };
    // 2. EITHER ADD TO THE ORDER OR UPDATE QUANTITY
    order[key] = order[key] + 1 || 1;
    // 3. CALL SETSTATE TO UPDATE OUR STATE OBJECT
    this.setState({ order });
  };

  removeFromOrder = (key) => {
    // 1. TAKE A COPY OF THE EXISTING STATE
    const order = { ...this.state.order };
    // 2. REMOVE THAT ITEM FROM ORDER
    delete order[key];
    // 3. CALL SETSTATE TO UPDATE OUR STATE OBJECT
    this.setState({ order });
  };

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="fishes">
            {Object.keys(this.state.fishes).map((key) => (
              <Fish
                key={key}
                index={key}
                details={this.state.fishes[key]}
                addToOrder={this.addToOrder}
              />
            ))}
          </ul>
        </div>
        <Order
          fishes={this.state.fishes}
          order={this.state.order}
          removeFromOrder={this.removeFromOrder}
        />
        <Inventory
          addFish={this.addFish}
          updateFish={this.updateFish}
          deleteFish={this.deleteFish}
          loadSampleFishes={this.loadSampleFishes}
          fishes={this.state.fishes}
          storeId={this.props.match.params.storeId}
        />
      </div>
    );
  }
}

export default App;
