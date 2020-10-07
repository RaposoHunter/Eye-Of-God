class CommandsObj {
	has(cmdName) {
		if(this[cmdName] != undefined) return true;

		return false;
	}
}

module.exports = new CommandsObj();