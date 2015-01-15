// Global Vars
var checkoutDataViewModel = null;
var lineItemListViewModel = null;
var defaultCountryCode = "USA";
var methodsViewModel = null;
var method = null;
var expirationDates = ko.observableArray();
var expirationYears = ko.observableArray();
var shippingMethodsArray = [];


function initObservables(){
    method = function(description, id){
        this.description = description;
        this.id = id;
    }
    MethodsViewModel = function () {
        var self = this;
        self.methods = ko.observableArray();
    }
    methodsViewModel = new MethodsViewModel();
}

function getExpirationDates() {
    for (var i = 0; i < 12; i++) {
        var index = i + 1;
        expirationDates.push({ Name: index, Value: index });
    }
}

function getExpirationYears() {
    for (var i = 0; i < 10; i++) {
        var currentYear = new Date().getFullYear();
        expirationYears.push({ Year: currentYear + i, Value: currentYear+ i });
    }
}




function initCheckoutData() {
    getExpirationDates();
    getExpirationYears();
    getCart();
}

function getCheckoutData() {
    AJAXGet(StorefrontUri("api/sitecore/checkout/GetCheckoutData"), null, function (data, success, sender) {
        checkoutDataViewModel = new CheckoutDataViewModel(data);
        ko.applyBindings(checkoutDataViewModel);
        enableControls();
    });
}

function getCart() {
    AJAXPost(StorefrontUri("api/sitecore/cart/getcurrentcart"), null, function (data, success, sender) {
        lineItemListViewModel = new LineItemListViewModel(data);
        getCheckoutData();
    });
}

function CheckoutDataViewModel(data) {
   
    var self = this;
    self.countries = ko.observableArray();
    var Country = function (name, code) {
        this.country = name;
        this.code = code;
    };
    if (data.Countries != null) {
        $.each(data.Countries, function (index, value) {
            self.countries.push(new Country(value, index));
        });
    }

    self.orderShippingOptions = ko.observableArray();
    if (data.OrderShippingOptions != null) {
        $.each(data.OrderShippingOptions, function (index, value) {
            self.orderShippingOptions.push(value);
        });
    }

    var Address = function (id, street, info) {
        this.street = street;
        this.id = id;
        this.info = info;
    };

    self.userAddresses = ko.observableArray();
    self.isAuthenticated = false;
   
    self.userAddresses = ko.observableArray();
        
    self.userAddresses.push(new Address("UseShipping", $("#BillingAddressSelect").attr("title"), null));
            if (data.IsUserAuthenticated == true) {
            if (data.UserAddresses != null) {
            $.each(data.UserAddresses, function (index, value) {
                self.userAddresses.push(new Address(index, value.Name, value));
            });
            }
            self.isAuthenticated = true;
            }
    self.userAddresses.push(new Address("UseOther", $("#ShippingAdressSelect").attr("title2"), null));


    self.states = ko.observableArray(GetAvailableStates(defaultCountryCode));
       

    self.shippingMethods = ko.observableArray();

    self.lineItemListViewModel = lineItemListViewModel;

    self.payCard = false;
    self.payGiftCard = false;
    self.payLoyaltyCard = false;

    if (data.PaymentOptions != null) {
        $.each(data.PaymentOptions, function (index, value) {
            if (value.PaymentOptionType.Name == "PayCard") {
                self.payCard = true;
            }
            if (value.PaymentOptionType.Name == "PayGiftCard") {
                self.payGiftCard = true;
            }
            if (value.PaymentOptionType.Name == "PayLoyaltyCard") {
                self.payLoyaltyCard = true;
            }
        });
    }

    self.payGiftLoyaltyCard = self.payGiftCard || self.payLoyaltyCard ? true : false;

    var PaymentMethod = function (externalId, description) {
        this.ExternalId = externalId;
        this.Description = description;
    };

    self.paymentMethods = ko.observableArray();
    if (data.PaymentMethods != null) {
        self.paymentMethods.push(new PaymentMethod("0", $("#PaymentMethods").attr("title")));
        $.each(data.PaymentMethods, function (index, value) {
            self.paymentMethods.push(new PaymentMethod(value.ExternalId, value.Description));
        });
    }
    
    self.expirationDates = expirationDates;
    self.expirationYears = expirationYears;    

    if (data.LineShippingOptions != null) {
        $.each(data.LineShippingOptions, function (index, value) {
            $.each(self.lineItemListViewModel.cartlines(), function (i, v) {
                if (self.lineItemListViewModel.cartlines()[i].externalCartlineId == value.LineId) {
                    $.each(value.ShippingOptions, function (k, option) {
                        self.lineItemListViewModel.cartlines()[i].lineShippingOptions.push(option);
                    })
                   
                }
               
            })    
        });
    }

    self.cartLoyaltyCardNumber = data.CartLoyaltyCardNumber;

    shippingMethodViewModel = new SetShippingMethods();
    self.shippingCost = shippingMethodViewModel;

    self.giftCards = ko.observableArray();
    self.loyaltyCards = ko.observableArray();
    self.creditCard = ko.observable();

   
}

function GetAvailableStates(countryCode){
    var statesArray = [];
    // Uncomment when the States are available
    //
    //AJAXPost(StorefrontUri("api/sitecore/checkout/GetAvailableStatesJson"), countryCode, function (data, success, sender) {       
    //    if (data.States != null) {
    //        $.each(data.UserAddresses, function (index, value) {         
    //            statesArray.push(new Country(value, index));
    //        });
    //    }  
    //});
    return statesArray;
}

function UpdateAvailableStates(countryCode)
{
    checkoutDataViewModel.states(GetAvailableStates(countryCode));
}


function enableControls() {
    $('#orderShippingPreference').removeAttr('disabled');
}
