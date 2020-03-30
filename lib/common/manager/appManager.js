var async = require('async');
var utils = require('../../util/utils');
var logger = require('pomelo2-logger').getLogger('pomelo', __filename);
var transactionLogger = require('pomelo2-logger').getLogger('transaction-log', __filename);
var transactionErrorLogger = require('pomelo2-logger').getLogger('transaction-error-log', __filename);

var manager = module.exports;

manager.transaction = function (name, conditions, handlers, retry) {
  if (!retry) {
    retry = 1;
  }
  if (typeof name !== 'string') {
    logger.error('transaction name is error format', { name });
    return;
  }
  if (typeof conditions !== 'object' || typeof handlers !== 'object') {
    logger.error('transaction conditions parameter is error format', { conditions, handlers });
    return;
  }

  var cmethods = [], dmethods = [], cnames = [], dnames = [];
  for (var key in conditions) {
    if (typeof key !== 'string' || typeof conditions[key] !== 'function') {
      logger.error('transaction conditions parameter is error format.', { key, condition: conditions[key] });
      return;
    }
    cnames.push(key);
    cmethods.push(conditions[key]);
  }

  var i = 0;
  // execute conditions
  async.forEachSeries(cmethods, function (method, cb) {
    method(cb);
    transactionLogger.info('condition is executed.', { name, cname: cnames[i] });
    i++;
  }, function (err) {
    if (err) {
      process.nextTick(function () {
        transactionLogger.error('condition is executed with err.', { name, cname: cnames[--i], stack: err.stack });
        var log = {
          name: name,
          method: cnames[i],
          time: Date.now(),
          type: 'condition',
          description: err.stack
        };
        transactionErrorLogger.error('condition is executed with err', log);
      });
      return;
    } else {
      // execute handlers
      process.nextTick(function () {
        for (var key in handlers) {
          if (typeof key !== 'string' || typeof handlers[key] !== 'function') {
            logger.error('transcation handlers parameter is error format.', { key, handler: handlers[key] });
            return;
          }
          dnames.push(key);
          dmethods.push(handlers[key]);
        }

        var flag = true;
        var times = retry;

        // do retry if failed util retry times
        async.whilst(
          function () {
            return retry > 0 && flag;
          },
          function (callback) {
            var j = 0;
            retry--;
            async.forEachSeries(dmethods, function (method, cb) {
              method(cb);
              transactionLogger.info('handler is executed.', { name, dname: dnames[j] });
              j++;
            }, function (err) {
              if (err) {
                process.nextTick(function () {
                  transactionLogger.error('handler is executed with err', { name, dname: dnames[--j], time: times - retry, stack: err.stack });
                  var log = {
                    name: name,
                    method: dnames[j],
                    retry: times - retry,
                    time: Date.now(),
                    type: 'handler',
                    description: err.stack
                  };
                  transactionErrorLogger.error('handler is executed with err', log);
                  utils.invokeCallback(callback);
                });
                return;
              }
              flag = false;
              utils.invokeCallback(callback);
              process.nextTick(function () {
                transactionLogger.info('all conditions and handlers are executed successfully', { name });
              });
            });
          },
          function (err) {
            if (err) {
              logger.error('transaction process is executed with error', { message: err.message, stack: err.stack });
            }
            // callback will not pass error
          }
        );
      });
    }
  });
};