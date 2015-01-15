var defaultCountryCode = "USA";

function AddressViewModel(address) {
    var self = this;

    var populate = address != null;

    self.ExternalId = populate ? ko.observable(address.ExternalId).extend({ required: true }) : ko.observable().extend({ required: true });
    self.Name = populate ? ko.observable(address.Name).extend({ required: true }) : ko.observable().extend({ required: true });
    self.Address1 = populate ? ko.observable(address.Address1).extend({ required: true }) : ko.observable().extend({ required: true });
    self.City = populate ? ko.observable(address.City).extend({ required: true }) : ko.observable().extend({ required: true });
    self.State = populate ? ko.observable(address.State).extend({ required: true }) : ko.observable().extend({ required: true });
    self.ZipPostalCode = populate ? ko.observable(address.ZipPostalCode).extend({ required: true }) : ko.observable().extend({ required: true });
    self.Country = populate ? ko.observable(address.Country).extend({ required: true }) : ko.observable().extend({ required: true });
    self.IsPrimary = populate ? ko.observable(address.IsPrimary).extend({ required: true }) : ko.observable().extend({ required: true });
    self.FullAddress = populate ? ko.observable(address.FullAddress).extend({ required: true }) : ko.observable().extend({ required: true });

    self.states = ko.observableArray();
    self.Country.subscribe(function (countryCode) {
        self.states.removeAll();
        self.getStates(countryCode);
    });

    self.getStates = function (countryCode) {
        AJAXPost(StorefrontUri("api/sitecore/checkout/getAvailableStatesJson"), '{ "CountryCode": "' + countryCode + '"}', function (data, success, sender) {
            if (data.States != null) {
                $.each(data.States, function (code, name) {
                    self.states.push(new CountryStateViewModel(name, code));
                });
            }
        });
    }
}

var CountryStateViewModel = function (name, code) {
    this.name = name;
    this.code = code;
};

function AddressListViewModel(data) {
    var self = this;

    self.Addresses = ko.observableArray(data.Addresses);
    self.isNotEmpty = ko.observable(self.Addresses().length != 0);
    self.isEmpty = ko.observable(self.Addresses().length == 0);
    self.enableDelete = ko.observable(false);
    self.enableSave = ko.observable(true);
    
    self.countries = ko.observableArray();
    if (data.Countries != null) {
        $.each(data.Countries, function (code, name) {
            self.countries.push(new CountryStateViewModel(name, code));
        });
    }

    self.address = ko.observable(new AddressViewModel());
    self.selectedAddress = ko.observable();
    self.selectedAddress.subscribe(function (externalId) {
        var address = ko.utils.arrayFirst(this.Addresses(), function (address) {
            if (address.ExternalId === externalId) {
                return address;
            }

            return null;
        });

        if (address != null) {
            self.address(address);
            self.enableDelete(true);
        } else {
            self.address(new AddressViewModel());
            self.enableDelete(false);
        }
    }.bind(this));

    var addressId = getUrlParameter(document.URL, 'id');
    if (addressId != null) {
        self.selectedAddress(addressId);
    }

    self.reload = function (data) {
        self.Addresses.removeAll();
        self.Addresses(data.Addresses);
        
        $.each(data.Countries, function (code, name) {
            self.countries.push(new CountryStateViewModel(name, code));
        });

        self.address(new AddressViewModel());
        self.isNotEmpty(self.Addresses().length != 0);
        self.isEmpty(self.Addresses().length == 0);
        self.enableDelete(false);
    }

    self.saveAddress = function () {
        states('saveAddress', 'loading');
        $('#cancelChanges').attr('disabled', 'disabled');
        self.enableDelete(false);
        var address = ko.toJSON(self.address);
        
        AJAXPost(StorefrontUri('api/sitecore/account/addressmodify'), address, function (data, success, sender) {
            self.reload(data);
            $('#saveAddress').button('reset');
            $('#cancelChanges').removeAttr('disabled');
        }, this);
    }

    self.deleteAddress = function () {
        states('deleteAddress', 'loading');
        self.enableSave(false);
        $('#cancelChanges').attr('disabled', 'disabled');

        AJAXPost(StorefrontUri('api/sitecore/account/addressdelete'), '{ "ExternalId": "' + self.address().ExternalId + '"}', function(data, success, sender) {
            if (success && data.Errors.length == 0) {
                self.reload(data);
                $('#deleteAddress').button('reset');
                $('#deleteAddress').attr('disabled', 'disabled');
                self.enableSave(true);
                $('#cancelChanges').removeAttr('disabled');
            }
        }, this);
    }
}