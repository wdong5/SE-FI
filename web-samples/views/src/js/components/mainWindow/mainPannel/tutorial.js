var React = require("react");
var Tutorial = React.createClass({
	getInitialState: function() {
		return {
			toggle: true
		};
	},
	render: function() {
		var caretDirectionClassName = this.state.toggle ? "caret-directional down" : "caret-directional right";
		var tutorialContainerClassName = this.state.toggle ? "llfiTutorial-container" : "llfiTutorial-container hide";
		return (
			<div className = "llfiTutorial">
				<div className="btn dropdown-toggle btn-block llfiTutorial-toggle" onClick={this.onClickToggle}>
					<span className={caretDirectionClassName}></span>
					<span className="llfiTutorial-label">LLFI Tutorial</span>
				</div>
				<div className={tutorialContainerClassName}>
					<div className="llfiTutorial-context">
						<p>This is a short tutorial for using the GUI to run LLFI. Full instructions are available on the project's wiki page.</p>
						<p>1. Click File->'Open File' to import any standalone C, C++ or .ll file. If you want to import a C or C++ project instead, use File->'Import Project' and nagivate to your project folder.</p>
						<p>Note: You cannot edit your program here.</p>
						<p>2. Click 'Compile To IR' to compile your program to IR form.</p>
						<p>3. Click 'Instrument' to configure compile options.</p>
						<p>4. Enter in any command line inputs (if exists) and then click 'Profiling'.</p>
						<p>5. Click 'Runtime Options' and configure.</p>
						<p>6. Click 'Inject Fault'.</p>
						<p>7. View the fault injection results at the bottom pane.</p>
						<p>8. Navigate to 'Fault Injection Status', select one or more traces, and click 'Trace Graph' to view the fault propagation graphically.</p>
					</div>
				</div>
			</div>
		);
	},

	onClickToggle: function() {
		this.setState({
			toggle: !this.state.toggle
		});
	},
});

module.exports = Tutorial;