var React = require("react");
var faultInjectionStatusStore = require("./../../../../stores/faultInjectionStatusStore");
var selectedTraceRunNumberStore = require("./../../../../stores/selectedTraceRunNumberStore");
var selectedTraceRunNumberActions = require("./../../../../actions/selectedTraceRunNumberActions");
var Reflux = require("reflux");

var FaultInjectionStatus = React.createClass({
	mixins: [Reflux.connect(faultInjectionStatusStore,"faultInjectionStatus"), Reflux.connect(selectedTraceRunNumberStore,"traceRunNumbers")],
	getInitialState: function() {
		return {
			faultInjectionStatus: [],
			traceRunNumbers: []
		};
	},
	render: function() {
		var className = "faultInjectionStatus" + (this.props.shouldDisplay ? "" : " hide");
		var injectionStatusRows = this.state.faultInjectionStatus.map(function(data, index) {
			var traceChecked = this.state.traceRunNumbers.includes(data.runIndex) ? true: false;
			return (
				<tr key={index}>
					<td>{data.runNumber}</td>
					<td>{data.injectionType}</td>
					<td>{data.index}</td>
					<td>{data.cycle}</td>
					<td>{data.bit}</td>
					<td>{data.sdc}</td>
					<td>{data.status}</td>
					<td>{data.result}</td>
					<td>
						<div class="checkbox">
							<input type="checkbox" id={"checkBoxTrace_" + data.runIndex} onClick={this.selectTrace} checked={traceChecked}/>
						</div>
					</td>
				</tr>
			);
		}.bind(this));
		return (
			<div class={className}>
				<table class="table table-hover faultInjectionStatusTable">
					<thead>
						<tr>
							<th>Run Option</th>
							<th>Fault Injection Type</th>
							<th>Index</th>
							<th>Cycle</th>
							<th>Bit</th>
							<th>SDC Occurance</th>
							<th>Status</th>
							<th>Result</th>
							<th class="traceHeader">
								Trace
								<div class="checkbox">
									<label><input id="checkallTrace" type="checkbox" onClick={this.onClickCheckAll}/>Select All</label>
								</div>
							</th>
						</tr>
					</thead>
					<tbody>
						{injectionStatusRows}
					</tbody>
				</table>
			</div>
		);
	},
	selectTrace : function (event) {
		var selectedRunNumber = event.target.id.split("_")[1];
		var traceChecked = $("#" + event.target.id).is(":checked");
		var traceRunNumbers = this.state.traceRunNumbers;
		if (traceChecked) {
			// Add the run number if the checkbox is checked
			traceRunNumbers.push(selectedRunNumber);
		} else {
			// Remove the run number if the checked is unchecked
			var index = traceRunNumbers.indexOf(selectedRunNumber);
			if (index > -1) traceRunNumbers.splice(index, 1);
		}
		selectedTraceRunNumberActions.updateSelectedRunNumber(traceRunNumbers);
	},
	onClickCheckAll : function (event) {
		var traceAllChecked = $("#checkallTrace").is(":checked");
		var traceRunNumbers = [];
		// If check all is checked, add all runs, otherwise, remove all runs
		if (traceAllChecked) {
			for (var i = 0; i < this.state.faultInjectionStatus.length; i++) {
				traceRunNumbers.push(this.state.faultInjectionStatus[i].runIndex);
			}
		}
		selectedTraceRunNumberActions.updateSelectedRunNumber(traceRunNumbers);
	}
});

module.exports = FaultInjectionStatus;