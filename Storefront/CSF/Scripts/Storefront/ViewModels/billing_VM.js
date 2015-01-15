var billingViemModel = null;
var shippingMethodViewModel = null;

function SetShippingMethods() {
    var self = this;
    self.discount = ko.observable();
    self.lines = ko.observable();
    self.shippingTotal = ko.observable();
    self.subTotal = ko.observable();
    self.taxTotal = ko.observable();
    self.total = ko.observable();

}

function GiftCard(Number, Amount) {
    this.number = ko.observable(Number);
    this.amount = ko.observable(Amount);
    this.balance = ko.observable();
}

function LoyaltyCard(Number, Amount) {
    this.number = ko.observable(Number);
    this.amount = ko.observable(Amount);
    this.points = ko.observable();
}

function CreditCard(Number, Amount) {
    this.number = ko.observable(Number);
    this.amount = ko.observable(Amount);
}