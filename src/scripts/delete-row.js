function deleteRow(button) {
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}


console.log(document.getElementsByClassName('delete-button'));