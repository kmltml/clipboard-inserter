console.log("I'm alive")

let previousContent = ""
let listeningTabs = []
let timer = null
let options = defaultOptions

browser.storage.local.get(defaultOptions)
    .then(o => options = o)

browser.storage.onChanged.addListener((changes, area) => {
    if(area === "local") {
	const optionKeys = Object.keys(options)
	for(key of Object.keys(changes)) {
	    if(optionKeys.indexOf(key) >= 0) {
		options[key] = changes[key].newValue
	    }
	}
    }
})

browser.browserAction.onClicked.addListener(() => {
    browser.tabs.query({active: true})
	.then(([t]) => toggleTab(t.id))
})

function toggleTab(id) {
    const index = listeningTabs.indexOf(id)
    if(index >= 0) {
	uninject(id)
	listeningTabs.splice(index, 1)
	updateTimer()
	browser.browserAction.setBadgeText({ text: "", tabId: id })
    } else {
	browser.tabs.executeScript({file: "/fg/insert.js"})
	listeningTabs.push(id)
	updateTimer()
	browser.browserAction.setBadgeBackgroundColor({ color: "green", tabId: id })
	browser.browserAction.setBadgeText({ text: "ON", tabId: id })
    }
}

function notifyForeground(id, text) {
    browser.tabs.sendMessage(id, {
	action: "insert", text, options
    })
}

function uninject(id) {
    browser.tabs.sendMessage(id, { action: "uninject" })
}

function checkClipboard() {
    const pasteTarget = document.querySelector("#paste-target")
    pasteTarget.textContent = ""
    pasteTarget.focus()
    document.execCommand("paste")
    const content = pasteTarget.textContent
    if(content != previousContent) {
	listeningTabs.forEach(id => notifyForeground(id, content))
	previousContent = content
    }
}

function updateTimer() {
    if(listeningTabs.length > 0) {
	if(timer === null) {
	    const id = setInterval(checkClipboard, 1000)
	    timer = { id }
	}
    } else {
	if(timer !== null) {
	    clearInterval(timer.id)
	}
    }
}
