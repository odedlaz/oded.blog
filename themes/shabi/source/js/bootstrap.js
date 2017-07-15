loader = require('./loader.js')
insight = require('./insight.js')

loader.run(jQuery);
insight.run(jQuery, window.INSIGHT_CONFIG);
