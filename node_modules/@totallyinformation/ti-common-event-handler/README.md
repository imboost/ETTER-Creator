# ti-common-event-handler

A common, shared event handler used across multiple TotallyInformation packages.
Implemented as a singleton class.

Uses the enhanced EventEmitter2 library for improved performance and support of wildcards

## Installation

```bash
npm install @totallyinformation/ti-common-event-handler
```

## Use as

```js
const tiEvents = require('@totallyinformation/ti-common-event-handler')

const aDataVar = {
    some: 'data'
}

tiEvents.emit('my-event-name', aDataVar)

tiEvents.on('my-event-name', (data) => {
    console.log('My data: ', data)
})
```

## Event name wildcards

`*` and `**` can be used as wildcards when creating event listeners.

`/` is pre-configured as the namespace separator so as to match the equivalent in MQTT topics.

See the EventEmitter2 node for details.

## Current usage

* [node-red-contrib-uibuilder](https://github.com/TotallyInformation/node-red-contrib-uibuilder)
* [node-red-contrib-events](https://github.com/TotallyInformation/node-red-contrib-events)

## Dependencies

* [EventEmitter2](https://github.com/EventEmitter2/EventEmitter2)