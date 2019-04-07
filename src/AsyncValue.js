// WARNING: This is a temporary API because these
// features aren't exposed by React yet

import React from "react";
import ReactDOM from "react-dom";

export class AsyncValue extends React.Component {
	state = { asyncValue: this.props.defaultValue };
	deferSetState(state) {
		ReactDOM.unstable_deferredUpdates(() => {
			this.setState(state);
		});
	}
	componentDidMount() {
		this.deferSetState((state, props) => ({ asyncValue: props.value }));
	}
	componentDidUpdate() {
		if (this.props.value !== this.state.asyncValue) {
			this.deferSetState((state, props) => ({ asyncValue: props.value }));
		}
	}
	render() {
		return this.props.children(this.state.asyncValue);
	}
}
