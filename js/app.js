function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
