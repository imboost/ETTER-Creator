const fse = require("fs-extra");
const path = require("path");

module.exports = function(RED) {
    function CopyNode(config) {
        RED.nodes.createNode(this, config);

        this.target = config.target || "target";
        this.targetType = config.targetType || "msg";
        this.source = config.source || "source";
        this.sourceType = config.sourceType || "msg";

        let node = this;

        node.on('input', function(msg, send, done) {
            let target = RED.util.evaluateNodeProperty(node.target, node.targetType, node, msg);
            let source = RED.util.evaluateNodeProperty(node.source, node.sourceType, node, msg);

            if(Array.isArray(target)) {
                target = path.join(...target);
            }

            if(Array.isArray(source)) {
                source = path.join(...source);
            }

            fse.copy(source, target, err => {
                if(err) {
                    node.error(err, msg);
                    return;
                }

                send(msg);
                done();
            });
        });
    }

    RED.nodes.registerType("fs-extra-copy", CopyNode);
}