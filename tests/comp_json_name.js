var tape = require("tape");

var protobuf = require("..");

tape.test("explicit JSON field names", function(test) {
    var type = protobuf.parse('syntax = "proto3"; message Example { string first_name = 1 [json_name = "FirstName"]; string constructor = 2 [json_name = "constructor"]; }')
        .root.lookupType("Example");
    test.equal(type.fields.FirstName.id, 1, "uses the explicit JSON name");
    test.equal(type.fields.constructor.id, 2, "retains an actual constructor field");

    test.throws(function() {
        protobuf.parse('message Example { optional string name = 1 [json_name = "2fa"]; }');
    }, /Invalid JSON field name "2fa" on name/, "rejects an alias that cannot be emitted safely");
    test.throws(function() {
        protobuf.parse('message Example { optional string name = 1 [json_name = "__proto__"]; }');
    }, /Invalid JSON field name "__proto__" on name/, "rejects a prototype-shadowing alias");
    test.end();
});
