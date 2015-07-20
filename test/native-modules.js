var Fs = require('fire-fs');

describe('NativeModules', function() {
  var list = JSON.parse(Fs.readFileSync('package.json')).nativeModules;
  list.forEach(function(item) {
    describe('module ' + item, function() {
      it('should require native module successfully', function( done ) {
        var npmModule = require(item);
        expect(npmModule).to.be.ok;
        done();
  	  });
    });
  });
});
