import bluebird from "bluebird"
import env from "@tutanota/env"

globalThis.env = env
globalThis.Promise = bluebird.Promise
Promise.config({
	longStackTraces: true,
	warnings: false,
})

globalThis.isBrowser = typeof window !== "undefined"

;(async function () {
	const noOp = () => {}
	if (isBrowser) {
		/**
		 * runs this test exclusively on browsers (not nodec)
		 */
		window.browser = (func) => func

		/**
		 * runs this test exclusively on node (not browsers)
		 */
		window.node = noOp
	} else {
		const noOp = () => {}

		/**
		 * runs this test exclusively on browsers (not node)
		 */
		globalThis.browser = () => noOp

		/**
		 * runs this test exclusively on node (not browsers)
		 */
		globalThis.node = func => func

		const browserMock = await import("mithril/test-utils/browserMock")
		globalThis.window = browserMock.default()
		globalThis.window.getElementsByTagName = function () {
		} // for styles.js
		globalThis.window.location = {hostname: "https://tutanota.com"}
		globalThis.window.document.addEventListener = function () {
		}
		globalThis.document = globalThis.window.document
		globalThis.navigator = globalThis.window.navigator
		const local = {}
		globalThis.localStorage = {
			getItem: key => local[key],
			setItem: (key, value) => local[key] = value
		}

		globalThis.btoa = str => Buffer.from(str, 'binary').toString('base64')
		globalThis.atob = b64Encoded => Buffer.from(b64Encoded, 'base64').toString('binary')
		globalThis.WebSocket = noOp

		const nowOffset = Date.now();
		globalThis.performance = {
			now: function () {
				return Date.now() - nowOffset;
			}
		}
		globalThis.performance = {
			now: Date.now,
			mark: noOp,
			measure: noOp,
		}
		const crypto = await import("crypto")
		globalThis.crypto = {
			getRandomValues: function (bytes) {
				let randomBytes = crypto.randomBytes(bytes.length)
				bytes.set(randomBytes)
			}
		}
		globalThis.XMLHttpRequest = (await import("xhr2")).default

		globalThis.requestAnimationFrame = globalThis.requestAnimationFrame || (callback => setTimeout(callback, 10))
		process.on("unhandledRejection", function (e) {
			console.log("Uncaught (in promise) " + e.stack)
		})
	}
	window.tutao = {}

	const Env = await import("../../src/api/Env.js")
	Env.bootFinished()

	import('./Suite.js')
})()

