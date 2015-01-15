var confirmViemModel = null;

function ConfirmViewModel(data) {

    var items = ko.observableArray();

    $.map(data, function (index, value) {

        var currentId = value.externalCartlineId;
        if (items.indexOf(currentId)) {
            items.push([currentId,value]);
        }
       
    })

   
}

function composedItem(image, displayName, color, delivery, lineprice, quantity, linetotal, externalCartlineId) {

    this.image = image;
    this.displayName = displayName;
    this.color = color;
    this.delivery = delivery;
    this.price = lineprice;
    this.quantity = quantity;
    this.total = linetotal;
    this.id = externalCartlineId;

}