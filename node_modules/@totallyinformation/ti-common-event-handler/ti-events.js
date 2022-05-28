/**
 * Copyright (c) 2021 Julian Knight (Totally Information)
 * https://it.knightnet.org.uk, https://github.com/TotallyInformation/ti-common-event-handler
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
'use strict'

const EventEmitter2 = require('eventemitter2')

/** Singleton model. Only 1 instance of tiEventManager should ever exist.
 * Use as: `const tiEvents = require('@totallyinformation/ti-common-event-handler')`
 */

var tiEventManager = new EventEmitter2({
    // set this to `true` to use wildcards
    wildcard: true,
    // the delimiter used to segment namespaces
    delimiter: '/',
})

module.exports = tiEventManager

//EOF
