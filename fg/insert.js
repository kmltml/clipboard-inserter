(() => {
    const processMessage = msg => {
	switch(msg.action) {
	case "insert":
	    const elem = document.createElement(msg.options.elemName)
	    elem.textContent = msg.text
	    document.querySelector(msg.options.containerSelector).appendChild(elem)
	    break
	case "uninject":
	    browser.runtime.onMessage.removeListener(processMessage)
	    break
	}    
    }

    browser.runtime.onMessage.addListener(processMessage)
})()
