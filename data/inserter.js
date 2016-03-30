self.port.on('insert', data => {
  var elem = document.createElement('div')
  elem.textContent = data
  document.body.appendChild(elem)
})
