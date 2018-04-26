'use strict';

const constants = require('../../lib/constants');
const QubinoDevice = require('../../lib/QubinoDevice');

/**
 * Flush 1D Relay (ZMNHND)
 * Extended manual: http://qubino.com/download/2041/
 * Regular manual: http://qubino.com/download/1014/
 */
class ZMNHND extends QubinoDevice {
	async onMeshInit() {
		await super.onMeshInit();

		// Register configuration dependent capabilities
		this._registerCapabilities();
	}

	/**
	 * Method that will register capabilities based on the detected configuration of the device; it can have 5
	 * different configurations (with/without temperature sensor, input 2 enabled/disabled).
	 * @private
	 */
	_registerCapabilities() {

		// Only register root device, no inputs, no temperature sensor
		if (this.numberOfMultiChannelNodes === 0) {
			this.log('Configured root device');
			this.registerCapability(constants.capabilities.onoff, constants.commandClasses.switchBinary);
		} else {

			// Register root device endpoint
			const rootDeviceEndpoint = this.findRootDeviceEndpoint();
			if (typeof rootDeviceEndpoint === 'number') {
				this.log('Configured root device on multi channel node', rootDeviceEndpoint);
				this.registerCapability(constants.capabilities.onoff, constants.commandClasses.switchBinary, {
					multiChannelNodeId: rootDeviceEndpoint,
				});
			}

			// Register input endpoints
			this.registerInputEndpoints();

			// Register temperature sensor endpoint
			this.registerTemperatureSensorEndpoint();
		}
	}
}

module.exports = ZMNHND;