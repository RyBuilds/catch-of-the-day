import React from "react";
import PropTypes from "prop-types";
import { getFunName } from "../helpers";

class StorePicker extends React.Component {
  static propTypes = {
    history: PropTypes.object,
  };
  // ES6 BINDING THIS KEYWORD
  constructor() {
    super();
    this.goToStore = this.goToStore.bind(this);
  }

  myInput = React.createRef();

  goToStore(event) {
    // STOP THE FORM FROM SUBMITTING
    event.preventDefault();
    // GET THE TEXT FROM THAT INPUT
    const storeName = this.myInput.current.value;
    // CHANGE THE PAGE TO /STORE/WHATEVER-THEY-ENTERED
    this.props.history.push(`/store/${storeName}`);
  }

  render() {
    return (
      <form action="" className="store-selector" onSubmit={this.goToStore}>
        <h2>Please Enter a Store</h2>
        <input
          type="text"
          ref={this.myInput}
          required
          placeholder="Store Name"
          defaultValue={getFunName()}
        />
        <button type="submit">Visit Store</button>
      </form>
    );
  }
}

export default StorePicker;
