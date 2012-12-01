/**
 * Represents a chain of actions to be executed asynchronously
 *
 * @api public
 */

function Chain() {
  this.actions = [];
  this.current = 0;
  this.started = false;
}

/**
 * Add a new action to the action chain
 *
 * @param {Function} a function to be executed asynchronously,
 *                   taking two parameters: `err` and `next`.
 * @api public
 */

Chain.prototype.run = function (action) {
  if (this.started) {
    throw new Error('Cannot add new action to chain after execution started.');
  }

  if ('undefined' == typeof action) {
    throw new Error('Missing argument: `action`.');
  }

  if (!(action instanceof Function)) {
    throw new Error('`action` argument provided is not a function.');
  }

  this.actions.push(action);
}

/**
 * Execute the next action in the chain
 *
 * @param {Error} error resulting from the execution of the last action
 * @api public
 */

Chain.prototype.next = function (err) {
  var _this = this,
    , action = this.actions[this.current];

  if ('undefined' == typeof action) {
    return;
  }

  process.nextTick(function() {
    this.current++;
    action.call(_this, err, _this.next.bind(_this));
  });
}

/**
 * Optionally add a final action, and start the execution of the Chain.
 *
 * @param {Function} final action in the chain
 * @api public
 */

Chain.prototype.done = function(action) {
  if ('undefined' != typeof action) {
    this.run(action);
  }

  this.started = true;
  this.next();
}

/**
 * Export Module
 */

module.exports = Chain;
