function WishListHeaderViewModel(externalId, name, isFavorite, detailsUrl) {
    var self = this;

    self.ExternalId = externalId;
    self.Name = name;
    self.IsFavorite = isFavorite;
    self.DetailsUrl = detailsUrl;
}

function WishListLineViewModel(image, displayName, color, lineDiscount, quantity, linePrice, lineTotal, externalLineId, productUrl, productId, variantId, productCatalog, listId) {
    var self = this;

    self.Image = image;
    self.DisplayName = displayName;
    self.Color = color;
    self.LineDiscount = lineDiscount;
    self.Quantity = quantity;
    self.LinePrice = linePrice;
    self.LineTotal = lineTotal;
    self.ExternalLineId = externalLineId;
    self.ProductUrl = productUrl;
    self.ProductId = productId;
    self.VariantId = variantId;
    self.ProductCatalog = productCatalog;
    self.ListId = listId;
}

function WishListViewModel(data) {
    var self = this;

    self.Lines = ko.observableArray();
    $(data.Lines).each(function () {
        self.Lines.push(new WishListLineViewModel(this.Image, this.DisplayName, this.Color, this.LineDiscount, this.Quantity, this.LinePrice, this.LineTotal, this.ExternalLineId, this.ProductUrl, this.ProductId, this.VariantId, this.ProductCatalog, data.ExternalId));
    });

    self.Name = ko.observable(data.Name);
    self.ExternalId = ko.observable(data.ExternalId);
    self.IsFavorite = ko.observable(data.IsFavorite);

    self.reload = function (data) {
        self.Lines.removeAll();

        $(data.Lines).each(function () {
            self.Lines.push(new WishListLineViewModel(this.Image, this.DisplayName, this.Color, this.LineDiscount, this.Quantity, this.LinePrice, this.LineTotal, this.ExternalLineId, this.ProductUrl, this.ProductId, this.VariantId, this.ProductCatalog, data.ExternalId));
        });

        self.Name = data.ExternalId;
        self.IsFavorite = data.IsFavorite;
    }

    self.load = function (wishListId) {
        self.Lines.removeAll();

        AJAXGet(StorefrontUri("api/sitecore/wishlist/getWishList?id=" + wishListId), null, function (data, success, sender) {
            self.reload(data);
        });
    }

    self.deleteItem = function () {
        self.Lines.removeAll();

        AJAXPost(StorefrontUri('api/sitecore/wishlist/deleteLineItem'), '{"WishListId":"' + this.ListId + '", "LineId":"' + this.ExternalLineId + '"}', function (data, success, sender) {
            self.reload(data);
        });
    }

    self.updateItem = function () {
        self.Lines.removeAll();

        var lineQuantity = $('#' + this.ExternalLineId).val();

        AJAXPost(StorefrontUri('api/sitecore/wishlist/updateLineItem'), '{"WishListId":"' + this.ListId + '", "ProductId":"' + this.ProductId + '", "Quantity":"' + lineQuantity + '"}', function (data, success, sender) {
            self.reload(data);
        });
    }
}

function WishListsViewModel(data) {
    var self = this;

    self.WishLists = ko.observableArray(data.WishLists);

    self.delete = function() {
        AJAXPost(StorefrontUri('api/sitecore/wishlist/deleteWishList'), '{"Id":"' + this.ExternalId + '"}', function(data, success, sender) {
            self.reload(data);
        }, this);
    }

    self.create = function () {
        AJAXPost('/api/sitecore/wishlist/createWishList', '{"Name":"' + $("#wishlist-name").val() + '"}', function (data, success, sender) {
            self.reload(data);
            $('#wishlist-name').val('');
            $('#createWishList').attr('disabled', 'disabled');
            manageWisListActions();
        }, this);
    }

    self.reload = function(data) {
        self.WishLists.removeAll();

        $(data.WishLists).each(function () {
            self.WishLists.push(new WishListHeaderViewModel(this.ExternalId, this.Name, this.IsFavorite, this.DetailsUrl));
        });
    }

    self.load = function() {
        self.WishLists.removeAll();

        AJAXGet(StorefrontUri("api/sitecore/wishlist/activeWishLists"), null, function (data, success, sender) {
            $(data.WishLists).each(function () {
                self.WishLists.push(new WishListHeaderViewModel(this.ExternalId, this.Name, this.IsFavorite, this.DetailsUrl));
            });
        });
    }

    self.isNotEmpty = ko.observable(self.WishLists().length != 0);
    self.isEmpty = ko.observable(self.WishLists().length == 0);

    self.makeFavorite = function () {
        AJAXPost(StorefrontUri("api/sitecore/wishlist/updateWishList"), '{"Id":"' + this.ExternalId + '", "Name":"' + this.Name + '", "IsFavorite":"' + true + '"}', function (data, success, sender) {
            self.WishLists.removeAll();
            self.reload(data);
        });
    }
}