self.port.on('insert', (data, prefs) => {
  var elem = document.createElement(prefs['element-name'])
  elem.textContent = data
  var container = document.querySelector(prefs['container-selector'])
  document.body.appendChild(elem)
})
