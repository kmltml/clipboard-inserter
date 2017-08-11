document.addEventListener("DOMContentLoaded", () => {
    const elemName = document.querySelector("#elem-name"),
	  containerSelector = document.querySelector("#container-selector")

    const storage = browser.storage.local
    
    storage.get(defaultOptions).then(o => {
	elemName.value = o.elemName
	containerSelector.value = o.containerSelector
    })
    elemName.onchange = () => storage.set({ elemName: elemName.value })
    containerSelector.onchange = () => storage.set({ containerSelector: containerSelector.value })
})
