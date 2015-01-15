$(document).ready(function () {
    Microsoft.Dynamics.Retail.Ecommerce.Sdk.Controls.ResourcesHandler.selectUICulture();
    $('.msax-Control').each(function (index, element) {
        var viewModelName = $(element.firstElementChild).attr("data-model");
        var viewModel = eval(viewModelName);
        ko.applyBindings(new viewModel(element.firstElementChild), element);
    });
});

var msaxError = {
    show: function (level, message, errorCodes) {
        console.error(message);
    }
};

var msaxValues;
(function (msaxValues) {
    msaxValues.msax_CheckoutServiceUrl;
    msaxValues.msax_ShoppingCartServiceUrl;
    msaxValues.msax_OrderConfirmationUrl;
    msaxValues.msax_IsDemoMode;
    msaxValues.msax_DemoDataPath;
    msaxValues.msax_StoreProductAvailabilityServiceUrl;
    msaxValues.msax_ChannelServiceUrl;
    msaxValues.msax_LoyaltyServiceUrl;
    msaxValues.msax_CustomerServiceUrl;
    msaxValues.msax_HasInventoryCheck;
    msaxValues.msax_CheckoutUrl;
    msaxValues.msax_IsCheckoutCart;
    msaxValues.msax_ContinueShoppingUrl;
    msaxValues.msax_CartDiscountCodes;
    msaxValues.msax_CartLoyaltyReward;
    msaxValues.msax_ShoppingCartUrl;
    msaxValues.msax_CartDisplayPromotionBanner;
    msaxValues.msax_ReviewDisplayPromotionBanner;
})(msaxValues || (msaxValues = {}));

var Microsoft;
(function (Microsoft) {
    (function (Maps) {
        Maps.Map;
        Maps.loadModule;
        Maps.Search;
        Maps.Events;
        Maps.Pushpin;
        Maps.Infobox;
        Maps.Point;
    })(Microsoft.Maps || (Microsoft.Maps = {}));
    var Maps = Microsoft.Maps;
})(Microsoft || (Microsoft = {}));

var Microsoft;
(function (Microsoft) {
    (function (Dynamics) {
        (function (Retail) {
            (function (Ecommerce) {
                (function (Sdk) {
                    (function (Controls) {
                        var AjaxProxy = (function () {
                            function AjaxProxy(relativeUrl) {
                                this.SubmitRequest = function (webMethod, data, successCallback, errorCallback) {
                                    var webServiceUrl = this.relativeUrl + webMethod;

                                    var requestDigestHeader = ($(document).find('#__REQUESTDIGEST'))[0];
                                    var retailRequestDigestHeader = ($(document).find('#__RETAILREQUESTDIGEST'))[0];
                                    var requestDigestHeaderValue;
                                    var retailRequestDigestHeaderValue;

                                    if (Microsoft.Utils.isNullOrUndefined(requestDigestHeader) || Microsoft.Utils.isNullOrUndefined(retailRequestDigestHeader)) {
                                        requestDigestHeaderValue = null;
                                        retailRequestDigestHeaderValue = null;
                                    } else {
                                        requestDigestHeaderValue = requestDigestHeader.value;
                                        retailRequestDigestHeaderValue = retailRequestDigestHeader.value;
                                    }

                                    $.ajax({
                                        url: webServiceUrl,
                                        data: JSON.stringify(data),
                                        type: "POST",
                                        contentType: "application/json; charset=utf-8",
                                        dataType: "json",
                                        success: function (data) {
                                            if (data.RedirectUrl) {
                                                window.location = data.RedirectUrl;
                                            } else {
                                                successCallback(data);
                                            }
                                        },
                                        error: function (error) {
                                            errorCallback(error);
                                        },
                                        headers: {
                                            "X-RequestDigest": requestDigestHeaderValue,
                                            "X-RetailRequestDigest": retailRequestDigestHeaderValue
                                        }
                                    });
                                };
                                this.relativeUrl = relativeUrl;
                                $(document).ajaxError(this.ajaxErrorHandler);
                            }
                            AjaxProxy.prototype.ajaxErrorHandler = function (e, xhr, settings) {
                                var errorMessage = 'Url:\n' + settings.url + '\n\n' + 'Response code:\n' + xhr.status + '\n\n' + 'Status Text:\n' + xhr.statusText + '\n\n' + 'Response Text: \n' + xhr.responseText;

                                msaxError.show('error', 'The web service call was unsuccessful.  Details: ' + errorMessage);
                            };
                            return AjaxProxy;
                        })();
                        Controls.AjaxProxy = AjaxProxy;

                        var LoadingOverlay = (function () {
                            function LoadingOverlay() {
                            }
                            LoadingOverlay.CreateLoadingDialog = function (loadingDialog, width, height) {
                                loadingDialog.dialog({
                                    modal: true,
                                    autoOpen: false,
                                    draggable: true,
                                    resizable: false,
                                    position: ['top', 60],
                                    show: { effect: "fadeIn", duration: 500 },
                                    hide: { effect: "fadeOut", duration: 500 },
                                    open: function (event, ui) {
                                        setTimeout(function () {
                                            loadingDialog.dialog('close');
                                        }, 5000);
                                    },
                                    width: width,
                                    height: height,
                                    dialogClass: 'msax-Control msax-LoadingOverlay msax-NoTitle'
                                });
                            };

                            LoadingOverlay.ShowLoadingDialog = function (loadingDialog, loadingText, text) {
                                if (Microsoft.Utils.isNullOrWhiteSpace(text)) {
                                    loadingText.text(Controls.Resources.String_176);
                                } else {
                                    loadingText.text(text);
                                }

                                loadingDialog.dialog('open');
                                $('.ui-widget-overlay').addClass('msax-LoadingOverlay');
                            };

                            LoadingOverlay.CloseLoadingDialog = function (loadingDialog) {
                                loadingDialog.dialog('close');
                                $('.ui-widget-overlay').removeClass('msax-LoadingOverlay');
                            };
                            LoadingOverlay.existingOverlayClasses = [];
                            return LoadingOverlay;
                        })();
                        Controls.LoadingOverlay = LoadingOverlay;
                    })(Sdk.Controls || (Sdk.Controls = {}));
                    var Controls = Sdk.Controls;
                })(Ecommerce.Sdk || (Ecommerce.Sdk = {}));
                var Sdk = Ecommerce.Sdk;
            })(Retail.Ecommerce || (Retail.Ecommerce = {}));
            var Ecommerce = Retail.Ecommerce;
        })(Dynamics.Retail || (Dynamics.Retail = {}));
        var Retail = Dynamics.Retail;
    })(Microsoft.Dynamics || (Microsoft.Dynamics = {}));
    var Dynamics = Microsoft.Dynamics;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (Dynamics) {
        (function (Retail) {
            (function (Ecommerce) {
                (function (Sdk) {
                    (function (Controls) {
                        var ShoppingCartDataLevel = (function () {
                            function ShoppingCartDataLevel() {
                            }
                            ShoppingCartDataLevel.Minimal = 0;

                            ShoppingCartDataLevel.Extended = 1;

                            ShoppingCartDataLevel.All = 2;
                            return ShoppingCartDataLevel;
                        })();
                        Controls.ShoppingCartDataLevel = ShoppingCartDataLevel;
                        ;

                        var TransactionItemType = (function () {
                            function TransactionItemType() {
                            }
                            TransactionItemType.None = 0;

                            TransactionItemType.Kit = 1;

                            TransactionItemType.KitComponent = 2;
                            return TransactionItemType;
                        })();
                        Controls.TransactionItemType = TransactionItemType;

                        (function (LoyaltyCardTenderType) {
                            LoyaltyCardTenderType[LoyaltyCardTenderType["AsCardTender"] = 0] = "AsCardTender";

                            LoyaltyCardTenderType[LoyaltyCardTenderType["AsContactTender"] = 1] = "AsContactTender";

                            LoyaltyCardTenderType[LoyaltyCardTenderType["NoTender"] = 2] = "NoTender";

                            LoyaltyCardTenderType[LoyaltyCardTenderType["Blocked"] = 3] = "Blocked";
                        })(Controls.LoyaltyCardTenderType || (Controls.LoyaltyCardTenderType = {}));
                        var LoyaltyCardTenderType = Controls.LoyaltyCardTenderType;

                        var ShoppingCartType = (function () {
                            function ShoppingCartType() {
                            }
                            ShoppingCartType.None = 0;

                            ShoppingCartType.Shopping = 1;

                            ShoppingCartType.Checkout = 2;
                            return ShoppingCartType;
                        })();
                        Controls.ShoppingCartType = ShoppingCartType;

                        var AddressType = (function () {
                            function AddressType() {
                            }
                            AddressType.Delivery = 2;

                            AddressType.Payment = 5;
                            return AddressType;
                        })();
                        Controls.AddressType = AddressType;

                        (function (DeliveryPreferenceType) {
                            DeliveryPreferenceType[DeliveryPreferenceType["None"] = 0] = "None";

                            DeliveryPreferenceType[DeliveryPreferenceType["ShipToAddress"] = 1] = "ShipToAddress";

                            DeliveryPreferenceType[DeliveryPreferenceType["PickupFromStore"] = 2] = "PickupFromStore";

                            DeliveryPreferenceType[DeliveryPreferenceType["ElectronicDelivery"] = 3] = "ElectronicDelivery";

                            DeliveryPreferenceType[DeliveryPreferenceType["DeliverItemsIndividually"] = 4] = "DeliverItemsIndividually";
                        })(Controls.DeliveryPreferenceType || (Controls.DeliveryPreferenceType = {}));
                        var DeliveryPreferenceType = Controls.DeliveryPreferenceType;

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        

                        var CartProductDetailsClass = (function () {
                            function CartProductDetailsClass(o) {
                                o = o || {};
                                this.Name = o.Name;
                                this.ProductUrl = o.ProductUrl;
                                this.ProductNumber = o.ProductNumber;
                                this.ImageUrl = o.ImageUrl;
                                this.Description = o.Description;
                                this.DimensionValues = o.DimensionValues;
                                this.SKU = o.SKU;
                                this.ImageMarkup = o.ImageMarkup;
                                this.Quantity = o.Quantity;
                            }
                            return CartProductDetailsClass;
                        })();
                        Controls.CartProductDetailsClass = CartProductDetailsClass;

                        var SelectedLineDeliveryOptionClass = (function () {
                            function SelectedLineDeliveryOptionClass(o) {
                                o = o || {};
                                this.LineId = o.LineId;
                                this.DeliveryModeId = o.DeliveryModeId;
                                this.DeliveryModeText = o.DeliveryModeText;
                                this.DeliveryPreferenceId = o.DeliveryPreferenceId;
                                this.CustomAddress = o.CustomAddress;
                                this.StoreAddress = o.StoreAddress;
                                this.ElectronicDeliveryEmail = o.ElectronicDeliveryEmail;
                                this.ElectronicDeliveryEmailContent = o.ElectronicDeliveryEmailContent;
                            }
                            return SelectedLineDeliveryOptionClass;
                        })();
                        Controls.SelectedLineDeliveryOptionClass = SelectedLineDeliveryOptionClass;

                        var SelectedDeliveryOptionClass = (function () {
                            function SelectedDeliveryOptionClass(o) {
                                o = o || {};
                                this.DeliveryModeId = o.DeliveryModeId;
                                this.DeliveryModeText = o.DeliveryModeText;
                                this.DeliveryPreferenceId = o.DeliveryPreferenceId;
                                this.CustomAddress = o.CustomAddress;
                                this.StoreAddress = o.StoreAddress;
                                this.ElectronicDeliveryEmail = o.ElectronicDeliveryEmail;
                                this.ElectronicDeliveryEmailContent = o.ElectronicDeliveryEmailContent;
                            }
                            return SelectedDeliveryOptionClass;
                        })();
                        Controls.SelectedDeliveryOptionClass = SelectedDeliveryOptionClass;

                        var ImageInfoClass = (function () {
                            function ImageInfoClass(o) {
                                o = o || {};
                                this.Url = o.Url;
                                this.AltText = o.AltText;
                            }
                            return ImageInfoClass;
                        })();
                        Controls.ImageInfoClass = ImageInfoClass;

                        var TransactionItemClass = (function () {
                            function TransactionItemClass(o) {
                                o = o || {};
                                this.LineId = o.LineId;
                                this.ItemType = o.ItemType;
                                if (o.KitComponents) {
                                    this.KitComponents = [];
                                    for (var i = 0; i < o.KitComponents.length; i++) {
                                        this.KitComponents[i] = o.KitComponents[i] ? new TransactionItemClass(o.KitComponents[i]) : null;
                                    }
                                }

                                if (o.SelectedDeliveryOption) {
                                    this.SelectedDeliveryOption = o.SelectedDeliveryOption;
                                } else {
                                    this.SelectedDeliveryOption = new SelectedDeliveryOptionClass(null);
                                }

                                this.ProductId = o.ProductId;
                                this.ProductNumber = o.ProductNumber;
                                this.ItemId = o.ItemId;
                                this.VariantInventoryDimensionId = o.VariantInventoryDimensionId;
                                this.Quantity = o.Quantity;
                                this.PriceWithCurrency = o.PriceWithCurrency;
                                this.TaxAmountWithCurrency = o.TaxAmountWithCurrency;
                                this.DiscountAmount = o.DiscountAmount;
                                this.DiscountAmountWithCurrency = o.DiscountAmountWithCurrency;
                                this.NetAmountWithCurrency = o.NetAmountWithCurrency;
                                this.ShippingAddress = o.ShippingAddress;
                                this.DeliveryModeId = o.DeliveryModeId;
                                this.DeliveryModeText = o.DeliveryModeText;
                                this.ElectronicDeliveryEmail = o.ElectronicDeliveryEmail;
                                if (o.PromotionLines) {
                                    this.PromotionLines = [];
                                    for (var i = 0; i < o.PromotionLines.length; i++) {
                                        this.PromotionLines[i] = o.PromotionLines[i];
                                    }
                                }

                                this.ProductDetailsExpanded = o.ProductDetailsExpanded;
                                this.ProductDetails = o.ProductDetails;
                                this.NoOfComponents = o.NoOfComponents;
                                this.Color = o.Color;
                                this.Style = o.Style;
                                this.Size = o.Size;
                                this.Name = o.Name;
                                this.Description = o.Description;
                                this.ProductUrl = o.ProductUrl;
                                this.Image = o.Image;
                                this.ImageMarkup = o.ImageMarkup;
                                this.OfferNames = o.OfferNames;
                                if (o.DeliveryPreferences) {
                                    this.DeliveryPreferences = [];
                                    for (var i = 0; i < o.DeliveryPreferences.length; i++) {
                                        this.DeliveryPreferences[i] = o.DeliveryPreferences[i];
                                    }
                                }
                            }
                            return TransactionItemClass;
                        })();
                        Controls.TransactionItemClass = TransactionItemClass;

                        var ShoppingCartClass = (function () {
                            function ShoppingCartClass(o) {
                                o = o || {};
                                this.CartId = o.CartId;
                                this.Name = o.Name;
                                if (o.Items) {
                                    this.Items = [];
                                    for (var i = 0; i < o.Items.length; i++) {
                                        this.Items[i] = o.Items[i] ? new TransactionItemClass(o.Items[i]) : null;
                                    }
                                }
                                this.LastModifiedDate = o.LastModifiedDate;
                                this.CartType = o.CartType;
                                if (o.PromotionLines) {
                                    this.PromotionLines = [];
                                    for (var i = 0; i < o.PromotionLines.length; i++) {
                                        this.PromotionLines[i] = o.PromotionLines[i];
                                    }
                                }
                                if (o.DiscountCodes) {
                                    this.DiscountCodes = [];
                                    for (var i = 0; i < o.DiscountCodes.length; i++) {
                                        this.DiscountCodes[i] = o.DiscountCodes[i];
                                    }
                                }

                                if (o.SelectedDeliveryOption) {
                                    this.SelectedDeliveryOption = o.SelectedDeliveryOption;
                                } else {
                                    this.SelectedDeliveryOption = new SelectedDeliveryOptionClass(null);
                                }

                                this.LoyaltyCardId = o.LoyaltyCardId;
                                this.SubtotalWithCurrency = o.SubtotalWithCurrency;
                                this.DiscountAmountWithCurrency = o.DiscountAmountWithCurrency;
                                this.ChargeAmountWithCurrency = o.ChargeAmountWithCurrency;
                                this.TaxAmountWithCurrency = o.TaxAmountWithCurrency;
                                this.TotalAmount = o.TotalAmount;
                                this.TotalAmountWithCurrency = o.TotalAmountWithCurrency;
                                this.ShippingAddress = o.ShippingAddress;
                                this.DeliveryModeId = o.DeliveryModeId;
                            }
                            return ShoppingCartClass;
                        })();
                        Controls.ShoppingCartClass = ShoppingCartClass;

                        var ShoppingCartResponseClass = (function () {
                            function ShoppingCartResponseClass(o) {
                                o = o || {};
                                this.ShoppingCart = o.ShoppingCart;
                                if (o.Errors) {
                                    this.Errors = [];
                                    for (var i = 0; i < o.Errors.length; i++) {
                                        this.Errors[i] = o.Errors[i] ? new ErrorClass(o.Errors[i]) : null;
                                    }
                                }
                            }
                            return ShoppingCartResponseClass;
                        })();
                        Controls.ShoppingCartResponseClass = ShoppingCartResponseClass;

                        var ShoppingCartCollectionResponseClass = (function () {
                            function ShoppingCartCollectionResponseClass(o) {
                                o = o || {};
                                if (o.ShoppingCarts) {
                                    this.ShoppingCarts = [];
                                    for (var i = 0; i < o.ShoppingCarts.length; i++) {
                                        this.ShoppingCarts[i] = o.ShoppingCarts[i] ? new ShoppingCartClass(o.ShoppingCarts[i]) : null;
                                    }
                                }
                                if (o.Errors) {
                                    this.Errors = [];
                                    for (var i = 0; i < o.Errors.length; i++) {
                                        this.Errors[i] = o.Errors[i] ? new ErrorClass(o.Errors[i]) : null;
                                    }
                                }
                            }
                            return ShoppingCartCollectionResponseClass;
                        })();
                        Controls.ShoppingCartCollectionResponseClass = ShoppingCartCollectionResponseClass;

                        var ShippingOptionClass = (function () {
                            function ShippingOptionClass(o) {
                                o = o || {};
                                this.Id = o.Id;
                                this.ShippingType = o.ShippingType;
                                this.Description = o.Description;
                            }
                            return ShippingOptionClass;
                        })();
                        Controls.ShippingOptionClass = ShippingOptionClass;

                        var ShippingOptionsClass = (function () {
                            function ShippingOptionsClass(o) {
                                o = o || {};
                                if (o.ShippingOptions) {
                                    this.ShippingOptions = [];
                                    for (var i = 0; i < o.ShippingOptions.length; i++) {
                                        this.ShippingOptions[i] = o.ShippingOptions[i] ? new ShippingOptionClass(o.ShippingOptions[i]) : null;
                                    }
                                }
                            }
                            return ShippingOptionsClass;
                        })();
                        Controls.ShippingOptionsClass = ShippingOptionsClass;

                        var ItemShippingOptionsClass = (function () {
                            function ItemShippingOptionsClass(o) {
                                o = o || {};
                                this.LineId = o.LineId;
                                this.ShippingOptions = o.ShippingOptions;
                            }
                            return ItemShippingOptionsClass;
                        })();
                        Controls.ItemShippingOptionsClass = ItemShippingOptionsClass;

                        var ShippingOptionResponseClass = (function () {
                            function ShippingOptionResponseClass(o) {
                                o = o || {};
                                this.OrderShippingOptions = o.OrderShippingOptions;
                                if (o.ItemShippingOptions) {
                                    this.ItemShippingOptions = [];
                                    for (var i = 0; i < o.ItemShippingOptions.length; i++) {
                                        this.ItemShippingOptions[i] = o.ItemShippingOptions[i] ? new ItemShippingOptionsClass(o.ItemShippingOptions[i]) : null;
                                    }
                                }
                                if (o.Errors) {
                                    this.Errors = [];
                                    for (var i = 0; i < o.Errors.length; i++) {
                                        this.Errors[i] = o.Errors[i] ? new ErrorClass(o.Errors[i]) : null;
                                    }
                                }
                            }
                            return ShippingOptionResponseClass;
                        })();
                        Controls.ShippingOptionResponseClass = ShippingOptionResponseClass;

                        var LineDeliveryPreferenceClass = (function () {
                            function LineDeliveryPreferenceClass(o) {
                                o = o || {};
                                this.LineId = o.LineId;
                                this.DeliveryPreferenceTypes = o.DeliveryPreferenceTypes;
                            }
                            return LineDeliveryPreferenceClass;
                        })();
                        Controls.LineDeliveryPreferenceClass = LineDeliveryPreferenceClass;

                        var CartDeliveryPreferencesClass = (function () {
                            function CartDeliveryPreferencesClass(o) {
                                o = o || {};
                                this.HeaderDeliveryPreferenceTypes = o.HeaderDeliveryPreferenceTypes;
                                if (o.LineDeliveryPreferences) {
                                    this.LineDeliveryPreferences = [];
                                    for (var i = 0; i < o.LineDeliveryPreferences.length; i++) {
                                        this.LineDeliveryPreferences[i] = o.LineDeliveryPreferences[i] ? new LineDeliveryPreferenceClass(o.LineDeliveryPreferences[i]) : null;
                                    }
                                }
                            }
                            return CartDeliveryPreferencesClass;
                        })();
                        Controls.CartDeliveryPreferencesClass = CartDeliveryPreferencesClass;

                        var DeliveryOptionClass = (function () {
                            function DeliveryOptionClass(o) {
                                o = o || {};
                                this.Id = o.Id;
                                this.Description = o.Description;
                            }
                            return DeliveryOptionClass;
                        })();
                        Controls.DeliveryOptionClass = DeliveryOptionClass;

                        var LineDeliveryOptionClass = (function () {
                            function LineDeliveryOptionClass(o) {
                                o = o || {};
                                this.LineId = o.LineId;
                                if (o.DeliveryOptions) {
                                    this.DeliveryOptions = [];
                                    for (var i = 0; i < o.DeliveryOptions.length; i++) {
                                        this.DeliveryOptions[i] = o.DeliveryOptions[i] ? new DeliveryOptionClass(o.DeliveryOptions[i]) : null;
                                    }
                                }
                            }
                            return LineDeliveryOptionClass;
                        })();
                        Controls.LineDeliveryOptionClass = LineDeliveryOptionClass;

                        var DeliveryOptionsResponseClass = (function () {
                            function DeliveryOptionsResponseClass(o) {
                                o = o || {};
                                if (o.DeliveryOptions) {
                                    this.DeliveryOptions = [];
                                    for (var i = 0; i < o.DeliveryOptions.length; i++) {
                                        this.DeliveryOptions[i] = o.DeliveryOptions[i] ? new DeliveryOptionClass(o.DeliveryOptions[i]) : null;
                                    }
                                }
                                if (o.LineDeliveryOptions) {
                                    this.LineDeliveryOptions = [];
                                    for (var i = 0; i < o.LineDeliveryOptions.length; i++) {
                                        this.LineDeliveryOptions[i] = o.LineDeliveryOptions[i] ? new LineDeliveryOptionClass(o.LineDeliveryOptions[i]) : null;
                                    }
                                }
                                if (o.Errors) {
                                    this.Errors = [];
                                    for (var i = 0; i < o.Errors.length; i++) {
                                        this.Errors[i] = o.Errors[i] ? new ErrorClass(o.Errors[i]) : null;
                                    }
                                }
                            }
                            return DeliveryOptionsResponseClass;
                        })();
                        Controls.DeliveryOptionsResponseClass = DeliveryOptionsResponseClass;

                        var PaymentCardTypeClass = (function () {
                            function PaymentCardTypeClass(o) {
                                o = o || {};
                                this.Id = o.Id;
                                this.CardType = o.CardType;
                            }
                            return PaymentCardTypeClass;
                        })();
                        Controls.PaymentCardTypeClass = PaymentCardTypeClass;

                        var PaymentCardTypesResponseClass = (function () {
                            function PaymentCardTypesResponseClass(o) {
                                o = o || {};
                                if (o.CardTypes) {
                                    this.CardTypes = [];
                                    for (var i = 0; i < o.CardTypes.length; i++) {
                                        this.CardTypes[i] = o.CardTypes[i] ? new PaymentCardTypeClass(o.CardTypes[i]) : null;
                                    }
                                }
                                if (o.Errors) {
                                    this.Errors = [];
                                    for (var i = 0; i < o.Errors.length; i++) {
                                        this.Errors[i] = o.Errors[i] ? new ErrorClass(o.Errors[i]) : null;
                                    }
                                }
                            }
                            return PaymentCardTypesResponseClass;
                        })();
                        Controls.PaymentCardTypesResponseClass = PaymentCardTypesResponseClass;

                        var AddressClass = (function () {
                            function AddressClass(o) {
                                o = o || {};
                                this.Country = o.Country;
                                this.State = o.State;
                                this.County = o.County;
                                this.City = o.City;
                                this.DistrictName = o.DisstrictName;
                                this.AttentionTo = o.AttentionTo;
                                this.Name = o.Name;
                                this.Street = o.Street;
                                this.StreetNumber = o.StreetNumber;
                                this.ZipCode = o.ZipCode;
                                this.Phone = o.Phone;
                                this.Email = o.Email;
                                this.RecordId = o.RecordId;
                                this.Deactivate = o.Deactivate;
                                this.IsPrimary = o.IsPrimary;
                                this.AddressType = o.AddressType;
                                this.AddressFriendlyName = o.AddressFriendlyName;
                            }
                            return AddressClass;
                        })();
                        Controls.AddressClass = AddressClass;

                        var AddressCollectionResponseClass = (function () {
                            function AddressCollectionResponseClass(o) {
                                o = o || {};
                                if (o.Addresses) {
                                    this.Addresses = [];
                                    for (var i = 0; i < o.Addresses.length; i++) {
                                        this.Addresses[i] = o.Addresses[i] ? new AddressClass(o.Addresses[i]) : null;
                                    }
                                }
                                if (o.Errors) {
                                    this.Errors = [];
                                    for (var i = 0; i < o.Errors.length; i++) {
                                        this.Errors[i] = o.Errors[i] ? new ErrorClass(o.Errors[i]) : null;
                                    }
                                }
                            }
                            return AddressCollectionResponseClass;
                        })();
                        Controls.AddressCollectionResponseClass = AddressCollectionResponseClass;

                        var PaymentClass = (function () {
                            function PaymentClass(o) {
                                o = o || {};
                                this.PaymentAddress = o.PaymentAddress;
                                this.CardNumber = o.CardNumber;
                                this.CardType = o.CardType;
                                this.CCID = o.CCID;
                                this.ExpirationMonth = o.ExpirationMonth;
                                this.ExpirationYear = o.ExpirationYear;
                                this.NameOnCard = o.NameOnCard;
                                this.LoyaltyCardId = o.LoyaltyCardId;
                                this.DiscountCode = o.DiscountCode;
                            }
                            return PaymentClass;
                        })();
                        Controls.PaymentClass = PaymentClass;

                        var TokenizedPaymentCardClass = (function () {
                            function TokenizedPaymentCardClass(o) {
                                o = o || {};
                                this.PaymentAddress = o.PaymentAddress;
                                this.CardType = o.CardType;
                                this.ExpirationMonth = o.ExpirationMonth;
                                this.ExpirationYear = o.ExpirationYear;
                                this.NameOnCard = o.NameOnCard;
                                this.CardToken = o.CardToken;
                                this.UniqueCardId = o.UniqueCardId;
                                this.MaskedCardNumber = o.MaskedCardNumber;
                            }
                            return TokenizedPaymentCardClass;
                        })();
                        Controls.TokenizedPaymentCardClass = TokenizedPaymentCardClass;

                        var ErrorClass = (function () {
                            function ErrorClass(o) {
                                o = o || {};
                                this.ErrorCode = o.ErrorCode;
                                this.ErrorMessage = o.ErrorMessage;
                            }
                            return ErrorClass;
                        })();
                        Controls.ErrorClass = ErrorClass;

                        var CreateSalesOrderResponseClass = (function () {
                            function CreateSalesOrderResponseClass(o) {
                                o = o || {};
                                this.OrderNumber = o.OrderNumber;
                                if (o.Errors) {
                                    this.Errors = [];
                                    for (var i = 0; i < o.Errors.length; i++) {
                                        this.Errors[i] = o.Errors[i] ? new ErrorClass(o.Errors[i]) : null;
                                    }
                                }
                            }
                            return CreateSalesOrderResponseClass;
                        })();
                        Controls.CreateSalesOrderResponseClass = CreateSalesOrderResponseClass;

                        var StoreProductAvailabilityItemClass = (function () {
                            function StoreProductAvailabilityItemClass(o) {
                                o = o || {};
                                this.RecordId = o.RecordId;
                                this.ItemId = o.ItemId;
                                this.VariantInventoryDimensionId = o.VariantInventoryDimensionId;
                                this.WarehouseInventoryDimensionId = o.WarehouseInventoryDimensionId;
                                this.InventoryLocationId = o.InventoryLocationId;
                                this.AvailableQuantity = o.AvailableQuantity;
                                this.ProductDetails = o.ProductDetails;
                            }
                            return StoreProductAvailabilityItemClass;
                        })();
                        Controls.StoreProductAvailabilityItemClass = StoreProductAvailabilityItemClass;

                        var StoreProductAvailabilityClass = (function () {
                            function StoreProductAvailabilityClass(o) {
                                o = o || {};
                                this.ChannelId = o.ChannelId;
                                this.Latitude = o.Latitude;
                                this.Longitude = o.Longitude;
                                this.Distance = o.Distance;
                                this.InventoryLocationId = o.InventoryLocationId;
                                this.StoreId = o.StoreId;
                                this.StoreName = o.StoreName;
                                this.PostalAddressId = o.PostalAddressId;
                                if (o.ProductAvailabilities) {
                                    this.ProductAvailabilities = [];
                                    for (var i = 0; i < o.ProductAvailabilities.length; i++) {
                                        this.ProductAvailabilities[i] = o.ProductAvailabilities[i] ? new StoreProductAvailabilityItemClass(o.ProductAvailabilities[i]) : null;
                                    }
                                }
                                this.SelectDisabled = o.SelectDisabled;
                                this.Country = o.Country;
                                this.State = o.State;
                                this.County = o.County;
                                this.City = o.City;
                                this.DistrictName = o.DisstrictName;
                                this.AttentionTo = o.AttentionTo;
                                this.Name = o.Name;
                                this.Street = o.Street;
                                this.StreetNumber = o.StreetNumber;
                                this.ZipCode = o.ZipCode;
                                this.Phone = o.Phone;
                                this.Email = o.EMail;
                                this.RecordId = o.RecordId;
                                this.Deactivate = o.Deactivate;
                                this.IsPrimary = o.IsPrimary;
                                this.AddressType = o.AddressType;
                                this.AddressFriendlyName = o.AddressFriendlyName;
                                this.AreItemsAvailableInStore = o.AreItemsAvailableInStore;
                            }
                            return StoreProductAvailabilityClass;
                        })();
                        Controls.StoreProductAvailabilityClass = StoreProductAvailabilityClass;

                        var StoreLocationClass = (function () {
                            function StoreLocationClass(o) {
                                o = o || {};
                                this.ChannelId = o.ChannelId;
                                this.Latitude = o.Latitude;
                                this.Longitude = o.Longitude;
                                this.Distance = o.Distance;
                                this.InventoryLocationId = o.InventoryLocationId;
                                this.StoreId = o.StoreId;
                                this.StoreName = o.StoreName;
                                this.PostalAddressId = o.PostalAddressId;
                                this.Country = o.Country;
                                this.State = o.State;
                                this.County = o.County;
                                this.City = o.City;
                                this.DistrictName = o.DisstrictName;
                                this.AttentionTo = o.AttentionTo;
                                this.Name = o.Name;
                                this.Street = o.Street;
                                this.StreetNumber = o.StreetNumber;
                                this.ZipCode = o.ZipCode;
                                this.Phone = o.Phone;
                                this.Email = o.EMail;
                                this.RecordId = o.RecordId;
                                this.Deactivate = o.Deactivate;
                                this.IsPrimary = o.IsPrimary;
                                this.AddressType = o.AddressType;
                                this.AddressFriendlyName = o.AddressFriendlyName;
                            }
                            return StoreLocationClass;
                        })();
                        Controls.StoreLocationClass = StoreLocationClass;

                        var CountryInfoClass = (function () {
                            function CountryInfoClass(o) {
                                o = o || {};
                                this.CountryCode = o.CountryCode;
                                this.CountryName = o.CountryName;
                            }
                            return CountryInfoClass;
                        })();
                        Controls.CountryInfoClass = CountryInfoClass;

                        var TenderDataLineClass = (function () {
                            function TenderDataLineClass(o) {
                                o = o || {};
                                this.Amount = o.Amount;
                                this.GiftCardId = o.GiftCardId;
                                this.LoyaltyCardId = o.LoyaltyCardId;
                                this.PaymentCard = o.PaymentCard;
                            }
                            return TenderDataLineClass;
                        })();
                        Controls.TenderDataLineClass = TenderDataLineClass;

                        var DeliveryPreferenceResponseClass = (function () {
                            function DeliveryPreferenceResponseClass(o) {
                                o = o || {};
                                this.CartDeliveryPreferences = o.CartDeliveryPreferences ? new CartDeliveryPreferencesClass(o.CartDeliveryPreferences) : null;
                                if (o.Errors) {
                                    this.Errors = [];
                                    for (var i = 0; i < o.Errors.length; i++) {
                                        this.Errors[i] = o.Errors[i] ? new ErrorClass(o.Errors[i]) : null;
                                    }
                                }
                            }
                            return DeliveryPreferenceResponseClass;
                        })();
                        Controls.DeliveryPreferenceResponseClass = DeliveryPreferenceResponseClass;

                        var StoreProductAvailabilityResponseClass = (function () {
                            function StoreProductAvailabilityResponseClass(o) {
                                o = o || {};
                                if (o.Stores) {
                                    this.Stores = [];
                                    for (var i = 0; i < o.Stores.length; i++) {
                                        this.Stores[i] = o.Stores[i] ? new StoreProductAvailabilityClass(o.Stores[i]) : null;
                                    }
                                }
                                if (o.Errors) {
                                    this.Errors = [];
                                    for (var i = 0; i < o.Errors.length; i++) {
                                        this.Errors[i] = o.Errors[i] ? new ErrorClass(o.Errors[i]) : null;
                                    }
                                }
                            }
                            return StoreProductAvailabilityResponseClass;
                        })();
                        Controls.StoreProductAvailabilityResponseClass = StoreProductAvailabilityResponseClass;

                        var StoreLocationResponseClass = (function () {
                            function StoreLocationResponseClass(o) {
                                o = o || {};
                                if (o.Stores) {
                                    this.Stores = [];
                                    for (var i = 0; i < o.Stores.length; i++) {
                                        this.Stores[i] = o.Stores[i] ? new StoreLocationClass(o.Stores[i]) : null;
                                    }
                                }
                                if (o.Errors) {
                                    this.Errors = [];
                                    for (var i = 0; i < o.Errors.length; i++) {
                                        this.Errors[i] = o.Errors[i] ? new ErrorClass(o.Errors[i]) : null;
                                    }
                                }
                            }
                            return StoreLocationResponseClass;
                        })();
                        Controls.StoreLocationResponseClass = StoreLocationResponseClass;

                        var CountryInfoResponseClass = (function () {
                            function CountryInfoResponseClass(o) {
                                o = o || {};
                                if (o.Countries) {
                                    this.Countries = [];
                                    for (var i = 0; i < o.Countries.length; i++) {
                                        this.Countries[i] = o.Countries[i] ? new CountryInfoClass(o.Countries[i]) : null;
                                    }
                                }
                                if (o.Errors) {
                                    this.Errors = [];
                                    for (var i = 0; i < o.Errors.length; i++) {
                                        this.Errors[i] = o.Errors[i] ? new ErrorClass(o.Errors[i]) : null;
                                    }
                                }
                            }
                            return CountryInfoResponseClass;
                        })();
                        Controls.CountryInfoResponseClass = CountryInfoResponseClass;

                        var BooleanResponseClass = (function () {
                            function BooleanResponseClass(o) {
                                o = o || {};
                                this.IsTrue = o.IsTrue;
                                if (o.Errors) {
                                    this.Errors = [];
                                    for (var i = 0; i < o.Errors.length; i++) {
                                        this.Errors[i] = o.Errors[i] ? new ErrorClass(o.Errors[i]) : null;
                                    }
                                }
                            }
                            return BooleanResponseClass;
                        })();
                        Controls.BooleanResponseClass = BooleanResponseClass;

                        var StringResponseClass = (function () {
                            function StringResponseClass(o) {
                                o = o || {};
                                this.Value = o.Value;
                                if (o.Errors) {
                                    this.Errors = [];
                                    for (var i = 0; i < o.Errors.length; i++) {
                                        this.Errors[i] = o.Errors[i] ? new ErrorClass(o.Errors[i]) : null;
                                    }
                                }
                            }
                            return StringResponseClass;
                        })();
                        Controls.StringResponseClass = StringResponseClass;

                        var TenderTypesResponseClass = (function () {
                            function TenderTypesResponseClass(o) {
                                o = o || {};
                                this.HasCreditCardPayment = o.HasCreditCardPayment;
                                this.HasGiftCardPayment = o.HasGiftCardPayment;
                                this.HasLoyaltyCardPayment = o.HasLoyaltyCardPayment;
                                if (o.Errors) {
                                    this.Errors = [];
                                    for (var i = 0; i < o.Errors.length; i++) {
                                        this.Errors[i] = o.Errors[i] ? new ErrorClass(o.Errors[i]) : null;
                                    }
                                }
                            }
                            return TenderTypesResponseClass;
                        })();
                        Controls.TenderTypesResponseClass = TenderTypesResponseClass;

                        var GiftCardInformationClass = (function () {
                            function GiftCardInformationClass(o) {
                                o = o || {};
                                this.GiftCardId = o.GiftCardId;
                                this.Balance = o.Balance;
                                this.CurrencyCode = o.CurrencyCode;
                                this.IsInfoAvailable = o.IsInfoAvailable;
                            }
                            return GiftCardInformationClass;
                        })();
                        Controls.GiftCardInformationClass = GiftCardInformationClass;

                        var GiftCardResponseClass = (function () {
                            function GiftCardResponseClass(o) {
                                o = o || {};
                                this.GiftCardInformation = o.GiftCardInformation;
                                if (o.Errors) {
                                    this.Errors = [];
                                    for (var i = 0; i < o.Errors.length; i++) {
                                        this.Errors[i] = o.Errors[i] ? new ErrorClass(o.Errors[i]) : null;
                                    }
                                }
                            }
                            return GiftCardResponseClass;
                        })();
                        Controls.GiftCardResponseClass = GiftCardResponseClass;

                        var LoyaltyCardClass = (function () {
                            function LoyaltyCardClass(o) {
                                o = o || {};
                                this.CardNumber = o.CardNumber;
                                this.CardTenderType = o.CardTenderType;
                            }
                            return LoyaltyCardClass;
                        })();
                        Controls.LoyaltyCardClass = LoyaltyCardClass;

                        var LoyaltyCardsResponseClass = (function () {
                            function LoyaltyCardsResponseClass(o) {
                                o = o || {};
                                this.LoyaltyCards = [];
                                for (var i = 0; i < o.LoyaltyCards.length; i++) {
                                    this.LoyaltyCards[i] = o.LoyaltyCards[i] ? new LoyaltyCardClass(o.LoyaltyCards[i]) : null;
                                }
                                if (o.Errors) {
                                    this.Errors = [];
                                    for (var i = 0; i < o.Errors.length; i++) {
                                        this.Errors[i] = o.Errors[i] ? new ErrorClass(o.Errors[i]) : null;
                                    }
                                }
                            }
                            return LoyaltyCardsResponseClass;
                        })();
                        Controls.LoyaltyCardsResponseClass = LoyaltyCardsResponseClass;

                        var StateProvinceInfoClass = (function () {
                            function StateProvinceInfoClass(o) {
                                o = o || {};
                                this.CountryRegionId = o.CountryRegionId;
                                this.StateId = o.StateId;
                                this.StateName = o.StateName;
                            }
                            return StateProvinceInfoClass;
                        })();
                        Controls.StateProvinceInfoClass = StateProvinceInfoClass;

                        var StateProvinceInfoResponseClass = (function () {
                            function StateProvinceInfoResponseClass(o) {
                                o = o || {};
                                if (o.Countries) {
                                    this.StateProvinces = [];
                                    for (var i = 0; i < o.StateProvinces.length; i++) {
                                        this.StateProvinces[i] = o.StateProvinces[i] ? new StateProvinceInfoClass(o.StateProvinces[i]) : null;
                                    }
                                }
                                if (o.Errors) {
                                    this.Errors = [];
                                    for (var i = 0; i < o.Errors.length; i++) {
                                        this.Errors[i] = o.Errors[i] ? new ErrorClass(o.Errors[i]) : null;
                                    }
                                }
                            }
                            return StateProvinceInfoResponseClass;
                        })();
                        Controls.StateProvinceInfoResponseClass = StateProvinceInfoResponseClass;
                    })(Sdk.Controls || (Sdk.Controls = {}));
                    var Controls = Sdk.Controls;
                })(Ecommerce.Sdk || (Ecommerce.Sdk = {}));
                var Sdk = Ecommerce.Sdk;
            })(Retail.Ecommerce || (Retail.Ecommerce = {}));
            var Ecommerce = Retail.Ecommerce;
        })(Dynamics.Retail || (Dynamics.Retail = {}));
        var Retail = Dynamics.Retail;
    })(Microsoft.Dynamics || (Microsoft.Dynamics = {}));
    var Dynamics = Microsoft.Dynamics;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (Dynamics) {
        (function (Retail) {
            (function (Ecommerce) {
                (function (Sdk) {
                    (function (Controls) {
                        "use strict";

                        Controls.ResourceStrings = {};
                        Controls.Resources = {};

                        var ResourcesHandler = (function () {
                            function ResourcesHandler() {
                            }
                            ResourcesHandler.selectUICulture = function () {
                                var uiCultureFromCookie = Microsoft.Utils.getCurrentUiCulture();

                                if (Controls.ResourceStrings[uiCultureFromCookie]) {
                                    Controls.Resources = Controls.ResourceStrings[uiCultureFromCookie];
                                } else {
                                    Controls.Resources = Controls.ResourceStrings["en-us"];
                                }
                            };
                            return ResourcesHandler;
                        })();
                        Controls.ResourcesHandler = ResourcesHandler;
                    })(Sdk.Controls || (Sdk.Controls = {}));
                    var Controls = Sdk.Controls;
                })(Ecommerce.Sdk || (Ecommerce.Sdk = {}));
                var Sdk = Ecommerce.Sdk;
            })(Retail.Ecommerce || (Retail.Ecommerce = {}));
            var Ecommerce = Retail.Ecommerce;
        })(Dynamics.Retail || (Dynamics.Retail = {}));
        var Retail = Dynamics.Retail;
    })(Microsoft.Dynamics || (Microsoft.Dynamics = {}));
    var Dynamics = Microsoft.Dynamics;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (Dynamics) {
        (function (Retail) {
            (function (Ecommerce) {
                (function (Sdk) {
                    (function (Controls) {
                        "use strict";

                        var MiniCart = (function () {
                            function MiniCart(element) {
                                var _this = this;
                                this._cartView = $(element);
                                this.loading = ko.observable(false);
                                this.errorMessage = ko.observable('');
                                this.errorPanel = this._cartView.find(" .msax-ErrorPanel");
                                this._miniCart = this._cartView.find(" > .msax-MiniCart");
                                this.isCheckoutCart = ko.observable(Microsoft.Utils.isNullOrUndefined(msaxValues.msax_IsCheckoutCart) ? false : msaxValues.msax_IsCheckoutCart.toLowerCase() == "true");

                                if (!this.isCheckoutCart()) {
                                    this.getShoppingCart();
                                }

                                var cart = new Controls.ShoppingCartClass(null);
                                cart.Items = [];
                                cart.DiscountCodes = [];
                                this.cart = ko.observable(cart);

                                if (this.isCheckoutCart()) {
                                    Controls.ShoppingCartService.OnUpdateCheckoutCart(this, this.updateCart);
                                } else {
                                    Controls.ShoppingCartService.OnUpdateShoppingCart(this, this.updateCart);
                                }

                                this._cartView.keypress(function (event) {
                                    if (event.keyCode == 13 || event.keyCode == 8 || event.keyCode == 27) {
                                        event.preventDefault();
                                        return false;
                                    }

                                    return true;
                                });

                                this.isShoppingCartEnabled = ko.computed(function () {
                                    return !Microsoft.Utils.isNullOrUndefined(_this.cart()) && Microsoft.Utils.hasElements(_this.cart().Items);
                                });
                            }
                            MiniCart.prototype.getResx = function (key) {
                                return Controls.Resources[key];
                            };

                            MiniCart.prototype.shoppingCartNextClick = function (viewModel, event) {
                                if (!Microsoft.Utils.isNullOrWhiteSpace(msaxValues.msax_CheckoutUrl)) {
                                    window.location.href = msaxValues.msax_CheckoutUrl;
                                }
                            };

                            MiniCart.prototype.disableUserActions = function () {
                                this.loading(true);
                                this._cartView.find('*').disabled = true;
                            };

                            MiniCart.prototype.enableUserActions = function () {
                                this.loading(false);
                                this._cartView.find('*').disabled = false;
                            };

                            MiniCart.prototype.showError = function (isError) {
                                if (isError) {
                                    this.errorPanel.addClass("msax-Error");
                                } else if (this.errorPanel.hasClass("msax-Error")) {
                                    this.errorPanel.removeClass("msax-Error");
                                }

                                this.errorPanel.show();
                                $(window).scrollTop(0);
                            };

                            MiniCart.prototype.viewCartClick = function () {
                                if (!Microsoft.Utils.isNullOrWhiteSpace(msaxValues.msax_ShoppingCartUrl)) {
                                    window.location.href = msaxValues.msax_ShoppingCartUrl;
                                }
                            };

                            MiniCart.prototype.showMiniCart = function () {
                                this.toggleCartDisplay(true);
                            };

                            MiniCart.prototype.hideMiniCart = function () {
                                this.toggleCartDisplay(false);
                            };

                            MiniCart.prototype.toggleCartDisplay = function (show) {
                                var locationOffScreen = -250;

                                if (this.isShoppingCartEnabled()) {
                                    locationOffScreen = locationOffScreen * this.cart().Items.length;
                                }

                                if (show) {
                                    this.isMiniCartVisible = false;

                                    setTimeout($.proxy(function () {
                                        if (!this.isMiniCartVisible) {
                                            this._miniCart.animate({ top: 45 }, 300, 'linear');
                                        }
                                    }, this), 500);
                                } else {
                                    this.isMiniCartVisible = true;

                                    setTimeout($.proxy(function () {
                                        if (this.isMiniCartVisible) {
                                            this._miniCart.animate({ top: locationOffScreen }, 300);
                                        }
                                    }, this), 500);
                                }
                            };

                            MiniCart.prototype.updateCart = function (event, data) {
                                if (!Microsoft.Utils.isNullOrUndefined(data.Errors) && data.Errors.length > 0) {
                                    this.errorMessage(data.Errors[0].ErrorMessage);
                                    this.showError(true);
                                } else {
                                    this.cart(data.ShoppingCart);
                                }

                                this.hideMiniCart();
                            };

                            MiniCart.prototype.getShoppingCart = function () {
                                var _this = this;
                                this.disableUserActions();

                                Controls.ShoppingCartService.GetShoppingCart(false, Controls.ShoppingCartDataLevel.All).done(function (data) {
                                    _this.enableUserActions();
                                    _this.errorPanel.hide();
                                }).fail(function (errors) {
                                    _this.errorMessage(Controls.Resources.String_63);
                                    _this.showError(true);
                                    _this.enableUserActions();
                                });
                            };

                            MiniCart.prototype.removeFromCartClick = function (item) {
                                var _this = this;
                                this.disableUserActions();

                                Controls.ShoppingCartService.RemoveFromCart(this.isCheckoutCart(), item.LineId, Controls.ShoppingCartDataLevel.All).done(function (data) {
                                    _this.enableUserActions();
                                    _this.errorPanel.hide();
                                }).fail(function (errors) {
                                    _this.errorMessage(Controls.Resources.String_64);
                                    _this.showError(true);
                                    _this.enableUserActions();
                                });
                            };
                            return MiniCart;
                        })();
                        Controls.MiniCart = MiniCart;
                    })(Sdk.Controls || (Sdk.Controls = {}));
                    var Controls = Sdk.Controls;
                })(Ecommerce.Sdk || (Ecommerce.Sdk = {}));
                var Sdk = Ecommerce.Sdk;
            })(Retail.Ecommerce || (Retail.Ecommerce = {}));
            var Ecommerce = Retail.Ecommerce;
        })(Dynamics.Retail || (Dynamics.Retail = {}));
        var Retail = Dynamics.Retail;
    })(Microsoft.Dynamics || (Microsoft.Dynamics = {}));
    var Dynamics = Microsoft.Dynamics;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (Dynamics) {
        (function (Retail) {
            (function (Ecommerce) {
                (function (Sdk) {
                    (function (Controls) {
                        "use strict";

                        var Cart = (function () {
                            function Cart(element) {
                                var _this = this;
                                this._cartView = $(element);
                                this.errorMessage = ko.observable('');
                                this.errorPanel = this._cartView.find(" > .msax-ErrorPanel");
                                this.kitCartItemTypeValue = ko.observable(Controls.TransactionItemType.Kit);
                                this._editRewardCardDialog = this._cartView.find('.msax-EditRewardCard');
                                this._loadingDialog = this._cartView.find('.msax-Loading');
                                this._loadingText = this._loadingDialog.find('.msax-LoadingText');
                                Controls.LoadingOverlay.CreateLoadingDialog(this._loadingDialog, 200, 200);

                                this.supportDiscountCodes = ko.observable(Microsoft.Utils.isNullOrUndefined(msaxValues.msax_CartDiscountCodes) ? true : msaxValues.msax_CartDiscountCodes.toLowerCase() == "true");
                                this.supportLoyaltyReward = ko.observable(Microsoft.Utils.isNullOrUndefined(msaxValues.msax_CartLoyaltyReward) ? true : msaxValues.msax_CartLoyaltyReward.toLowerCase() == "true");
                                this.displayPromotionBanner = ko.observable(Microsoft.Utils.isNullOrUndefined(msaxValues.msax_CartDisplayPromotionBanner) ? true : msaxValues.msax_CartDisplayPromotionBanner.toLowerCase() == "true");

                                if (this.displayPromotionBanner()) {
                                    this.getPromotions();
                                } else {
                                    this.getShoppingCart();
                                }

                                var cart = new Controls.ShoppingCartClass(null);
                                cart.Items = [];
                                cart.DiscountCodes = [];
                                this.cart = ko.observable(cart);

                                Controls.ShoppingCartService.OnUpdateShoppingCart(this, this.updateShoppingCart);

                                this._cartView.keypress(function (event) {
                                    if (event.keyCode == 13 || event.keyCode == 8 || event.keyCode == 27) {
                                        event.preventDefault();
                                        return false;
                                    }

                                    return true;
                                });

                                this.isShoppingCartEnabled = ko.computed(function () {
                                    return !Microsoft.Utils.isNullOrUndefined(_this.cart()) && Microsoft.Utils.hasElements(_this.cart().Items);
                                });

                                this.isPromotionCodesEnabled = ko.computed(function () {
                                    return !Microsoft.Utils.isNullOrUndefined(_this.cart()) && Microsoft.Utils.hasElements(_this.cart().DiscountCodes);
                                });
                            }
                            Cart.prototype.getResx = function (key) {
                                return Controls.Resources[key];
                            };

                            Cart.prototype.shoppingCartNextClick = function (viewModel, event) {
                                if (!Microsoft.Utils.isNullOrWhiteSpace(msaxValues.msax_CheckoutUrl)) {
                                    window.location.href = msaxValues.msax_CheckoutUrl;
                                }
                            };

                            Cart.prototype.quantityMinusClick = function (item) {
                                if (item.Quantity == 1) {
                                    this.removeFromCartClick(item);
                                } else {
                                    item.Quantity = item.Quantity - 1;
                                    this.updateQuantity([item]);
                                }
                            };

                            Cart.prototype.quantityPlusClick = function (item) {
                                item.Quantity = item.Quantity + 1;
                                this.updateQuantity([item]);
                            };

                            Cart.prototype.quantityTextBoxChanged = function (item, valueAccesor) {
                                var srcElement = valueAccesor.target;
                                if (!Microsoft.Utils.isNullOrUndefined(srcElement) && srcElement.value != item.Quantity) {
                                    item.Quantity = srcElement.value;
                                    if (item.Quantity < 0) {
                                        item.Quantity = 1;
                                    }

                                    if (item.Quantity == 0) {
                                        this.removeFromCartClick(item);
                                    } else {
                                        this.updateQuantity([item]);
                                    }
                                }
                            };

                            Cart.prototype.showError = function (isError) {
                                if (isError) {
                                    this.errorPanel.addClass("msax-Error");
                                } else if (this.errorPanel.hasClass("msax-Error")) {
                                    this.errorPanel.removeClass("msax-Error");
                                }

                                this.errorPanel.show();
                                $(window).scrollTop(0);
                            };

                            Cart.prototype.editRewardCardOverlayClick = function () {
                                this.dialogOverlay = $('.ui-widget-overlay');
                                this.dialogOverlay.on('click', $.proxy(this.closeEditRewardCardDialog, this));
                            };

                            Cart.prototype.createEditRewardCardDialog = function () {
                                this._editRewardCardDialog.dialog({
                                    modal: true,
                                    title: Controls.Resources.String_186,
                                    autoOpen: false,
                                    draggable: true,
                                    resizable: false,
                                    position: ['top', 100],
                                    show: { effect: "fadeIn", duration: 500 },
                                    hide: { effect: "fadeOut", duration: 500 },
                                    width: 500,
                                    height: 300,
                                    dialogClass: 'msax-Control'
                                });
                            };

                            Cart.prototype.showEditRewardCardDialog = function () {
                                $('.ui-dialog-titlebar-close').on('click', $.proxy(this.closeEditRewardCardDialog, this));

                                this._editRewardCardDialog.dialog('open');
                                this.editRewardCardOverlayClick();
                            };

                            Cart.prototype.closeEditRewardCardDialog = function () {
                                this._editRewardCardDialog.dialog('close');
                            };

                            Cart.prototype.continueShoppingClick = function () {
                                if (!Microsoft.Utils.isNullOrWhiteSpace(msaxValues.msax_ContinueShoppingUrl)) {
                                    window.location.href = msaxValues.msax_ContinueShoppingUrl;
                                }
                            };

                            Cart.prototype.updateShoppingCart = function (event, data) {
                                if (!Microsoft.Utils.isNullOrUndefined(data.Errors) && data.Errors.length > 0) {
                                    this.errorMessage(data.Errors[0].ErrorMessage);
                                    this.showError(true);
                                } else {
                                    this.cart(data.ShoppingCart);
                                    this.errorPanel.hide();
                                }
                            };

                            Cart.prototype.getShoppingCart = function () {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText);

                                Controls.ShoppingCartService.GetShoppingCart(false, Controls.ShoppingCartDataLevel.All).done(function (data) {
                                    _this.createEditRewardCardDialog();
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                }).fail(function (errors) {
                                    _this.errorMessage(Controls.Resources.String_63);
                                    _this.showError(true);
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                });
                            };

                            Cart.prototype.getPromotions = function () {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText);

                                Controls.ShoppingCartService.GetPromotions(false, Controls.ShoppingCartDataLevel.All).done(function (data) {
                                    _this.createEditRewardCardDialog();
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                }).fail(function (errors) {
                                    _this.errorMessage(Controls.Resources.String_177);
                                    _this.showError(true);
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                });
                            };

                            Cart.prototype.removeFromCartClick = function (item) {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText, Controls.Resources.String_179);

                                Controls.ShoppingCartService.RemoveFromCart(false, item.LineId, Controls.ShoppingCartDataLevel.All).done(function (data) {
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);

                                    if (_this.displayPromotionBanner()) {
                                        _this.getPromotions();
                                    }
                                }).fail(function (errors) {
                                    _this.errorMessage(Controls.Resources.String_64);
                                    _this.showError(true);
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                });
                            };

                            Cart.prototype.updateQuantity = function (items) {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText, Controls.Resources.String_179);

                                Controls.ShoppingCartService.UpdateQuantity(false, items, Controls.ShoppingCartDataLevel.All).done(function (data) {
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);

                                    if (_this.displayPromotionBanner()) {
                                        _this.getPromotions();
                                    }
                                }).fail(function (errors) {
                                    _this.errorMessage(Controls.Resources.String_65);
                                    _this.showError(true);
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                });
                            };

                            Cart.prototype.applyPromotionCode = function (cart, valueAccesor) {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText, Controls.Resources.String_179);
                                var srcElement = valueAccesor.target;

                                if (!Microsoft.Utils.isNullOrUndefined(srcElement) && !Microsoft.Utils.isNullOrUndefined(srcElement.parentElement) && !Microsoft.Utils.isNullOrUndefined(srcElement.parentElement.firstElementChild)) {
                                    if (!Microsoft.Utils.isNullOrWhiteSpace(srcElement.parentElement.firstElementChild.value)) {
                                        var promoCode = srcElement.parentElement.firstElementChild.value;

                                        Controls.ShoppingCartService.AddOrRemovePromotion(false, promoCode, true, Controls.ShoppingCartDataLevel.All).done(function (data) {
                                            Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);

                                            if (_this.displayPromotionBanner()) {
                                                _this.getPromotions();
                                            }
                                        }).fail(function (errors) {
                                            _this.errorMessage(Controls.Resources.String_93);
                                            _this.showError(true);
                                            Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                        });
                                    } else {
                                        this.errorMessage(Controls.Resources.String_97);
                                        this.showError(true);
                                        Controls.LoadingOverlay.CloseLoadingDialog(this._loadingDialog);
                                    }
                                } else {
                                    Controls.LoadingOverlay.CloseLoadingDialog(this._loadingDialog);
                                }
                            };

                            Cart.prototype.removePromotionCode = function (cart, valueAccesor) {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText, Controls.Resources.String_179);
                                var srcElement = valueAccesor.target;

                                if (!Microsoft.Utils.isNullOrUndefined(srcElement) && !Microsoft.Utils.isNullOrUndefined(srcElement.parentElement) && !Microsoft.Utils.isNullOrUndefined(srcElement.parentElement.lastElementChild) && !Microsoft.Utils.isNullOrWhiteSpace(srcElement.parentElement.lastElementChild.textContent)) {
                                    var promoCode = srcElement.parentElement.lastElementChild.textContent;

                                    Controls.ShoppingCartService.AddOrRemovePromotion(false, promoCode, false, Controls.ShoppingCartDataLevel.All).done(function (data) {
                                        Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);

                                        if (_this.displayPromotionBanner()) {
                                            _this.getPromotions();
                                        }
                                    }).fail(function (errors) {
                                        _this.errorMessage(Controls.Resources.String_94);
                                        _this.showError(true);
                                        Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                    });
                                } else {
                                    Controls.LoadingOverlay.CloseLoadingDialog(this._loadingDialog);
                                }
                            };

                            Cart.prototype.updateLoyaltyCardId = function () {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText, Controls.Resources.String_179);
                                var loyaltyCardId = this._editRewardCardDialog.find('#RewardCardTextBox').val();

                                if (!Microsoft.Utils.isNullOrWhiteSpace(loyaltyCardId)) {
                                    Controls.LoyaltyService.UpdateLoyaltyCardId(false, loyaltyCardId, Controls.ShoppingCartDataLevel.All).done(function (data) {
                                        _this.closeEditRewardCardDialog();
                                        Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);

                                        if (_this.displayPromotionBanner()) {
                                            _this.getPromotions();
                                        }
                                    }).fail(function (errors) {
                                        _this.errorMessage(Controls.Resources.String_164);
                                        _this.showError(true);
                                        _this.closeEditRewardCardDialog();
                                        Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                    });
                                }
                            };
                            return Cart;
                        })();
                        Controls.Cart = Cart;
                    })(Sdk.Controls || (Sdk.Controls = {}));
                    var Controls = Sdk.Controls;
                })(Ecommerce.Sdk || (Ecommerce.Sdk = {}));
                var Sdk = Ecommerce.Sdk;
            })(Retail.Ecommerce || (Retail.Ecommerce = {}));
            var Ecommerce = Retail.Ecommerce;
        })(Dynamics.Retail || (Dynamics.Retail = {}));
        var Retail = Dynamics.Retail;
    })(Microsoft.Dynamics || (Microsoft.Dynamics = {}));
    var Dynamics = Microsoft.Dynamics;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (Dynamics) {
        (function (Retail) {
            (function (Ecommerce) {
                (function (Sdk) {
                    (function (Controls) {
                        "use strict";

                        var Checkout = (function () {
                            function Checkout(element) {
                                var _this = this;
                                this._checkoutFragments = {
                                    DeliveryPreferences: "msax-DeliveryPreferences",
                                    PaymentInformation: "msax-PaymentInformation",
                                    Review: "msax-Review",
                                    Confirmation: "msax-Confirmation"
                                };
                                this.DisableTouchInputOnMap = false;
                                this._deliveryPreferencesFragments = {
                                    ShipItemsOrderLevel: "msax-ShipItemsOrderLevel",
                                    PickUpInStoreOrderLevel: "msax-PickUpInStoreOrderLevel",
                                    EmailOrderLevel: "msax-EmailOrderLevel",
                                    ItemLevelPreference: "msax-ItemLevelPreference"
                                };
                                this._itemDeliveryPreferencesFragments = {
                                    ShipItemsItemLevel: "msax-ShipItemsItemLevel",
                                    PickUpInStoreItemLevel: "msax-PickUpInStoreItemLevel",
                                    EmailItemLevel: "msax-EmailItemLevel"
                                };
                                this.tenderLines = [];
                                this.regExForNumber = /[^0-9\.]+/g;
                                this.checkGiftCardAmountValidity = false;
                                this.expirtationYear = [
                                    "2014",
                                    "2015",
                                    "2016",
                                    "2017",
                                    "2018"
                                ];
                                this._checkoutView = $(element);
                                this.errorMessage = ko.observable('');
                                this.errorPanel = this._checkoutView.find(" > .msax-ErrorPanel");
                                this.nextButton = this._checkoutView.find('.msax-Next');
                                this.kitCartItemTypeValue = ko.observable(Controls.TransactionItemType.Kit);
                                this._loadingDialog = this._checkoutView.find('.msax-Loading');
                                this._loadingText = this._loadingDialog.find('.msax-LoadingText');
                                Controls.LoadingOverlay.CreateLoadingDialog(this._loadingDialog, 200, 200);

                                this.countries = ko.observableArray(null);
                                this.states = ko.observableArray(null);
                                var cart = new Controls.ShoppingCartClass(null);
                                cart.SelectedDeliveryOption = new Controls.SelectedDeliveryOptionClass(null);
                                cart.SelectedDeliveryOption.CustomAddress = new Controls.AddressClass(null);
                                cart.Items = [];
                                cart.DiscountCodes = [];
                                cart.ShippingAddress = new Controls.AddressClass(null);
                                this.cart = ko.observable(cart);

                                this.commenceCheckout();
                                this.isAuthenticatedSession();
                                this.getAllDeliveryOptionDescriptions();
                                this.getCountryRegionInfoService();

                                Controls.ShoppingCartService.OnUpdateCheckoutCart(this, this.updateCheckoutCart);

                                this.deliveryPreferences = ko.observableArray(null);
                                this.selectedOrderDeliveryPreference = ko.observable(null);
                                this._deliveryPreferencesView = this._checkoutView.find(" > ." + this._checkoutFragments.DeliveryPreferences);
                                this.deliveryPreferenceToValidate = ko.observable(null);
                                this.tempShippingAddress = ko.observable(null);

                                this.addresses = ko.observableArray(null);
                                this.selectedAddress = ko.observable(null);
                                this.itemSelectedAddress = ko.observable(null);
                                this.availableDeliveryOptions = ko.observableArray(null);
                                var selectedOrderDeliveryOption = new Controls.SelectedDeliveryOptionClass(null);
                                selectedOrderDeliveryOption.CustomAddress = new Controls.AddressClass(null);
                                this.orderDeliveryOption = ko.observable(selectedOrderDeliveryOption);
                                this.isBillingAddressSameAsShippingAddress = ko.observable(false);
                                this.sendEmailToMe = ko.observable(false);
                                this.displayLocations = ko.observableArray(null);
                                this.hasInventoryCheck = ko.observable(Microsoft.Utils.isNullOrUndefined(msaxValues.msax_HasInventoryCheck) ? true : msaxValues.msax_HasInventoryCheck.toLowerCase() == "true");

                                this.item = ko.observable(null);
                                this.selectedLineDeliveryOption = ko.observable(null);
                                this.itemSelectedDeliveryPreference = ko.observable(null);
                                this.itemDeliveryPreferenceToValidate = ko.observable(null);
                                this.showItemDeliveryPreferenceDialog = ko.observable(false);
                                this._itemLevelDeliveryPreferenceSelection = this._deliveryPreferencesView.find('.msax-ItemLevelPreference .msax-ItemLevelPreferenceSelection');

                                this._paymentView = this._checkoutView.find(" > ." + this._checkoutFragments.PaymentInformation);
                                this._addDiscountCodeDialog = this._paymentView.find('.msax-PayPromotionCode .msax-AddDiscountCodeDialog');
                                this.useShippingAddress = ko.observable(false);
                                this.paymentCardTypes = ko.observableArray(null);
                                this.confirmEmailValue = ko.observable('');
                                this.paymentCard = ko.observable(null);
                                var payment = new Controls.PaymentClass(null);
                                payment.PaymentAddress = new Controls.AddressClass(null);
                                payment.ExpirationYear = 2015;
                                payment.ExpirationMonth = 1;
                                this.paymentCard(payment);

                                this.creditCardAmt = ko.observable('');
                                this.giftCardNumber = ko.observable('');
                                this.giftCardAmt = ko.observable('');
                                this.isGiftCardInfoAvailable = ko.observable(false);
                                this.giftCardBalance = ko.observable('');
                                this._paymentView.find('.msax-GiftCardBalance').hide();
                                this.paymentTotal = ko.observable(Microsoft.Utils.formatNumber(0.00));
                                this._creditCardPanel = this._paymentView.find('.msax-PayCreditCard .msax-CreditCardDetails');
                                this._giftCardPanel = this._paymentView.find('.msax-PayGiftCard .msax-GiftCardDetails');
                                this._loyaltyCardPanel = this._paymentView.find('.msax-PayLoyaltyCard .msax-LoyaltyCardDetails');
                                this.loyaltyCards = ko.observableArray(null);
                                this.loyaltyCardNumber = ko.observable('');
                                this.loyaltyCardAmt = ko.observable('');

                                this.payCreditCard = ko.observable(false);
                                this.payGiftCard = ko.observable(false);
                                this.payLoyaltyCard = ko.observable(false);

                                this.expirtationMonths = ko.observableArray([
                                    { key: 1, value: Controls.Resources.String_192 },
                                    { key: 2, value: Controls.Resources.String_193 },
                                    { key: 3, value: Controls.Resources.String_194 },
                                    { key: 4, value: Controls.Resources.String_195 },
                                    { key: 5, value: Controls.Resources.String_196 },
                                    { key: 6, value: Controls.Resources.String_197 },
                                    { key: 7, value: Controls.Resources.String_198 },
                                    { key: 8, value: Controls.Resources.String_199 },
                                    { key: 9, value: Controls.Resources.String_200 },
                                    { key: 10, value: Controls.Resources.String_201 },
                                    { key: 11, value: Controls.Resources.String_202 },
                                    { key: 12, value: Controls.Resources.String_203 }
                                ]);

                                this.emailDelivery = ko.observable(false);
                                this.orderLevelDelivery = ko.observable(false);
                                this._editRewardCardDialog = this._checkoutView.find('.msax-EditRewardCard');
                                this.displayPromotionBanner = ko.observable(Microsoft.Utils.isNullOrUndefined(msaxValues.msax_ReviewDisplayPromotionBanner) ? true : msaxValues.msax_ReviewDisplayPromotionBanner.toLowerCase() == "true");

                                this.orderNumber = ko.observable(null);

                                this._checkoutView.keypress(function (event) {
                                    if (event.keyCode == 13 || event.keyCode == 8 || event.keyCode == 27) {
                                        event.preventDefault();
                                        return false;
                                    }

                                    return true;
                                });

                                this.isShoppingCartEnabled = ko.computed(function () {
                                    return !Microsoft.Utils.isNullOrUndefined(_this.cart()) && Microsoft.Utils.hasElements(_this.cart().Items);
                                });

                                this.isPromotionCodesEnabled = ko.computed(function () {
                                    return !Microsoft.Utils.isNullOrUndefined(_this.cart()) && Microsoft.Utils.hasElements(_this.cart().DiscountCodes);
                                });

                                this.selectedOrderDeliveryPreference.subscribe(function (newValue) {
                                    _this.resetSelectedOrderShippingOptions();
                                    _this.errorPanel.hide();
                                    _this.emailDelivery(false);
                                    _this.orderLevelDelivery(true);
                                    _this.states(null);

                                    if (newValue == 1 /* ShipToAddress */) {
                                        if (Microsoft.Utils.isNullOrUndefined(_this.cart().SelectedDeliveryOption.CustomAddress)) {
                                            var cart = _this.cart();
                                            cart.SelectedDeliveryOption.CustomAddress = new Controls.AddressClass(null);
                                            _this.cart(cart);
                                        }

                                        if ((msaxValues.msax_IsDemoMode.toLowerCase() == "true") && (Microsoft.Utils.isNullOrWhiteSpace(_this.cart().SelectedDeliveryOption.CustomAddress.City) || Microsoft.Utils.isNullOrWhiteSpace(_this.cart().SelectedDeliveryOption.CustomAddress.Street) || Microsoft.Utils.isNullOrWhiteSpace(_this.cart().SelectedDeliveryOption.CustomAddress.State) || Microsoft.Utils.isNullOrWhiteSpace(_this.cart().SelectedDeliveryOption.CustomAddress.ZipCode) || Microsoft.Utils.isNullOrWhiteSpace(_this.cart().SelectedDeliveryOption.CustomAddress.Country))) {
                                            _this.autoFillCheckout();
                                        }

                                        var tempAddress = Microsoft.Utils.clone(_this.cart().SelectedDeliveryOption.CustomAddress);
                                        _this.tempShippingAddress(tempAddress);
                                        _this.deliveryPreferenceToValidate(' .' + _this._deliveryPreferencesFragments.ShipItemsOrderLevel);
                                        _this.showDeliveryPreferenceFragment(_this._deliveryPreferencesFragments.ShipItemsOrderLevel);
                                    } else if (newValue == 2 /* PickupFromStore */) {
                                        _this.deliveryPreferenceToValidate(' .' + _this._deliveryPreferencesFragments.PickUpInStoreOrderLevel);
                                        _this.showDeliveryPreferenceFragment(_this._deliveryPreferencesFragments.PickUpInStoreOrderLevel);
                                        _this._availableStoresView = _this._deliveryPreferencesView.find(".msax-PickUpInStoreOrderLevel .msax-AvailableStores");
                                        _this._location = _this._deliveryPreferencesView.find(".msax-PickUpInStoreOrderLevel input.msax-Location");
                                        _this._availableStoresView.hide();
                                        _this.map = _this._deliveryPreferencesView.find(".msax-PickUpInStoreOrderLevel .msax-Map");
                                        _this.getMap();
                                    } else if (newValue == 3 /* ElectronicDelivery */) {
                                        _this.deliveryPreferenceToValidate(' .' + _this._deliveryPreferencesFragments.EmailOrderLevel);
                                        _this.showDeliveryPreferenceFragment(_this._deliveryPreferencesFragments.EmailOrderLevel);

                                        var _sendEmailToMeCheckBox = _this._checkoutView.find('.msax-EmailOrderLevel .msax-SendEmailToMe');
                                        if (!_this.isAuthenticated) {
                                            _sendEmailToMeCheckBox.hide();
                                        } else {
                                            _sendEmailToMeCheckBox.show();
                                        }

                                        var selectedDeliveryOption = new Controls.SelectedDeliveryOptionClass(null);
                                        selectedDeliveryOption.DeliveryModeId = _this.emailDeliveryModeCode;
                                        selectedDeliveryOption.DeliveryModeText = _this.getDeliveryModeText(_this.emailDeliveryModeCode);
                                        selectedDeliveryOption.DeliveryPreferenceId = 3 /* ElectronicDelivery */.toString();
                                        selectedDeliveryOption.CustomAddress = new Controls.AddressClass(null);

                                        _this.orderDeliveryOption(selectedDeliveryOption);
                                        _this._emailAddressTextBox = _this._deliveryPreferencesView.find('.msax-EmailOrderLevel .msax-EmailTextBox');
                                        _this.emailDelivery(true);
                                    } else if (newValue == 4 /* DeliverItemsIndividually */) {
                                        _this.deliveryPreferenceToValidate(' .' + _this._deliveryPreferencesFragments.ItemLevelPreference);
                                        _this.showDeliveryPreferenceFragment(_this._deliveryPreferencesFragments.ItemLevelPreference);
                                    } else {
                                        _this.deliveryPreferenceToValidate('');
                                        _this.showDeliveryPreferenceFragment('');
                                    }
                                }, this);

                                this.itemSelectedDeliveryPreference.subscribe(function (newValue) {
                                    _this.resetSelectedOrderShippingOptions();
                                    _this.errorPanel.hide();
                                    _this.selectedLineDeliveryOption().LineId = _this.item().LineId;
                                    _this.emailDelivery(false);
                                    _this.orderLevelDelivery(false);
                                    _this.states(null);

                                    if (Microsoft.Utils.isNullOrUndefined(newValue)) {
                                        if (_this.selectedLineDeliveryOption().DeliveryPreferenceId == 2 /* PickupFromStore */) {
                                            newValue = 2 /* PickupFromStore */;
                                        } else if (_this.selectedLineDeliveryOption().DeliveryPreferenceId == 3 /* ElectronicDelivery */) {
                                            newValue = 3 /* ElectronicDelivery */;
                                        } else if (_this.selectedLineDeliveryOption().DeliveryPreferenceId == 1 /* ShipToAddress */) {
                                            newValue = 1 /* ShipToAddress */;
                                        } else {
                                            _this.itemSelectedDeliveryPreference(0 /* None */);
                                        }
                                    }

                                    if (newValue == 1 /* ShipToAddress */) {
                                        _this.selectedLineDeliveryOption().DeliveryPreferenceId = 1 /* ShipToAddress */;
                                        var tempAddress = Microsoft.Utils.clone(_this.selectedLineDeliveryOption().CustomAddress);
                                        _this.tempShippingAddress(tempAddress);
                                        _this.itemDeliveryPreferenceToValidate(' .' + _this._itemDeliveryPreferencesFragments.ShipItemsItemLevel);
                                        _this.showItemDeliveryPreferenceFragment(_this._itemDeliveryPreferencesFragments.ShipItemsItemLevel);
                                    } else if (newValue == 2 /* PickupFromStore */) {
                                        _this.selectedLineDeliveryOption().DeliveryPreferenceId = 2 /* PickupFromStore */;
                                        _this.itemDeliveryPreferenceToValidate(' .' + _this._itemDeliveryPreferencesFragments.PickUpInStoreItemLevel);
                                        _this.showItemDeliveryPreferenceFragment(_this._itemDeliveryPreferencesFragments.PickUpInStoreItemLevel);
                                        _this._availableStoresView = _this._itemLevelDeliveryPreferenceSelection.find(" .msax-PickUpInStoreItemLevel .msax-AvailableStores");
                                        _this._location = _this._itemLevelDeliveryPreferenceSelection.find(" .msax-PickUpInStoreItemLevel input.msax-Location");
                                        _this._availableStoresView.hide();
                                        _this.map = _this._itemLevelDeliveryPreferenceSelection.find(" .msax-Map");
                                        _this.getMap();
                                    } else if (newValue == 3 /* ElectronicDelivery */) {
                                        _this.selectedLineDeliveryOption().DeliveryPreferenceId = 3 /* ElectronicDelivery */;
                                        _this.selectedLineDeliveryOption().CustomAddress = new Controls.AddressClass(null);
                                        _this.itemDeliveryPreferenceToValidate(' .' + _this._itemDeliveryPreferencesFragments.EmailItemLevel);
                                        _this.showItemDeliveryPreferenceFragment(_this._itemDeliveryPreferencesFragments.EmailItemLevel);

                                        var _sendEmailToMeCheckBox = _this._itemLevelDeliveryPreferenceSelection.find('.msax-SendEmailToMe');
                                        if (!_this.isAuthenticated) {
                                            _sendEmailToMeCheckBox.hide();
                                        } else {
                                            _sendEmailToMeCheckBox.show();
                                        }

                                        _this.selectedLineDeliveryOption().DeliveryModeId = _this.emailDeliveryModeCode;
                                        _this.selectedLineDeliveryOption().DeliveryModeText = _this.getDeliveryModeText(_this.emailDeliveryModeCode);
                                        _this._emailAddressTextBox = _this._itemLevelDeliveryPreferenceSelection.find('.msax-EmailItemLevel .msax-EmailTextBox');
                                    } else {
                                        _this.itemDeliveryPreferenceToValidate('');
                                        _this.showItemDeliveryPreferenceFragment('');
                                    }
                                }, this);

                                this.selectedAddress.subscribe(function (newValue) {
                                    if (!Microsoft.Utils.isNullOrUndefined(newValue)) {
                                        _this.tempShippingAddress(newValue);
                                        var element = {};
                                        element.id = "OrderAddressStreet";
                                        element.value = newValue.Street;
                                        _this.resetOrderAvailableDeliveryMethods(element);
                                        element.id = "OrderAddressCity";
                                        element.value = newValue.City;
                                        _this.resetOrderAvailableDeliveryMethods(element);
                                        element.id = "OrderAddressZipCode";
                                        element.value = newValue.ZipCode;
                                        _this.resetOrderAvailableDeliveryMethods(element);
                                        element.id = "OrderAddressState";
                                        element.value = newValue.State;
                                        _this.resetOrderAvailableDeliveryMethods(element);
                                        element.id = "OrderAddressCountry";
                                        element.value = newValue.Country;
                                        _this.resetOrderAvailableDeliveryMethods(element);
                                        element.id = "OrderAddressName";
                                        element.value = newValue.Name;
                                        _this.resetOrderAvailableDeliveryMethods(element);
                                    }
                                }, this);

                                this.itemSelectedAddress.subscribe(function (newValue) {
                                    if (!Microsoft.Utils.isNullOrUndefined(newValue)) {
                                        _this.tempShippingAddress(newValue);
                                        var element = {};
                                        element.id = "ItemAddressStreet";
                                        element.value = newValue.Street;
                                        _this.resetItemAvailableDeliveryMethods(element);
                                        element.id = "ItemAddressCity";
                                        element.value = newValue.City;
                                        _this.resetItemAvailableDeliveryMethods(element);
                                        element.id = "ItemAddressZipCode";
                                        element.value = newValue.ZipCode;
                                        _this.resetItemAvailableDeliveryMethods(element);
                                        element.id = "ItemAddressState";
                                        element.value = newValue.State;
                                        _this.resetItemAvailableDeliveryMethods(element);
                                        element.id = "ItemAddressCountry";
                                        element.value = newValue.Country;
                                        _this.resetItemAvailableDeliveryMethods(element);
                                        element.id = "ItemAddressName";
                                        element.value = newValue.Name;
                                        _this.resetItemAvailableDeliveryMethods(element);
                                    }
                                }, this);

                                this.isBillingAddressSameAsShippingAddress.subscribe(function (newValue) {
                                    var payment = _this.paymentCard();
                                    var email = payment.PaymentAddress.Email;
                                    if (newValue && !Microsoft.Utils.isNullOrUndefined(_this.cart().ShippingAddress)) {
                                        payment.PaymentAddress = _this.cart().ShippingAddress;
                                        _this.getStateProvinceInfoService(payment.PaymentAddress.Country);
                                    } else {
                                        payment.PaymentAddress = new Controls.AddressClass(null);
                                        _this.states(null);
                                    }

                                    payment.PaymentAddress.Email = email;
                                    _this.paymentCard(payment);

                                    return newValue;
                                }, this);

                                this.sendEmailToMe.subscribe(function (newValue) {
                                    if (!Microsoft.Utils.isNullOrUndefined(newValue) && newValue) {
                                        if (Microsoft.Utils.isNullOrWhiteSpace(_this.email)) {
                                            _this.errorMessage(Controls.Resources.String_119);
                                            _this.showError(true);
                                        }

                                        _this._emailAddressTextBox.val(_this.email);
                                    }

                                    return (!Microsoft.Utils.isNullOrUndefined(newValue) && newValue);
                                }, this);

                                this.maskedCreditCard = ko.computed(function () {
                                    var ccNumber = '';

                                    if (!Microsoft.Utils.isNullOrUndefined(_this.paymentCard())) {
                                        var cardNumber = _this.paymentCard().CardNumber;

                                        if (!Microsoft.Utils.isNullOrUndefined(cardNumber)) {
                                            var ccLength = cardNumber.length;
                                            if (ccLength > 4) {
                                                for (var i = 0; i < ccLength - 4; i++) {
                                                    ccNumber += '*';
                                                    if ((i + 1) % 4 == 0) {
                                                        ccNumber += '-';
                                                    }
                                                }

                                                ccNumber += cardNumber.substring(ccLength - 4, ccLength);
                                            }
                                        }
                                    }

                                    return ccNumber;
                                });
                            }
                            Checkout.prototype.loadXMLDoc = function (filename) {
                                var xhttp;

                                if (XMLHttpRequest) {
                                    xhttp = new XMLHttpRequest();
                                } else {
                                    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
                                }
                                xhttp.open("GET", filename, false);
                                xhttp.send();
                                return xhttp.responseXML;
                            };

                            Checkout.prototype.autoFillCheckout = function () {
                                if (Microsoft.Utils.isNullOrEmpty(msaxValues.msax_DemoDataPath)) {
                                    return;
                                }

                                var xmlDoc = this.loadXMLDoc(msaxValues.msax_DemoDataPath);

                                var address = xmlDoc.getElementsByTagName("Address");
                                var country = address[0].getElementsByTagName("Country");
                                var name = address[0].getElementsByTagName("Name");
                                var street = address[0].getElementsByTagName("Street");
                                var city = address[0].getElementsByTagName("City");
                                var state = address[0].getElementsByTagName("State");
                                var zipcode = address[0].getElementsByTagName("Zipcode");
                                var email = xmlDoc.getElementsByTagName("Email");
                                var payment = xmlDoc.getElementsByTagName("Payment");
                                var cardNumber = payment[0].getElementsByTagName("CardNumber");
                                var ccid = payment[0].getElementsByTagName("CCID");

                                var tempAddress = new Controls.AddressClass(null);
                                tempAddress.Name = name[0].textContent;
                                tempAddress.Country = country[0].textContent;
                                tempAddress.Street = street[0].textContent;
                                tempAddress.City = city[0].textContent;
                                tempAddress.State = state[0].textContent;
                                tempAddress.ZipCode = zipcode[0].textContent;
                                this.cart().SelectedDeliveryOption.CustomAddress = tempAddress;
                                this.cart(this.cart());

                                var payment = this.paymentCard();
                                payment.PaymentAddress.Email = email[0].textContent;
                                this.confirmEmailValue(email[0].textContent);
                                payment.NameOnCard = name[0].textContent;
                                payment.CardNumber = cardNumber[0].textContent;
                                payment.CCID = ccid[0].textContent;
                                payment.PaymentAddress = tempAddress;
                                this.paymentCard(payment);
                            };

                            Checkout.prototype.showCheckoutFragment = function (fragmentCssClass) {
                                var allFragments = this._checkoutView.find("> div:not(' .msax-ProgressBar')");
                                allFragments.hide();

                                var fragmentToShow = this._checkoutView.find(" > ." + fragmentCssClass);
                                fragmentToShow.show();

                                var _progressBar = this._checkoutView.find(" > .msax-ProgressBar");
                                var _delivery = _progressBar.find(" > .msax-Delivery");
                                var _payment = _progressBar.find(" > .msax-Payment");
                                var _review = _progressBar.find(" > .msax-Review");
                                var _progressBarEnd = _progressBar.find(" > .msax-ProgressBarEnd");

                                switch (fragmentCssClass) {
                                    case this._checkoutFragments.DeliveryPreferences:
                                        _delivery.addClass("msax-Active");
                                        if (_payment.hasClass("msax-Active")) {
                                            _payment.removeClass("msax-Active");
                                        }
                                        if (_review.hasClass("msax-Active")) {
                                            _review.removeClass("msax-Active");
                                        }
                                        if (_progressBarEnd.hasClass("msax-Active")) {
                                            _progressBarEnd.removeClass("msax-Active");
                                        }
                                        break;

                                    case this._checkoutFragments.PaymentInformation:
                                        _delivery.addClass("msax-Active");
                                        _payment.addClass("msax-Active");
                                        if (_review.hasClass("msax-Active")) {
                                            _review.removeClass("msax-Active");
                                        }
                                        if (_progressBarEnd.hasClass("msax-Active")) {
                                            _progressBarEnd.removeClass("msax-Active");
                                        }
                                        break;

                                    case this._checkoutFragments.Review:
                                        _delivery.addClass("msax-Active");
                                        _payment.addClass("msax-Active");
                                        _review.addClass("msax-Active");

                                        if (_progressBarEnd.hasClass("msax-Active")) {
                                            _progressBarEnd.removeClass("msax-Active");
                                        }
                                        break;

                                    case this._checkoutFragments.Confirmation:
                                        _delivery.addClass("msax-Active");
                                        _payment.addClass("msax-Active");
                                        _review.addClass("msax-Active");
                                        _progressBarEnd.addClass("msax-Active");
                                        break;
                                }
                            };

                            Checkout.prototype.showDeliveryPreferenceFragment = function (fragmentCssClass) {
                                var allFragments = this._deliveryPreferencesView.find(" .msax-DeliveryPreferenceOption");
                                allFragments.hide();

                                if (!Microsoft.Utils.isNullOrWhiteSpace(fragmentCssClass)) {
                                    var fragmentToShow = this._deliveryPreferencesView.find(" ." + fragmentCssClass);
                                    fragmentToShow.show();
                                }
                            };

                            Checkout.prototype.showItemDeliveryPreferenceFragment = function (fragmentCssClass) {
                                var allFragments = this._itemLevelDeliveryPreferenceSelection.find(" .msax-DeliveryPreferenceOption");
                                allFragments.hide();

                                if (!Microsoft.Utils.isNullOrWhiteSpace(fragmentCssClass)) {
                                    var fragmentToShow = this._itemLevelDeliveryPreferenceSelection.find(" ." + fragmentCssClass);
                                    fragmentToShow.show();
                                }
                            };

                            Checkout.prototype.validateItemDeliveryInformation = function () {
                                if (Microsoft.Utils.isNullOrWhiteSpace(this.selectedLineDeliveryOption().DeliveryModeId)) {
                                    if (this.itemSelectedDeliveryPreference() == 2 /* PickupFromStore */) {
                                        this.errorMessage(Microsoft.Utils.format(Controls.Resources.String_114));
                                    } else if (this.itemSelectedDeliveryPreference() == 1 /* ShipToAddress */) {
                                        this.errorMessage(Microsoft.Utils.format(Controls.Resources.String_61));
                                    } else if (this.itemSelectedDeliveryPreference() == 0 /* None */) {
                                        this.errorMessage(Controls.Resources.String_158);
                                    }

                                    this.showError(false);
                                    return false;
                                }

                                this.errorPanel.hide();
                                return true;
                            };

                            Checkout.prototype.validateDeliveryInformation = function ($shippingOptions) {
                                if (this.selectedOrderDeliveryPreference() == 2 /* PickupFromStore */ && Microsoft.Utils.isNullOrWhiteSpace(this.orderDeliveryOption().DeliveryModeId)) {
                                    this.errorMessage(Controls.Resources.String_114);

                                    this.showError(false);
                                    return false;
                                } else if (this.selectedOrderDeliveryPreference() == 1 /* ShipToAddress */ && Microsoft.Utils.isNullOrWhiteSpace(this.orderDeliveryOption().DeliveryModeId)) {
                                    this.errorMessage(Controls.Resources.String_61);

                                    this.showError(false);
                                    return false;
                                } else if (this.selectedOrderDeliveryPreference() == 4 /* DeliverItemsIndividually */) {
                                    var items = this.cart().Items;
                                    for (var i = 0; i < items.length; i++) {
                                        if (Microsoft.Utils.isNullOrWhiteSpace(items[i].SelectedDeliveryOption.DeliveryModeId)) {
                                            if (items[i].SelectedDeliveryOption.DeliveryPreferenceId == 2 /* PickupFromStore */) {
                                                this.errorMessage(Microsoft.Utils.format(Controls.Resources.String_114 + Controls.Resources.String_125, items[i].ProductDetailsExpanded.Name));
                                            } else if (items[i].SelectedDeliveryOption.DeliveryPreferenceId == 1 /* ShipToAddress */) {
                                                this.errorMessage(Microsoft.Utils.format(Controls.Resources.String_61 + Controls.Resources.String_125, items[i].ProductDetailsExpanded.Name));
                                            } else {
                                                this.errorMessage(Microsoft.Utils.format(Controls.Resources.String_126, items[i].ProductDetailsExpanded.Name));
                                            }

                                            this.showError(false);
                                            return false;
                                        }
                                    }
                                } else if (this.selectedOrderDeliveryPreference() == 0 /* None */) {
                                    this.errorMessage(Controls.Resources.String_158);
                                    this.showError(false);
                                    return false;
                                }

                                this.errorPanel.hide();
                                return true;
                            };

                            Checkout.prototype.deliveryPreferencesNextClick = function () {
                                this.states(null);

                                switch (this.selectedOrderDeliveryPreference()) {
                                    case 4 /* DeliverItemsIndividually */:
                                        this.setItemShippingOptions();
                                        this.useShippingAddress(false);
                                        break;
                                    case 1 /* ShipToAddress */:
                                        this.setDeliveryOptions();
                                        this.useShippingAddress(true);
                                        break;
                                    case 3 /* ElectronicDelivery */:
                                        this.orderDeliveryOption().ElectronicDeliveryEmail = this.cart().SelectedDeliveryOption.ElectronicDeliveryEmail;
                                        this.orderDeliveryOption().ElectronicDeliveryEmailContent = this.cart().SelectedDeliveryOption.ElectronicDeliveryEmailContent;
                                        this.setDeliveryOptions();
                                        this.useShippingAddress(false);
                                        break;
                                    default:
                                        this.setDeliveryOptions();
                                        this.useShippingAddress(false);
                                        break;
                                }

                                this.getPaymentCardTypes();

                                if (this.isAuthenticated) {
                                    this.getLoyaltyCards();
                                    this.paymentCard().PaymentAddress.Email = this.email;
                                    this.paymentCard(this.paymentCard());
                                    this.confirmEmailValue(this.email);
                                } else {
                                    var _customLoyaltyRadio = this._paymentView.find("#CustomLoyaltyRadio");
                                    _customLoyaltyRadio.hide();
                                }
                            };

                            Checkout.prototype.paymentInformationPreviousClick = function () {
                                this.showCheckoutFragment(this._checkoutFragments.DeliveryPreferences);
                            };

                            Checkout.prototype.validateConfirmEmailTextBox = function (srcElement) {
                                var $element = $(srcElement);
                                var value = $element.val();

                                if (value !== this.paymentCard().PaymentAddress.Email) {
                                    this.errorMessage(Controls.Resources.String_62);
                                    this.showError(false);
                                    return false;
                                }

                                this.errorPanel.hide();
                                return true;
                            };

                            Checkout.prototype.paymentInformationNextClick = function () {
                                this.tenderLines = [];
                                this.validatePayments();
                            };

                            Checkout.prototype.reviewPreviousClick = function () {
                                if (this.selectedOrderDeliveryPreference() == 1 /* ShipToAddress */) {
                                    this.useShippingAddress(true);
                                } else {
                                    this.useShippingAddress(false);
                                }

                                this.showCheckoutFragment(this._checkoutFragments.PaymentInformation);
                            };

                            Checkout.prototype.quantityMinusClick = function (item) {
                                if (item.Quantity == 1) {
                                    this.removeFromCartClick(item);
                                } else {
                                    item.Quantity = item.Quantity - 1;
                                    this.updateQuantity([item]);
                                }
                            };

                            Checkout.prototype.quantityPlusClick = function (item) {
                                item.Quantity = item.Quantity + 1;
                                this.updateQuantity([item]);
                            };

                            Checkout.prototype.quantityTextBoxChanged = function (item, valueAccesor) {
                                var srcElement = valueAccesor.target;
                                if (!Microsoft.Utils.isNullOrUndefined(srcElement) && srcElement.value != item.Quantity) {
                                    item.Quantity = srcElement.value;
                                    if (item.Quantity < 0) {
                                        item.Quantity = 1;
                                    }

                                    if (item.Quantity == 0) {
                                        this.removeFromCartClick(item);
                                    } else {
                                        this.updateQuantity([item]);
                                    }
                                }
                            };

                            Checkout.prototype.selectOrderDeliveryOption = function (selectedDeliveryOption) {
                                this.orderDeliveryOption().DeliveryModeText = selectedDeliveryOption.DeliveryModeText;
                                return true;
                            };

                            Checkout.prototype.resetSelectedOrderShippingOptions = function () {
                                this.availableDeliveryOptions(null);
                                this.orderDeliveryOption(new Controls.SelectedDeliveryOptionClass(null));
                            };

                            Checkout.prototype.showError = function (isError) {
                                if (isError) {
                                    this.errorPanel.addClass("msax-Error");
                                } else if (this.errorPanel.hasClass("msax-Error")) {
                                    this.errorPanel.removeClass("msax-Error");
                                }

                                this.errorPanel.show();
                                $(window).scrollTop(0);
                            };

                            Checkout.prototype.getResx = function (key) {
                                return Controls.Resources[key];
                            };

                            Checkout.prototype.getDeliveryModeText = function (deliveryModeId) {
                                var deliveryModeText = "";
                                for (var i = 0; i < this.allDeliveryOptionDescriptions.length; i++) {
                                    if (this.allDeliveryOptionDescriptions[i].Id == deliveryModeId) {
                                        deliveryModeText = this.allDeliveryOptionDescriptions[i].Description;
                                        break;
                                    }
                                }

                                return deliveryModeText;
                            };

                            Checkout.prototype.updateSelectedShippingOptions = function (cart) {
                                cart.SelectedDeliveryOption = this.orderDeliveryOption();

                                if (this.selectedOrderDeliveryPreference() != 4 /* DeliverItemsIndividually */) {
                                    for (var i = 0; i < cart.Items.length; i++) {
                                        cart.Items[i].SelectedDeliveryOption = this.orderDeliveryOption();

                                        if (!Microsoft.Utils.isNullOrWhiteSpace(cart.DeliveryModeId) && Microsoft.Utils.isNullOrWhiteSpace(cart.Items[i].DeliveryModeId)) {
                                            cart.Items[i].DeliveryModeId = cart.DeliveryModeId;
                                        }

                                        this.getItemDeliveryModeDescription(cart.Items[i]);
                                    }
                                } else {
                                    for (var i = 0; i < cart.Items.length; i++) {
                                        cart.Items[i].SelectedDeliveryOption = this.cart().Items[i].SelectedDeliveryOption;

                                        if (!Microsoft.Utils.isNullOrWhiteSpace(cart.DeliveryModeId) && Microsoft.Utils.isNullOrWhiteSpace(cart.Items[i].DeliveryModeId)) {
                                            cart.Items[i].DeliveryModeId = cart.DeliveryModeId;
                                        }

                                        this.getItemDeliveryModeDescription(cart.Items[i]);
                                    }
                                }

                                this.cart(cart);
                            };

                            Checkout.prototype.getItemDeliveryModeDescription = function (item) {
                                if (Microsoft.Utils.isNullOrWhiteSpace(item.DeliveryModeId)) {
                                    item.DeliveryModeText = null;
                                } else {
                                    for (var i = 0; i < this.allDeliveryOptionDescriptions.length; i++) {
                                        if (this.allDeliveryOptionDescriptions[i].Id == item.DeliveryModeId) {
                                            item.DeliveryModeText = this.allDeliveryOptionDescriptions[i].Description;
                                        }
                                    }
                                }
                            };

                            Checkout.prototype.getMap = function () {
                                if (this.mapStoreLocator) {
                                    this.mapStoreLocator.dispose();
                                }

                                this.mapStoreLocator = new Microsoft.Maps.Map(this.map[0], { credentials: this.bingMapsToken, zoom: 1, disableTouchInput: this.DisableTouchInputOnMap });

                                Microsoft.Maps.loadModule('Microsoft.Maps.Search');
                            };

                            Checkout.prototype.getNearbyStoresWithAvailability = function () {
                                if (!Microsoft.Utils.isNullOrUndefined(this._location) && !Microsoft.Utils.isNullOrWhiteSpace(this._location.val())) {
                                    this.resetSelectedOrderShippingOptions();
                                    this.getMap();

                                    var searchManager = new Microsoft.Maps.Search.SearchManager(this.mapStoreLocator);

                                    var geocodeRequest = { where: this._location.val(), count: 1, callback: this.geocodeCallback.bind(this), errorCallback: this.geocodeErrorCallback.bind(this) };
                                    searchManager.geocode(geocodeRequest);
                                }
                            };

                            Checkout.prototype.geocodeCallback = function (geocodeResult, userData) {
                                if (!geocodeResult.results[0]) {
                                    this.errorMessage(Controls.Resources.String_109);
                                    this.showError(false);
                                    return;
                                }

                                this.searchLocation = geocodeResult.results[0].location;

                                this.mapStoreLocator.setView({ zoom: 11, center: this.searchLocation });

                                Microsoft.Maps.Events.addHandler(this.mapStoreLocator, 'viewchanged', this.renderAvailableStores.bind(this));

                                if (this.hasInventoryCheck()) {
                                    this.getNearbyStoresWithAvailabilityService();
                                } else {
                                    this.getNearbyStoresService();
                                }
                            };

                            Checkout.prototype.geocodeErrorCallback = function (geocodeRequest) {
                                this.errorMessage(Controls.Resources.String_110);
                                this.showError(true);
                            };

                            Checkout.prototype.renderAvailableStores = function () {
                                this.mapStoreLocator.entities.clear();
                                this._availableStoresView.hide();
                                this.displayLocations(null);

                                var storeCount = 0;
                                var pin;
                                var pinInfoBox;

                                var mapBounds = this.mapStoreLocator.getBounds();
                                var displayLocations = [];

                                if (!Microsoft.Utils.isNullOrUndefined(this.searchLocation) && mapBounds.contains(this.searchLocation)) {
                                    pin = new Microsoft.Maps.Pushpin(this.searchLocation, { draggable: false, text: "X" });
                                    this.mapStoreLocator.entities.push(pin);
                                }

                                if (!Microsoft.Utils.isNullOrEmpty(this.stores)) {
                                    for (var i = 0; i < this.stores.length; i++) {
                                        var currentStoreLocation = this.stores[i];
                                        currentStoreLocation.location = { latitude: currentStoreLocation.Latitude, longitude: currentStoreLocation.Longitude };

                                        if (mapBounds.contains(currentStoreLocation.location)) {
                                            this._availableStoresView.show();

                                            storeCount++;
                                            currentStoreLocation.LocationCount = storeCount;
                                            displayLocations.push(currentStoreLocation);

                                            var storeAddressText = '<div style="width:80%;height:100%;"><p style="background-color:gray;color:black;margin-bottom:5px;"><span style="padding-right:45px;">Store</span><span style="font-weight:bold;">Distance</span><p><p style="margin-bottom:0px;margin-top:0px;"><span style="color:black;padding-right:35px;">' + currentStoreLocation.StoreName + '</span><span style="color:black;">' + currentStoreLocation.Distance + ' miles</span></p><p style="margin-bottom:0px;margin-top:0px;">' + currentStoreLocation.Street + ' </p><p style="margin-bottom:0px;margin-top:0px;">' + currentStoreLocation.City + ', ' + currentStoreLocation.State + ' ' + currentStoreLocation.ZipCode + '</p></div>';

                                            pin = new Microsoft.Maps.Pushpin(currentStoreLocation.location, { draggable: false, text: "" + storeCount + "" });

                                            pinInfoBox = new Microsoft.Maps.Infobox(currentStoreLocation.location, { width: 225, offset: new Microsoft.Maps.Point(0, 10), showPointer: true, visible: false, description: storeAddressText });

                                            Microsoft.Maps.Events.addHandler(pin, 'click', (function (pinInfoBox) {
                                                return function () {
                                                    pinInfoBox.setOptions({ visible: true });
                                                };
                                            })(pinInfoBox));

                                            this.mapStoreLocator.entities.push(pin);
                                            this.mapStoreLocator.entities.push(pinInfoBox);
                                        }
                                    }
                                }

                                this.displayStores(displayLocations);
                            };

                            Checkout.prototype.displayStores = function (displayLocations) {
                                this.displayLocations(displayLocations);
                                var isAvailableInAnyStore = false;

                                if (this.hasInventoryCheck()) {
                                    for (var i = 0; i < displayLocations.length; i++) {
                                        if (displayLocations[i].AreItemsAvailableInStore) {
                                            isAvailableInAnyStore = true;
                                            this.selectStore(displayLocations[i]);
                                            break;
                                        }
                                    }
                                } else {
                                    this.selectStore(displayLocations[0]);
                                }

                                if (!isAvailableInAnyStore && this.hasInventoryCheck()) {
                                    this.resetSelectedOrderShippingOptions();
                                    this.errorMessage(Controls.Resources.String_107);
                                    this.showError(false);
                                }
                            };

                            Checkout.prototype.selectStore = function (location) {
                                if (!this.hasInventoryCheck() || (this.hasInventoryCheck() && location.AreItemsAvailableInStore)) {
                                    this.errorPanel.hide();

                                    if (this.nextButton.hasClass("msax-Grey")) {
                                        this.nextButton.removeClass("msax-Grey");
                                    }

                                    if (this.selectedOrderDeliveryPreference() == 4 /* DeliverItemsIndividually */) {
                                        this.selectedLineDeliveryOption().DeliveryModeId = this.pickUpInStoreDeliveryModeCode;
                                        this.selectedLineDeliveryOption().DeliveryModeText = this.getDeliveryModeText(this.pickUpInStoreDeliveryModeCode);
                                        this.selectedLineDeliveryOption().StoreAddress = location;
                                        this.selectedLineDeliveryOption().StoreAddress.ProductAvailabilities = null;
                                    } else if (this.selectedOrderDeliveryPreference() == 2 /* PickupFromStore */) {
                                        var selectedDeliveryOption = new Controls.SelectedDeliveryOptionClass(null);
                                        selectedDeliveryOption.DeliveryModeId = this.pickUpInStoreDeliveryModeCode;
                                        selectedDeliveryOption.DeliveryModeText = this.getDeliveryModeText(this.pickUpInStoreDeliveryModeCode);
                                        selectedDeliveryOption.StoreAddress = location;
                                        selectedDeliveryOption.StoreAddress.ProductAvailabilities = null;
                                        selectedDeliveryOption.DeliveryPreferenceId = 2 /* PickupFromStore */.toString();

                                        this.orderDeliveryOption(selectedDeliveryOption);
                                    }
                                } else {
                                    this.resetSelectedOrderShippingOptions();
                                    this.errorMessage(Controls.Resources.String_113);
                                    this.nextButton.addClass("msax-Grey");
                                    this.showError(false);
                                }

                                var _stores = this._availableStoresView.find(".msax-AvailableStore");
                                var selectedChannelId = location.ChannelId;

                                _stores.each(function (index, element) {
                                    if ($(element).hasClass("msax-Selected")) {
                                        $(element).removeClass("msax-Selected");
                                    }

                                    if (selectedChannelId == parseInt($(element).attr("channelId"))) {
                                        $(element).addClass("msax-Selected");
                                    }
                                });
                            };

                            Checkout.prototype.updateItemAvailibilities = function () {
                                if (!Microsoft.Utils.isNullOrEmpty(this.stores)) {
                                    for (var i = 0; i < this.stores.length; i++) {
                                        var currentStore = this.stores[i];
                                        currentStore.AreItemsAvailableInStore = true;
                                        if (currentStore.ProductAvailabilities.length != 0) {
                                            for (var j = 0; j < currentStore.ProductAvailabilities.length; j++) {
                                                currentStore.ProductAvailabilities[j].ProductDetails = $.parseJSON(currentStore.ProductAvailabilities[j].ProductDetails);
                                                if (currentStore.ProductAvailabilities[j].AvailableQuantity == 0) {
                                                    currentStore.AreItemsAvailableInStore = false;
                                                    break;
                                                }
                                            }
                                        } else if (currentStore.ProductAvailabilities.length == 0) {
                                            currentStore.AreItemsAvailableInStore = false;
                                        }
                                    }
                                }
                            };

                            Checkout.prototype.editRewardCardOverlayClick = function () {
                                this.dialogOverlay = $('.ui-widget-overlay');
                                this.dialogOverlay.on('click', $.proxy(this.closeEditRewardCardDialog, this));
                            };

                            Checkout.prototype.createEditRewardCardDialog = function () {
                                this._editRewardCardDialog.dialog({
                                    modal: true,
                                    title: Controls.Resources.String_186,
                                    autoOpen: false,
                                    draggable: true,
                                    resizable: false,
                                    position: ['top', 100],
                                    show: { effect: "fadeIn", duration: 500 },
                                    hide: { effect: "fadeOut", duration: 500 },
                                    width: 500,
                                    height: 300,
                                    dialogClass: 'msax-Control'
                                });
                            };

                            Checkout.prototype.showEditRewardCardDialog = function () {
                                $('.ui-dialog-titlebar-close').on('click', $.proxy(this.closeEditRewardCardDialog, this));

                                this._editRewardCardDialog.dialog('open');
                                this.editRewardCardOverlayClick();
                            };

                            Checkout.prototype.closeEditRewardCardDialog = function () {
                                this._editRewardCardDialog.dialog('close');
                            };

                            Checkout.prototype.discountCodeOverlayClick = function () {
                                this.dialogOverlay = $('.ui-widget-overlay');
                                this.dialogOverlay.on('click', $.proxy(this.closeDiscountCodeDialog, this));
                            };

                            Checkout.prototype.createDiscountCodeDialog = function () {
                                this._addDiscountCodeDialog.dialog({
                                    modal: true,
                                    title: Controls.Resources.String_188,
                                    autoOpen: false,
                                    draggable: true,
                                    resizable: false,
                                    position: ['top', 100],
                                    show: { effect: "fadeIn", duration: 500 },
                                    hide: { effect: "fadeOut", duration: 500 },
                                    width: 500,
                                    height: 300,
                                    dialogClass: 'msax-Control'
                                });
                            };

                            Checkout.prototype.showDiscountCodeDialog = function () {
                                $('.ui-dialog-titlebar-close').on('click', $.proxy(this.closeDiscountCodeDialog, this));

                                this._addDiscountCodeDialog.dialog('open');
                                this.discountCodeOverlayClick();
                            };

                            Checkout.prototype.closeDiscountCodeDialog = function () {
                                this._addDiscountCodeDialog.dialog('close');
                            };

                            Checkout.prototype.itemDeliveryPreferenceSelectionOverlayClick = function () {
                                this.dialogOverlay = $('.ui-widget-overlay');
                                this.dialogOverlay.on('click', $.proxy(this.closeItemDeliveryPreferenceSelection, this));
                            };

                            Checkout.prototype.createItemDeliveryPreferenceDialog = function () {
                                this._itemLevelDeliveryPreferenceSelection.dialog({
                                    modal: true,
                                    autoOpen: false,
                                    draggable: true,
                                    resizable: false,
                                    position: ['top', 100],
                                    show: { effect: "fadeIn", duration: 500 },
                                    hide: { effect: "fadeOut", duration: 500 },
                                    width: 980,
                                    height: 700,
                                    dialogClass: 'msax-Control msax-NoTitle'
                                });
                            };

                            Checkout.prototype.showItemDeliveryPreferenceSelection = function (parent) {
                                parent.DeliveryPreferences = [];

                                parent.DeliveryPreferences.push({ Value: 0 /* None */.toString(), Text: Controls.Resources.String_159 });

                                var lineDeliveryPreferences = Checkout.getDeliveryPreferencesForLine(parent.LineId, this.cartDeliveryPreferences);
                                var hasShipToAddress = Checkout.isRequestedDeliveryPreferenceApplicable(lineDeliveryPreferences, 1 /* ShipToAddress */);
                                var hasPickUpInStore = Checkout.isRequestedDeliveryPreferenceApplicable(lineDeliveryPreferences, 2 /* PickupFromStore */);
                                var hasEmail = Checkout.isRequestedDeliveryPreferenceApplicable(lineDeliveryPreferences, 3 /* ElectronicDelivery */);

                                if (hasShipToAddress) {
                                    parent.DeliveryPreferences.push({ Value: 1 /* ShipToAddress */.toString(), Text: Controls.Resources.String_99 });
                                }

                                if (hasPickUpInStore) {
                                    parent.DeliveryPreferences.push({ Value: 2 /* PickupFromStore */.toString(), Text: Controls.Resources.String_100 });
                                }

                                if (hasEmail) {
                                    parent.DeliveryPreferences.push({ Value: 3 /* ElectronicDelivery */.toString(), Text: Controls.Resources.String_58 });
                                }

                                var temp = new Controls.SelectedDeliveryOptionClass(null);
                                temp.CustomAddress = new Controls.AddressClass(null);

                                if (!(Microsoft.Utils.isNullOrWhiteSpace(parent.SelectedDeliveryOption.DeliveryModeId))) {
                                    if (!Microsoft.Utils.isNullOrUndefined(parent.SelectedDeliveryOption.CustomAddress)) {
                                        temp.CustomAddress.Name = parent.SelectedDeliveryOption.CustomAddress.Name;
                                        temp.CustomAddress.Street = parent.SelectedDeliveryOption.CustomAddress.Street;
                                        temp.CustomAddress.City = parent.SelectedDeliveryOption.CustomAddress.City;
                                        temp.CustomAddress.State = parent.SelectedDeliveryOption.CustomAddress.State;
                                        temp.CustomAddress.ZipCode = parent.SelectedDeliveryOption.CustomAddress.ZipCode;
                                        temp.CustomAddress.Country = parent.SelectedDeliveryOption.CustomAddress.Country;
                                    }

                                    temp.DeliveryPreferenceId = parent.SelectedDeliveryOption.DeliveryPreferenceId;
                                    temp.ElectronicDeliveryEmail = parent.SelectedDeliveryOption.ElectronicDeliveryEmail;
                                    temp.ElectronicDeliveryEmailContent = parent.SelectedDeliveryOption.ElectronicDeliveryEmailContent;
                                }

                                this.selectedLineDeliveryOption(temp);
                                this.item(parent);

                                this.errorPanel.hide();
                                this.errorPanel = this._itemLevelDeliveryPreferenceSelection.find(" .msax-ErrorPanel");
                                this.itemSelectedDeliveryPreference.notifySubscribers(parent.SelectedDeliveryOption.DeliveryPreferenceId);
                                this._itemLevelDeliveryPreferenceSelection.dialog('open');

                                this.itemDeliveryPreferenceSelectionOverlayClick();
                            };

                            Checkout.getDeliveryPreferencesForLine = function (lineId, cartDeliveryPreferences) {
                                var lineDeliveryPreferences = cartDeliveryPreferences.LineDeliveryPreferences;
                                for (var i = 0; i < lineDeliveryPreferences.length; i++) {
                                    if (lineDeliveryPreferences[i].LineId == lineId) {
                                        return lineDeliveryPreferences[i].DeliveryPreferenceTypes;
                                    }
                                }

                                var msg = "No delivery preferences were found for line id" + lineId;
                                throw new Error(msg);
                            };

                            Checkout.prototype.paymentCountryUpdate = function (srcElement) {
                                if (!Microsoft.Utils.isNullOrUndefined(srcElement)) {
                                    this.paymentCard().PaymentAddress.Country = srcElement.value;
                                    this.getStateProvinceInfoService(srcElement.value);
                                }

                                return true;
                            };

                            Checkout.prototype.resetOrderAvailableDeliveryMethods = function (srcElement) {
                                if (!Microsoft.Utils.isNullOrUndefined(srcElement)) {
                                    var id = srcElement.id;
                                    switch (id) {
                                        case "OrderAddressStreet":
                                            if (this.cart().SelectedDeliveryOption.CustomAddress.Street != srcElement.value) {
                                                this.cart().SelectedDeliveryOption.CustomAddress.Street = srcElement.value;
                                                this.resetSelectedOrderShippingOptions();
                                            }

                                            break;
                                        case "OrderAddressCity":
                                            if (this.cart().SelectedDeliveryOption.CustomAddress.City != srcElement.value) {
                                                this.cart().SelectedDeliveryOption.CustomAddress.City = srcElement.value;
                                                this.resetSelectedOrderShippingOptions();
                                            }

                                            break;
                                        case "OrderAddressZipCode":
                                            if (this.cart().SelectedDeliveryOption.CustomAddress.ZipCode != srcElement.value) {
                                                this.cart().SelectedDeliveryOption.CustomAddress.ZipCode = srcElement.value;
                                                this.resetSelectedOrderShippingOptions();
                                            }

                                            break;
                                        case "OrderAddressState":
                                            if (this.cart().SelectedDeliveryOption.CustomAddress.State != srcElement.value) {
                                                this.cart().SelectedDeliveryOption.CustomAddress.State = srcElement.value;
                                                this.resetSelectedOrderShippingOptions();
                                            }

                                            break;
                                        case "OrderAddressCountry":
                                            if (this.cart().SelectedDeliveryOption.CustomAddress.Country != srcElement.value) {
                                                this.cart().SelectedDeliveryOption.CustomAddress.Country = srcElement.value;
                                                this.getStateProvinceInfoService(srcElement.value);
                                                this.resetSelectedOrderShippingOptions();
                                            }

                                            break;
                                        case "OrderAddressName":
                                            this.cart().SelectedDeliveryOption.CustomAddress.Name = srcElement.value;
                                            break;
                                    }
                                }

                                return true;
                            };

                            Checkout.prototype.resetItemAvailableDeliveryMethods = function (srcElement) {
                                if (!Microsoft.Utils.isNullOrUndefined(srcElement)) {
                                    var id = srcElement.id;
                                    switch (id) {
                                        case "ItemAddressStreet":
                                            if (this.selectedLineDeliveryOption().CustomAddress.Street != srcElement.value) {
                                                this.selectedLineDeliveryOption().CustomAddress.Street = srcElement.value;
                                                this.resetSelectedOrderShippingOptions();
                                                this.selectedLineDeliveryOption().DeliveryModeId = null;
                                            }

                                            break;
                                        case "ItemAddressCity":
                                            if (this.selectedLineDeliveryOption().CustomAddress.City != srcElement.value) {
                                                this.selectedLineDeliveryOption().CustomAddress.City = srcElement.value;
                                                this.resetSelectedOrderShippingOptions();
                                                this.selectedLineDeliveryOption().DeliveryModeId = null;
                                            }

                                            break;
                                        case "ItemAddressZipCode":
                                            if (this.selectedLineDeliveryOption().CustomAddress.ZipCode != srcElement.value) {
                                                this.selectedLineDeliveryOption().CustomAddress.ZipCode = srcElement.value;
                                                this.resetSelectedOrderShippingOptions();
                                                this.selectedLineDeliveryOption().DeliveryModeId = null;
                                            }

                                            break;
                                        case "ItemAddressState":
                                            if (this.selectedLineDeliveryOption().CustomAddress.State != srcElement.value) {
                                                this.selectedLineDeliveryOption().CustomAddress.State = srcElement.value;
                                                this.resetSelectedOrderShippingOptions();
                                                this.selectedLineDeliveryOption().DeliveryModeId = null;
                                            }

                                            break;
                                        case "ItemAddressCountry":
                                            if (this.selectedLineDeliveryOption().CustomAddress.Country != srcElement.value) {
                                                this.selectedLineDeliveryOption().CustomAddress.Country = srcElement.value;
                                                this.getStateProvinceInfoService(srcElement.value);
                                                this.resetSelectedOrderShippingOptions();
                                                this.selectedLineDeliveryOption().DeliveryModeId = null;
                                            }

                                            break;
                                        case "ItemAddressName":
                                            this.selectedLineDeliveryOption().CustomAddress.Name = srcElement.value;
                                            break;
                                    }
                                }

                                return true;
                            };

                            Checkout.prototype.closeItemDeliveryPreferenceSelection = function () {
                                this.errorPanel = this._checkoutView.find(" > .msax-ErrorPanel");

                                this._itemLevelDeliveryPreferenceSelection.dialog('close');
                                this.cart(this.cart());
                            };

                            Checkout.prototype.setItemDeliveryPreferenceSelection = function () {
                                if (this.selectedLineDeliveryOption().DeliveryPreferenceId == 1 /* ShipToAddress */) {
                                    for (var i = 0; i < this.availableDeliveryOptions().length; i++) {
                                        if (this.selectedLineDeliveryOption().DeliveryModeId == this.availableDeliveryOptions()[i].Id) {
                                            this.selectedLineDeliveryOption().DeliveryModeText = this.availableDeliveryOptions()[i].Description;
                                        }
                                    }

                                    this.selectedLineDeliveryOption().ElectronicDeliveryEmail = null;
                                    this.selectedLineDeliveryOption().ElectronicDeliveryEmailContent = null;
                                } else if (this.selectedLineDeliveryOption().DeliveryPreferenceId == 3 /* ElectronicDelivery */ || this.selectedLineDeliveryOption().DeliveryPreferenceId == 2 /* PickupFromStore */) {
                                    this.selectedLineDeliveryOption().CustomAddress = new Controls.AddressClass(null);
                                }

                                var latestLineDeliveryOption = this.selectedLineDeliveryOption();
                                var currentDeliveryOption = new Controls.SelectedDeliveryOptionClass(null);
                                currentDeliveryOption.CustomAddress = latestLineDeliveryOption.CustomAddress;
                                currentDeliveryOption.DeliveryModeId = latestLineDeliveryOption.DeliveryModeId;
                                ;
                                currentDeliveryOption.DeliveryModeText = latestLineDeliveryOption.DeliveryModeText;
                                ;
                                currentDeliveryOption.DeliveryPreferenceId = latestLineDeliveryOption.DeliveryPreferenceId;
                                ;
                                currentDeliveryOption.ElectronicDeliveryEmail = latestLineDeliveryOption.ElectronicDeliveryEmail;
                                currentDeliveryOption.ElectronicDeliveryEmailContent = latestLineDeliveryOption.ElectronicDeliveryEmailContent;
                                currentDeliveryOption.StoreAddress = latestLineDeliveryOption.StoreAddress;
                                this.item().SelectedDeliveryOption = currentDeliveryOption;

                                this.closeItemDeliveryPreferenceSelection();
                            };

                            Checkout.prototype.findLocationKeyPress = function (data, event) {
                                if (event.keyCode == 8 || event.keyCode == 27) {
                                    event.preventDefault();
                                    return false;
                                } else if (event.keyCode == 13) {
                                    this.getNearbyStoresWithAvailability();
                                    return false;
                                }

                                return true;
                            };

                            Checkout.prototype.removeValidation = function (element) {
                                $(element).find(":input").each(function (idx, element) {
                                    $(element).removeAttr('required');
                                });
                            };

                            Checkout.prototype.addValidation = function (element) {
                                $(element).find(":input").each(function (idx, element) {
                                    $(element).attr('required', true);
                                });
                            };

                            Checkout.prototype.updateCustomLoyaltyValidation = function () {
                                if (this._paymentView.find('#CustomLoyaltyRadio').is(':checked')) {
                                    this.addValidation(this._paymentView.find('#LoyaltyCustomCard'));
                                }

                                return true;
                            };

                            Checkout.prototype.checkForGiftCardInCart = function () {
                                this.anyGiftCard = false;
                                var Items = this.cart().Items;
                                for (var i = 0; i < Items.length; i++) {
                                    if (Items[i].ItemId == this.giftCardItemId) {
                                        this.anyGiftCard = true;
                                    }
                                }
                            };

                            Checkout.prototype.updateDeliveryPreferences = function () {
                                var deliveryPreferences = [];

                                deliveryPreferences.push({ Value: 0 /* None */, Text: Controls.Resources.String_159 });

                                if (this.hasShipToAddress) {
                                    deliveryPreferences.push({ Value: 1 /* ShipToAddress */, Text: Controls.Resources.String_99 });
                                }

                                if (this.hasPickUpInStore) {
                                    deliveryPreferences.push({ Value: 2 /* PickupFromStore */, Text: Controls.Resources.String_100 });
                                }

                                if (this.hasEmail) {
                                    deliveryPreferences.push({ Value: 3 /* ElectronicDelivery */, Text: Controls.Resources.String_58 });
                                }

                                if (this.hasMultiDeliveryPreference) {
                                    deliveryPreferences.push({ Value: 4 /* DeliverItemsIndividually */, Text: Controls.Resources.String_101 });
                                }

                                this.deliveryPreferences(deliveryPreferences);
                            };

                            Checkout.prototype.showPaymentPanel = function (data, valueAccessor) {
                                var srcElement = valueAccessor.target;

                                if (!Microsoft.Utils.isNullOrUndefined(srcElement)) {
                                    if ($(srcElement).hasClass('msax-PayCreditCardLink')) {
                                        this._creditCardPanel.show();
                                        this.addValidation(this._creditCardPanel);
                                        this.payCreditCard(true);
                                    } else if ($(srcElement).hasClass('msax-PayGiftCardLink')) {
                                        this._giftCardPanel.show();
                                        this.addValidation(this._giftCardPanel);
                                        this.payGiftCard(true);
                                    } else if ($(srcElement).hasClass('msax-PayLoyaltyCardLink')) {
                                        this._loyaltyCardPanel.show();
                                        this.addValidation(this._loyaltyCardPanel);
                                        if (this.isAuthenticated) {
                                            this.removeValidation(this._paymentView.find('#LoyaltyCustomCard'));
                                        }

                                        this.payLoyaltyCard(true);
                                    }

                                    $(srcElement).hide();
                                    this.updatePaymentTotal();
                                }
                            };

                            Checkout.prototype.hidePaymentPanel = function (data, valueAccessor) {
                                var srcElement = valueAccessor.target;

                                if (!Microsoft.Utils.isNullOrUndefined(srcElement)) {
                                    if ($(srcElement.parentElement).hasClass('msax-CreditCard')) {
                                        this._creditCardPanel.hide();
                                        this._paymentView.find('.msax-PayCreditCard .msax-PayCreditCardLink').show();
                                        this.removeValidation(this._creditCardPanel);
                                        this.payCreditCard(false);
                                    } else if ($(srcElement.parentElement).hasClass('msax-GiftCard')) {
                                        this._giftCardPanel.hide();
                                        this._paymentView.find('.msax-PayGiftCard .msax-PayGiftCardLink').show();
                                        this.removeValidation(this._giftCardPanel);
                                        this.payGiftCard(false);
                                    } else if ($(srcElement.parentElement).hasClass('msax-LoyaltyCard')) {
                                        this._loyaltyCardPanel.hide();
                                        this._paymentView.find('.msax-PayLoyaltyCard .msax-PayLoyaltyCardLink').show();
                                        this.removeValidation(this._loyaltyCardPanel);
                                        this.payLoyaltyCard(false);
                                    }

                                    this.updatePaymentTotal();
                                }
                            };

                            Checkout.prototype.updatePaymentTotal = function () {
                                var _creditCardAmountTextBox = this._paymentView.find('#CreditCardAmount');
                                this.creditCardAmount = 0;
                                this.giftCardAmount = 0;
                                this.loyaltyCardAmount = 0;

                                if (this.payGiftCard()) {
                                    var _giftCardTextBox = this._paymentView.find('#GiftCardAmount');
                                    this.giftCardAmount = Microsoft.Utils.parseNumberFromLocaleString(_giftCardTextBox.val());
                                    var giftCardAmountWithCurrency = Microsoft.Utils.format(this.channelCurrencyTemplate, Microsoft.Utils.formatNumber(this.giftCardAmount));
                                    _giftCardTextBox.val(giftCardAmountWithCurrency);
                                }

                                if (this.payLoyaltyCard()) {
                                    var _loyaltyCardTextBox = this._paymentView.find('#LoyaltyCardAmount');
                                    this.loyaltyCardAmount = Microsoft.Utils.parseNumberFromLocaleString(_loyaltyCardTextBox.val());
                                    var loyaltyCardAmountWithCurrency = Microsoft.Utils.format(this.channelCurrencyTemplate, Microsoft.Utils.formatNumber(this.loyaltyCardAmount));
                                    _loyaltyCardTextBox.val(loyaltyCardAmountWithCurrency);
                                }

                                if (this.payCreditCard()) {
                                    this.creditCardAmount = this.cart().TotalAmount - this.giftCardAmount - this.loyaltyCardAmount;
                                    if (this.creditCardAmount < 0) {
                                        this.creditCardAmount = 0;
                                    }

                                    var creditCardAmountWithCurrency = Microsoft.Utils.format(this.channelCurrencyTemplate, Microsoft.Utils.formatNumber(this.creditCardAmount));
                                    _creditCardAmountTextBox.val(creditCardAmountWithCurrency);
                                }

                                this.totalAmount = Number(this.creditCardAmount + this.giftCardAmount + this.loyaltyCardAmount);
                                if (isNaN(this.totalAmount)) {
                                    this.totalAmount = 0;
                                }

                                this.paymentTotal(Microsoft.Utils.format(this.channelCurrencyTemplate, Microsoft.Utils.formatNumber(this.totalAmount)));

                                return true;
                            };

                            Checkout.prototype.validatePayments = function () {
                                if (!this.payCreditCard() && !this.payGiftCard() && !this.payLoyaltyCard()) {
                                    this.errorMessage(Controls.Resources.String_139);
                                    this.showError(false);
                                    return;
                                }

                                if (this.payCreditCard()) {
                                    var selectedYear = this.paymentCard().ExpirationYear;
                                    var selectedMonth = this.paymentCard().ExpirationMonth;
                                    var currentTime = new Date();
                                    var currentMonth = currentTime.getMonth() + 1;
                                    var currentYear = currentTime.getFullYear();
                                    if (selectedYear < currentYear || selectedYear == currentYear && selectedMonth < currentMonth) {
                                        this.errorMessage(Controls.Resources.String_140);
                                        this.showError(false);
                                        return;
                                    }
                                }

                                if (this.payLoyaltyCard()) {
                                    if (this.loyaltyCardAmount == 0) {
                                        this.errorMessage(Controls.Resources.String_152);
                                        this.showError(false);
                                        return;
                                    }

                                    if (this.loyaltyCardAmount > this.cart().TotalAmount) {
                                        this.errorMessage(Controls.Resources.String_153);
                                        this.showError(false);
                                        return;
                                    }
                                }

                                if (this.payGiftCard()) {
                                    if (Microsoft.Utils.isNullOrWhiteSpace(this.giftCardNumber())) {
                                        this.errorMessage(Controls.Resources.String_144);
                                        this.showError(false);
                                        return;
                                    }

                                    if (this.giftCardAmount == 0) {
                                        this.errorMessage(Controls.Resources.String_146);
                                        this.showError(false);
                                        return;
                                    }

                                    if (this.giftCardAmount > this.cart().TotalAmount) {
                                        this.errorMessage(Controls.Resources.String_147);
                                        this.showError(false);
                                        return;
                                    }

                                    this.checkGiftCardAmountValidity = true;

                                    this.getGiftCardBalance();
                                } else {
                                    this.createPaymentCardTenderLine();
                                }
                            };

                            Checkout.prototype.createPaymentCardTenderLine = function () {
                                this.paymentCard(this.paymentCard());

                                if (this.totalAmount != this.cart().TotalAmount) {
                                    this.errorMessage(Controls.Resources.String_149);
                                    this.showError(false);
                                    return;
                                }

                                if (this.payCreditCard()) {
                                    var tenderLine = new Controls.TenderDataLineClass(null);
                                    tenderLine.PaymentCard = new Controls.PaymentClass(this.paymentCard());
                                    tenderLine.Amount = this.creditCardAmount;
                                    this.creditCardAmt(Microsoft.Utils.format(this.channelCurrencyTemplate, Microsoft.Utils.formatNumber(this.creditCardAmount)));
                                    this.tenderLines.push(tenderLine);
                                }

                                if (this.payLoyaltyCard()) {
                                    var tenderLine = new Controls.TenderDataLineClass(null);

                                    if (!this.isAuthenticated || this._paymentView.find('#CustomLoyaltyRadio').is(':checked')) {
                                        this.loyaltyCardNumber(this._paymentView.find('#CustomLoyaltyCardNumber').val());
                                    }

                                    tenderLine.LoyaltyCardId = this.loyaltyCardNumber();
                                    tenderLine.Amount = this.loyaltyCardAmount;
                                    this.loyaltyCardAmt(Microsoft.Utils.format(this.channelCurrencyTemplate, Microsoft.Utils.formatNumber(this.loyaltyCardAmount)));
                                    this.tenderLines.push(tenderLine);
                                }

                                if (this.payGiftCard()) {
                                    var tenderLine = new Controls.TenderDataLineClass(null);
                                    tenderLine.Amount = this.giftCardAmount;
                                    tenderLine.GiftCardId = this.giftCardNumber();
                                    this.giftCardAmt(Microsoft.Utils.format(this.channelCurrencyTemplate, Microsoft.Utils.formatNumber(this.giftCardAmount)));
                                    this.tenderLines.push(tenderLine);
                                }

                                this.showCheckoutFragment(this._checkoutFragments.Review);
                            };

                            Checkout.prototype.updateCheckoutCart = function (event, data) {
                                if (!Microsoft.Utils.isNullOrUndefined(data.Errors) && data.Errors.length > 0) {
                                    this.errorMessage(this.errorMessage() + data.Errors[0].ErrorMessage);
                                    this.showError(true);
                                } else {
                                    this.updateSelectedShippingOptions(data.ShoppingCart);
                                }
                            };

                            Checkout.isRequestedDeliveryPreferenceApplicable = function (deliveryPreferenceTypes, reqDeliveryPreferenceType) {
                                for (var i = 0; i < deliveryPreferenceTypes.length; i++) {
                                    if (deliveryPreferenceTypes[i] == reqDeliveryPreferenceType) {
                                        return true;
                                    }
                                }

                                return false;
                            };

                            Checkout.prototype.getShoppingCart = function () {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText);
                                Controls.ShoppingCartService.GetShoppingCart(true, Controls.ShoppingCartDataLevel.All).done(function (data) {
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);

                                    if (_this.displayPromotionBanner()) {
                                        _this.getPromotions();
                                    }
                                }).fail(function (errors) {
                                    _this.errorMessage(Controls.Resources.String_63);
                                    _this.showError(true);
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                });
                            };

                            Checkout.prototype.commenceCheckout = function () {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText);

                                Controls.ShoppingCartService.CommenceCheckout(Controls.ShoppingCartDataLevel.All).done(function (data) {
                                    if (!Microsoft.Utils.isNullOrUndefined(data.Errors) && data.Errors.length > 0) {
                                        _this.errorMessage(_this.errorMessage() + data.Errors[0].ErrorMessage);
                                        _this.showError(true);
                                    } else {
                                        _this.showCheckoutFragment(_this._checkoutFragments.DeliveryPreferences);
                                        _this.getChannelConfigurationAndTenderTypes();
                                        _this.getDeliveryPreferences();

                                        if (_this.displayPromotionBanner()) {
                                            _this.getPromotions();
                                        }

                                        _this.createEditRewardCardDialog();
                                        _this.createDiscountCodeDialog();
                                    }
                                }).fail(function (errors) {
                                    _this.errorMessage(_this.errorMessage() + Controls.Resources.String_63);
                                    _this.showError(true);
                                });
                            };

                            Checkout.prototype.getPromotions = function () {
                                var _this = this;
                                Controls.ShoppingCartService.GetPromotions(true, Controls.ShoppingCartDataLevel.All).done(function (data) {
                                }).fail(function (errors) {
                                    _this.errorMessage(Controls.Resources.String_177);
                                    _this.showError(true);
                                });
                            };

                            Checkout.prototype.getAllDeliveryOptionDescriptions = function () {
                                var _this = this;
                                Controls.CheckoutService.GetDeliveryOptionsInfo().done(function (data) {
                                    if (!Microsoft.Utils.isNullOrUndefined(data.Errors) && data.Errors.length > 0) {
                                        _this.errorMessage(_this.errorMessage() + data.Errors[0].ErrorMessage);
                                        _this.showError(true);
                                    } else {
                                        _this.allDeliveryOptionDescriptions = data.DeliveryOptions;
                                    }
                                }).fail(function (errors) {
                                    _this.errorMessage(_this.errorMessage() + Controls.Resources.String_160);
                                    _this.showError(true);
                                });
                                ;
                            };

                            Checkout.prototype.getChannelConfigurationAndTenderTypes = function () {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText);

                                Controls.ChannelService.GetChannelConfiguration().done(function (data) {
                                    if (!Microsoft.Utils.isNullOrUndefined(data.Errors) && data.Errors.length > 0) {
                                        _this.errorMessage(_this.errorMessage() + data.Errors[0].ErrorMessage);
                                        _this.showError(true);
                                    } else {
                                        _this.channelCurrencyTemplate = data.ChannelConfiguration.CurrencyStringTemplate;
                                        _this.bingMapsToken = data.ChannelConfiguration.BingMapsApiKey;
                                        _this.pickUpInStoreDeliveryModeCode = data.ChannelConfiguration.PickupDeliveryModeCode;
                                        _this.emailDeliveryModeCode = data.ChannelConfiguration.EmailDeliveryModeCode;
                                        _this.giftCardItemId = data.ChannelConfiguration.GiftCardItemId;
                                        var paymentTotalValue = Microsoft.Utils.parseNumberFromLocaleString(_this.paymentTotal());
                                        _this.paymentTotal(Microsoft.Utils.format(_this.channelCurrencyTemplate, Microsoft.Utils.formatNumber(paymentTotalValue)));

                                        _this.getTenderTypes();
                                    }

                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                }).fail(function (errors) {
                                    _this.errorMessage(_this.errorMessage() + Controls.Resources.String_98);
                                    _this.showError(true);
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                });
                            };

                            Checkout.prototype.getDeliveryPreferences = function () {
                                var _this = this;
                                Controls.CheckoutService.GetDeliveryPreferences().done(function (data) {
                                    if (!Microsoft.Utils.isNullOrUndefined(data.Errors) && data.Errors.length > 0) {
                                        _this.errorMessage(_this.errorMessage() + data.Errors[0].ErrorMessage);
                                        _this.showError(true);
                                    } else {
                                        _this.cartDeliveryPreferences = data.CartDeliveryPreferences;
                                        var headerLevelDeliveryPreferenceTypes = _this.cartDeliveryPreferences.HeaderDeliveryPreferenceTypes;
                                        _this.hasShipToAddress = Checkout.isRequestedDeliveryPreferenceApplicable(headerLevelDeliveryPreferenceTypes, 1 /* ShipToAddress */);
                                        _this.hasPickUpInStore = Checkout.isRequestedDeliveryPreferenceApplicable(headerLevelDeliveryPreferenceTypes, 2 /* PickupFromStore */);
                                        _this.hasEmail = Checkout.isRequestedDeliveryPreferenceApplicable(headerLevelDeliveryPreferenceTypes, 3 /* ElectronicDelivery */);
                                        _this.hasMultiDeliveryPreference = Checkout.isRequestedDeliveryPreferenceApplicable(headerLevelDeliveryPreferenceTypes, 4 /* DeliverItemsIndividually */);

                                        _this.updateDeliveryPreferences();
                                        _this.createItemDeliveryPreferenceDialog();
                                    }
                                }).fail(function (errors) {
                                    _this.errorMessage(_this.errorMessage() + Controls.Resources.String_98);
                                    _this.showError(true);
                                });
                            };

                            Checkout.prototype.removeFromCartClick = function (item) {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText, Controls.Resources.String_179);

                                Controls.ShoppingCartService.RemoveFromCart(true, item.LineId, Controls.ShoppingCartDataLevel.All).done(function (data) {
                                    _this.getDeliveryPreferences();
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                    if (_this.displayPromotionBanner()) {
                                        _this.getPromotions();
                                    }
                                }).fail(function (errors) {
                                    _this.errorMessage(Controls.Resources.String_64);
                                    _this.showError(true);
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                });
                            };

                            Checkout.prototype.updateQuantity = function (items) {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText, Controls.Resources.String_179);

                                Controls.ShoppingCartService.UpdateQuantity(true, items, Controls.ShoppingCartDataLevel.All).done(function (data) {
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);

                                    if (_this.displayPromotionBanner()) {
                                        _this.getPromotions();
                                    }
                                }).fail(function (errors) {
                                    _this.errorMessage(Controls.Resources.String_65);
                                    _this.showError(true);
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                });
                            };

                            Checkout.prototype.applyPromotionCode = function (cart, valueAccesor) {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText, Controls.Resources.String_179);
                                var discountCode = this._addDiscountCodeDialog.find('#DiscountCodeTextBox').val();
                                if (!Microsoft.Utils.isNullOrWhiteSpace(discountCode)) {
                                    Controls.ShoppingCartService.AddOrRemovePromotion(true, discountCode, true, Controls.ShoppingCartDataLevel.All).done(function (data) {
                                        Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                        _this.closeDiscountCodeDialog();

                                        if (_this.displayPromotionBanner()) {
                                            _this.getPromotions();
                                        }
                                    }).fail(function (errors) {
                                        _this.closeDiscountCodeDialog();
                                        _this.errorMessage(Controls.Resources.String_93);
                                        _this.showError(true);
                                        Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                    });
                                }
                            };

                            Checkout.prototype.removePromotionCode = function (cart, valueAccesor) {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText, Controls.Resources.String_179);
                                var srcElement = valueAccesor.target;

                                if (!Microsoft.Utils.isNullOrUndefined(srcElement) && !Microsoft.Utils.isNullOrUndefined(srcElement.parentElement) && !Microsoft.Utils.isNullOrUndefined(srcElement.parentElement.lastElementChild) && !Microsoft.Utils.isNullOrWhiteSpace(srcElement.parentElement.lastElementChild.textContent)) {
                                    var promoCode = srcElement.parentElement.lastElementChild.textContent;

                                    Controls.ShoppingCartService.AddOrRemovePromotion(true, promoCode, false, Controls.ShoppingCartDataLevel.All).done(function (data) {
                                        Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);

                                        if (_this.displayPromotionBanner()) {
                                            _this.getPromotions();
                                        }
                                    }).fail(function (errors) {
                                        _this.errorMessage(Controls.Resources.String_94);
                                        _this.showError(true);
                                        Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                    });
                                } else {
                                    Controls.LoadingOverlay.CloseLoadingDialog(this._loadingDialog);
                                }
                            };

                            Checkout.prototype.getOrderDeliveryOptions = function () {
                                var _this = this;
                                this.resetSelectedOrderShippingOptions();
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText);
                                var shipToAddress = new Controls.AddressClass(null);
                                shipToAddress = this.cart().SelectedDeliveryOption.CustomAddress;

                                Controls.CheckoutService.GetOrderDeliveryOptionsForShipping(shipToAddress).done(function (data) {
                                    if (!Microsoft.Utils.isNullOrUndefined(data.Errors) && data.Errors.length > 0) {
                                        _this.errorMessage(data.Errors[0].ErrorMessage);
                                        _this.showError(true);
                                    } else {
                                        _this.availableDeliveryOptions(data.DeliveryOptions);

                                        var selectedOrderDeliveryOption = new Controls.SelectedDeliveryOptionClass(null);
                                        selectedOrderDeliveryOption.DeliveryPreferenceId = 1 /* ShipToAddress */.toString();
                                        selectedOrderDeliveryOption.CustomAddress = shipToAddress;

                                        if (_this.availableDeliveryOptions().length == 1) {
                                            selectedOrderDeliveryOption.DeliveryModeText = _this.availableDeliveryOptions()[0].Description;
                                            selectedOrderDeliveryOption.DeliveryModeId = _this.availableDeliveryOptions()[0].Id;
                                        }

                                        _this.orderDeliveryOption(selectedOrderDeliveryOption);
                                        _this.errorPanel.hide();
                                    }

                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                }).fail(function (errors) {
                                    _this.errorMessage(Controls.Resources.String_66);
                                    _this.showError(true);
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                });
                                ;
                            };

                            Checkout.prototype.getItemDeliveryOptions = function () {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText);
                                var selectedLineShippingInfo = [];
                                var currentLineDeliveryOption = this.selectedLineDeliveryOption();
                                selectedLineShippingInfo[0] = {};
                                selectedLineShippingInfo[0].LineId = currentLineDeliveryOption.LineId;
                                selectedLineShippingInfo[0].ShipToAddress = currentLineDeliveryOption.CustomAddress;

                                Controls.CheckoutService.GetLineDeliveryOptionsForShipping(selectedLineShippingInfo).done(function (data) {
                                    if (!Microsoft.Utils.isNullOrUndefined(data.Errors) && data.Errors.length > 0) {
                                        _this.errorMessage(data.Errors[0].ErrorMessage);
                                        _this.showError(true);
                                    } else {
                                        if (!Microsoft.Utils.isNullOrEmpty(data.LineDeliveryOptions)) {
                                            for (var i = 0; i < data.LineDeliveryOptions.length; i++) {
                                                if (data.LineDeliveryOptions[i].LineId == _this.selectedLineDeliveryOption().LineId) {
                                                    _this.availableDeliveryOptions(data.LineDeliveryOptions[i].DeliveryOptions);
                                                }
                                            }
                                        } else {
                                            _this.errorMessage(Controls.Resources.String_66);
                                            _this.showError(true);
                                            Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                            return;
                                        }

                                        if (_this.availableDeliveryOptions().length == 1) {
                                            _this.selectedLineDeliveryOption().DeliveryModeText = _this.availableDeliveryOptions()[0].Description;
                                            _this.selectedLineDeliveryOption().DeliveryModeId = _this.availableDeliveryOptions()[0].Id;
                                            _this.selectedLineDeliveryOption(_this.selectedLineDeliveryOption());
                                        }

                                        _this.errorPanel.hide();
                                    }

                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                }).fail(function (errors) {
                                    _this.errorMessage(Controls.Resources.String_66);
                                    _this.showError(true);
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                });
                            };

                            Checkout.prototype.getNearbyStoresWithAvailabilityService = function () {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText);
                                var items;

                                if (this.selectedOrderDeliveryPreference() == 4 /* DeliverItemsIndividually */) {
                                    items = [this.item()];
                                } else if (this.selectedOrderDeliveryPreference() == 2 /* PickupFromStore */) {
                                    items = this.cart().Items;
                                }

                                Controls.StoreProductAvailabilityService.GetNearbyStoresWithAvailability(this.searchLocation.latitude, this.searchLocation.longitude, items).done(function (data) {
                                    if (!Microsoft.Utils.isNullOrUndefined(data.Errors) && data.Errors.length > 0) {
                                        _this.errorMessage(data.Errors[0].ErrorMessage);
                                        _this.showError(true);
                                    } else {
                                        if (Microsoft.Utils.isNullOrEmpty(data.Stores) || data.Stores.length == 0) {
                                            _this.resetSelectedOrderShippingOptions();
                                            _this.displayLocations(null);
                                            _this._availableStoresView.hide();
                                            _this.errorMessage(Controls.Resources.String_107);
                                            _this.showError(true);
                                        } else {
                                            _this.stores = data.Stores;
                                            _this.updateItemAvailibilities();
                                            _this.renderAvailableStores();
                                            _this.errorPanel.hide();
                                        }
                                    }

                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                }).fail(function (errors) {
                                    _this.errorMessage(Controls.Resources.String_108);
                                    _this.showError(true);
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                });
                            };

                            Checkout.prototype.getNearbyStoresService = function () {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText);

                                Controls.StoreProductAvailabilityService.GetNearbyStores(this.searchLocation.latitude, this.searchLocation.longitude).done(function (data) {
                                    if (!Microsoft.Utils.isNullOrUndefined(data.Errors) && data.Errors.length > 0) {
                                        _this.errorMessage(data.Errors[0].ErrorMessage);
                                        _this.showError(true);
                                    } else {
                                        if (Microsoft.Utils.isNullOrEmpty(data.Stores) || data.Stores.length == 0) {
                                            _this.resetSelectedOrderShippingOptions();
                                            _this.displayLocations(null);
                                            _this._availableStoresView.hide();
                                            _this.errorMessage(Controls.Resources.String_107);
                                            _this.showError(true);
                                        } else {
                                            _this.stores = data.Stores;
                                            _this.renderAvailableStores();
                                            _this.errorPanel.hide();
                                        }
                                    }

                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                }).fail(function (errors) {
                                    _this.errorMessage(Controls.Resources.String_108);
                                    _this.showError(true);
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                });
                            };

                            Checkout.prototype.getCountryRegionInfoService = function () {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText);

                                Controls.ChannelService.GetCountryRegionInfo().done(function (data) {
                                    if (!Microsoft.Utils.isNullOrUndefined(data.Errors) && data.Errors.length > 0) {
                                        _this.errorMessage(_this.errorMessage() + data.Errors[0].ErrorMessage);
                                        _this.showError(true);
                                    } else {
                                        if (Microsoft.Utils.isNullOrUndefined(data.Countries) || data.Countries.length == 0) {
                                            _this.errorMessage(_this.errorMessage() + Controls.Resources.String_165);
                                            _this.showError(true);
                                        } else {
                                            _this.countries(data.Countries);
                                        }
                                    }

                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                }).fail(function (errors) {
                                    _this.errorMessage(_this.errorMessage() + Controls.Resources.String_165);
                                    _this.showError(true);
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                });
                            };

                            Checkout.prototype.getStateProvinceInfoService = function (countryCode) {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText);
                                if (!Microsoft.Utils.isNullOrWhiteSpace(countryCode)) {
                                    Controls.ChannelService.GetStateProvinceInfo(countryCode).done(function (data) {
                                        if (!Microsoft.Utils.isNullOrUndefined(data.Errors) && data.Errors.length > 0) {
                                            _this.errorMessage(data.Errors[0].ErrorMessage);
                                            _this.showError(true);
                                        } else {
                                            _this.states(data.StateProvinces);

                                            if (_this._checkoutView.find(" ." + _this._checkoutFragments.DeliveryPreferences).is(":visible")) {
                                                var tempAddress = _this.tempShippingAddress();
                                                if (_this.selectedOrderDeliveryPreference() == 1 /* ShipToAddress */) {
                                                    if (!Microsoft.Utils.isNullOrUndefined(_this.cart().SelectedDeliveryOption.CustomAddress) && !Microsoft.Utils.isNullOrUndefined(_this.cart().SelectedDeliveryOption.CustomAddress.State)) {
                                                        tempAddress.State = _this.cart().SelectedDeliveryOption.CustomAddress.State;
                                                    } else {
                                                        tempAddress.State = '';
                                                    }
                                                } else if (_this.itemSelectedDeliveryPreference() == 1 /* ShipToAddress */ && !Microsoft.Utils.isNullOrUndefined(_this.selectedLineDeliveryOption().CustomAddress) && Microsoft.Utils.isNullOrUndefined(_this.selectedLineDeliveryOption().CustomAddress.State)) {
                                                    tempAddress.State = '';
                                                }

                                                _this.tempShippingAddress(tempAddress);
                                            } else if (!Microsoft.Utils.isNullOrUndefined(_this.paymentCard().PaymentAddress) && Microsoft.Utils.isNullOrUndefined(_this.paymentCard().PaymentAddress.State)) {
                                                _this.paymentCard().PaymentAddress.State = '';
                                            }
                                        }

                                        _this.errorPanel.hide();
                                        Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                    }).fail(function (errors) {
                                        _this.errorMessage(Controls.Resources.String_185);
                                        _this.showError(true);
                                        Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                    });
                                }
                            };

                            Checkout.prototype.isAuthenticatedSession = function () {
                                var _this = this;
                                Controls.CheckoutService.IsAuthenticatedSession().done(function (data) {
                                    if (!Microsoft.Utils.isNullOrUndefined(data.Errors) && data.Errors.length > 0) {
                                        _this.errorMessage(_this.errorMessage() + data.Errors[0].ErrorMessage);
                                        _this.showError(true);
                                    } else {
                                        _this.isAuthenticated = data.IsTrue;

                                        if (_this.isAuthenticated) {
                                            _this.getUserEmail();
                                            _this.getUserAddresses();
                                        }
                                    }
                                }).fail(function (errors) {
                                    _this.isAuthenticated = false;
                                });
                            };

                            Checkout.prototype.getUserEmail = function () {
                                var _this = this;
                                Controls.CheckoutService.GetUserEmail().done(function (data) {
                                    _this.email = data.Value;
                                }).fail(function (errors) {
                                });
                            };

                            Checkout.prototype.getUserAddresses = function () {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText);

                                Controls.CustomerService.GetAddresses().done(function (data) {
                                    var addresses = [];

                                    for (var i = 0; i < data.Addresses.length; i++) {
                                        var address = data.Addresses[i];

                                        if (Microsoft.Utils.isNullOrWhiteSpace(address.Name) && Microsoft.Utils.isNullOrWhiteSpace(address.Street) && Microsoft.Utils.isNullOrWhiteSpace(address.City) && Microsoft.Utils.isNullOrWhiteSpace(address.State) && Microsoft.Utils.isNullOrWhiteSpace(address.ZipCode)) {
                                            continue;
                                        }

                                        var delimiter = Microsoft.Utils.isNullOrWhiteSpace(address.State) && Microsoft.Utils.isNullOrWhiteSpace(address.ZipCode) ? "" : ", ";
                                        var addressString = Microsoft.Utils.format("({0}) {1} {2}{3}{4} {5}", address.Name, address.Street, address.City, delimiter, address.State, address.ZipCode);
                                        addresses.push({ Value: address, Text: addressString });
                                    }

                                    if (addresses.length > 0) {
                                        _this.addresses(addresses);
                                    }

                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                }).fail(function (errors) {
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                });
                            };

                            Checkout.prototype.setDeliveryOptions = function () {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText);

                                var orderDeliveryOption = this.orderDeliveryOption();
                                orderDeliveryOption.DeliveryPreferenceId = orderDeliveryOption.DeliveryPreferenceId;

                                Controls.CheckoutService.SetOrderDeliveryOption(orderDeliveryOption, Controls.ShoppingCartDataLevel.All).done(function (data) {
                                    if (Microsoft.Utils.isNullOrUndefined(data.Errors) || data.Errors.length <= 0) {
                                        if (!Microsoft.Utils.isNullOrWhiteSpace(_this.errorMessage() + _this.errorMessage)) {
                                            _this.errorPanel.show();
                                        }

                                        _this.showCheckoutFragment(_this._checkoutFragments.PaymentInformation);
                                    }

                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);

                                    if (_this.displayPromotionBanner()) {
                                        _this.getPromotions();
                                    }
                                }).fail(function (errors) {
                                    _this.errorMessage(_this.errorMessage() + Controls.Resources.String_67);
                                    _this.showError(true);
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                });
                            };

                            Checkout.prototype.setItemShippingOptions = function () {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText);
                                var selectedLineDeliveryOptions = [];
                                var cart = this.cart();

                                for (var i = 0; i < cart.Items.length; i++) {
                                    selectedLineDeliveryOptions[i] = {};
                                    selectedLineDeliveryOptions[i].LineId = cart.Items[i].LineId;
                                    selectedLineDeliveryOptions[i].CustomAddress = cart.Items[i].SelectedDeliveryOption.CustomAddress;
                                    selectedLineDeliveryOptions[i].DeliveryModeId = cart.Items[i].SelectedDeliveryOption.DeliveryModeId;
                                    selectedLineDeliveryOptions[i].DeliveryPreferenceId = cart.Items[i].SelectedDeliveryOption.DeliveryPreferenceId;
                                    selectedLineDeliveryOptions[i].ElectronicDeliveryEmail = cart.Items[i].SelectedDeliveryOption.ElectronicDeliveryEmail;
                                    selectedLineDeliveryOptions[i].ElectronicDeliveryEmailContent = cart.Items[i].SelectedDeliveryOption.ElectronicDeliveryEmailContent;
                                    selectedLineDeliveryOptions[i].StoreAddress = cart.Items[i].SelectedDeliveryOption.StoreAddress;
                                }

                                Controls.CheckoutService.SetLineDeliveryOptions(selectedLineDeliveryOptions, Controls.ShoppingCartDataLevel.All).done(function (data) {
                                    if (Microsoft.Utils.isNullOrUndefined(data.Errors) || data.Errors.length <= 0) {
                                        if (!Microsoft.Utils.isNullOrWhiteSpace(_this.errorMessage() + _this.errorMessage)) {
                                            _this.errorPanel.show();
                                        }

                                        _this.showCheckoutFragment(_this._checkoutFragments.PaymentInformation);
                                    }

                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);

                                    if (_this.displayPromotionBanner()) {
                                        _this.getPromotions();
                                    }
                                }).fail(function (errors) {
                                    _this.errorMessage(_this.errorMessage() + Controls.Resources.String_67);
                                    _this.showError(true);
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                });
                            };

                            Checkout.prototype.getPaymentCardTypes = function () {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText);

                                Controls.CheckoutService.GetPaymentCardTypes().done(function (data) {
                                    if (!Microsoft.Utils.isNullOrUndefined(data.Errors) && data.Errors.length > 0) {
                                        _this.errorMessage(_this.errorMessage() + data.Errors[0].ErrorMessage);
                                        _this.showError(true);
                                    } else {
                                        _this.paymentCardTypes(data.CardTypes);
                                        if (Microsoft.Utils.isNullOrWhiteSpace(_this.errorMessage)) {
                                            _this.errorPanel.hide();
                                        }
                                    }

                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                }).fail(function (errors) {
                                    _this.errorMessage(_this.errorMessage() + Controls.Resources.String_68);
                                    _this.showError(true);
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                });
                            };

                            Checkout.prototype.getLoyaltyCards = function () {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText);

                                Controls.LoyaltyService.GetLoyaltyCards().done(function (data) {
                                    if (!Microsoft.Utils.isNullOrUndefined(data.Errors) && data.Errors.length > 0) {
                                        _this.errorMessage(data.Errors[0].ErrorMessage);
                                        _this.showError(true);
                                    } else {
                                        var loyaltyCards = [];
                                        var _customLoyaltyRadio = _this._paymentView.find("#CustomLoyaltyRadio");
                                        var containsValidLoyaltyCard = false;

                                        for (var i = 0; i < data.LoyaltyCards.length; i++) {
                                            if (data.LoyaltyCards[i].CardTenderType == 0 /* AsCardTender */ || data.LoyaltyCards[i].CardTenderType == 1 /* AsContactTender */) {
                                                loyaltyCards.push(data.LoyaltyCards[i].CardNumber);
                                                containsValidLoyaltyCard = true;
                                            }
                                        }

                                        if (!containsValidLoyaltyCard) {
                                            _customLoyaltyRadio.hide();
                                        } else {
                                            _customLoyaltyRadio.show();

                                            _this.loyaltyCardNumber(loyaltyCards[0].CardNumber);
                                        }

                                        _this.loyaltyCards(loyaltyCards);
                                        _this.errorPanel.hide();
                                    }

                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                }).fail(function (errors) {
                                    _this.errorMessage(Controls.Resources.String_150);
                                    _this.showError(true);
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                });
                            };

                            Checkout.prototype.updateLoyaltyCardId = function () {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText, Controls.Resources.String_179);
                                var loyaltyCardId = this._editRewardCardDialog.find('#RewardCardTextBox').val();

                                if (!Microsoft.Utils.isNullOrWhiteSpace(loyaltyCardId)) {
                                    Controls.LoyaltyService.UpdateLoyaltyCardId(true, loyaltyCardId, Controls.ShoppingCartDataLevel.All).done(function (data) {
                                        _this.closeEditRewardCardDialog();
                                        Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);

                                        if (_this.displayPromotionBanner()) {
                                            _this.getPromotions();
                                        }
                                    }).fail(function (errors) {
                                        _this.errorMessage(Controls.Resources.String_164);
                                        _this.showError(true);
                                        _this.closeEditRewardCardDialog();
                                        Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                    });
                                }
                            };

                            Checkout.prototype.getTenderTypes = function () {
                                var _this = this;
                                Controls.ChannelService.GetTenderTypes().done(function (data) {
                                    if (!Microsoft.Utils.isNullOrUndefined(data.Errors) && data.Errors.length > 0) {
                                        _this.errorMessage(data.Errors[0].ErrorMessage);
                                        _this.showError(true);
                                    } else {
                                        _this.checkForGiftCardInCart();

                                        if (data.HasCreditCardPayment) {
                                            _this._paymentView.find('.msax-PayCreditCard').show();
                                            _this._paymentView.find('.msax-PayCreditCard .msax-PayCreditCardLink').show();
                                            _this._creditCardPanel.hide();
                                        } else {
                                            _this._paymentView.find('.msax-PayCreditCard').hide();
                                        }

                                        if (!_this.anyGiftCard && data.HasGiftCardPayment) {
                                            _this._paymentView.find('.msax-PayGiftCard').show();
                                            _this._giftCardPanel.hide();
                                            _this._paymentView.find('.msax-PayGiftCard .msax-PayGiftCardLink').show();
                                        } else {
                                            _this._paymentView.find('.msax-PayGiftCard').hide();
                                        }

                                        if (data.HasLoyaltyCardPayment) {
                                            _this._paymentView.find('.msax-PayLoyaltyCard').show();
                                            _this._loyaltyCardPanel.hide();
                                            _this._paymentView.find('.msax-PayLoyaltyCard .msax-PayLoyaltyCardLink').show();
                                        } else {
                                            _this._paymentView.find('.msax-PayLoyaltyCard').hide();
                                        }

                                        _this.removeValidation(_this._creditCardPanel);
                                        _this.removeValidation(_this._giftCardPanel);
                                        _this.removeValidation(_this._loyaltyCardPanel);
                                    }
                                }).fail(function (errors) {
                                    _this.errorMessage(_this.errorMessage() + Controls.Resources.String_138);
                                    _this.showError(true);
                                });
                            };

                            Checkout.prototype.getGiftCardBalance = function () {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText);
                                this._paymentView.find('.msax-GiftCardBalance').hide();
                                if (!Microsoft.Utils.isNullOrWhiteSpace(this.giftCardNumber())) {
                                    Controls.CheckoutService.GetGiftCardBalance(this.giftCardNumber()).done(function (data) {
                                        if (!Microsoft.Utils.isNullOrUndefined(data.Errors) && data.Errors.length > 0) {
                                            _this.errorMessage(data.Errors[0].ErrorMessage);
                                            _this.showError(true);
                                        } else {
                                            if (!data.GiftCardInformation.IsInfoAvailable) {
                                                _this.isGiftCardInfoAvailable(false);
                                            } else {
                                                if (_this.checkGiftCardAmountValidity) {
                                                    if (Number(data.GiftCardInformation.Balance) < Number(_this.giftCardAmount)) {
                                                        _this.errorMessage(Controls.Resources.String_148);
                                                        _this.showError(false);
                                                    }
                                                }

                                                _this.isGiftCardInfoAvailable(true);
                                                _this.giftCardBalance(data.GiftCardInformation.BalanceWithCurrency);
                                            }

                                            _this._paymentView.find('.msax-GiftCardBalance').show();
                                            _this.errorPanel.hide();

                                            if (data.GiftCardInformation.IsInfoAvailable && _this.checkGiftCardAmountValidity) {
                                                _this.createPaymentCardTenderLine();
                                            }

                                            _this.checkGiftCardAmountValidity = false;
                                        }

                                        Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                    }).fail(function (errors) {
                                        _this.errorMessage(Controls.Resources.String_145);
                                        _this.showError(true);
                                        Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                        _this.checkGiftCardAmountValidity = false;
                                    });
                                } else {
                                    this.errorMessage(Controls.Resources.String_144);
                                    this.showError(false);
                                    Controls.LoadingOverlay.CloseLoadingDialog(this._loadingDialog);
                                    this.checkGiftCardAmountValidity = false;
                                }
                            };

                            Checkout.prototype.applyFullGiftCardAmount = function () {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText);
                                if (!Microsoft.Utils.isNullOrWhiteSpace(this.giftCardNumber())) {
                                    Controls.CheckoutService.GetGiftCardBalance(this.giftCardNumber()).done(function (data) {
                                        if (!Microsoft.Utils.isNullOrUndefined(data.Errors) && data.Errors.length > 0) {
                                            _this.errorMessage(data.Errors[0].ErrorMessage);
                                            _this.showError(true);
                                        } else {
                                            var totalAmount = _this.cart().TotalAmount;
                                            var giftCardBalance = data.GiftCardInformation.Balance;
                                            var giftCardBalanceWithCurrency = data.GiftCardInformation.BalanceWithCurrency;
                                            var _giftCardTextBox = _this._paymentView.find('#GiftCardAmount');
                                            if (!data.GiftCardInformation.IsInfoAvailable) {
                                                _this.isGiftCardInfoAvailable(false);
                                            } else {
                                                _this.isGiftCardInfoAvailable(true);
                                                _this.giftCardBalance(giftCardBalance);

                                                if (Number(giftCardBalance) <= Number(totalAmount)) {
                                                    _giftCardTextBox.val(giftCardBalanceWithCurrency);
                                                    _this.updatePaymentTotal();
                                                } else {
                                                    _giftCardTextBox.val(totalAmount);
                                                    _this._creditCardPanel.hide();
                                                    _this._paymentView.find('.msax-PayCreditCard .msax-PayCreditCardLink').show();
                                                    _this.payCreditCard(false);

                                                    _this._loyaltyCardPanel.hide();
                                                    _this._paymentView.find('.msax-PayLoyaltyCard .msax-PayLoyaltyCardLink').show();
                                                    _this.payLoyaltyCard(false);
                                                }
                                            }

                                            _this._paymentView.find('.msax-GiftCardBalance').show();
                                            _this.errorPanel.hide();
                                        }

                                        Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                    }).fail(function (errors) {
                                        _this.errorMessage(Controls.Resources.String_145);
                                        _this.showError(true);
                                        Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                    });
                                } else {
                                    this.errorMessage(Controls.Resources.String_144);
                                    this.showError(false);
                                    Controls.LoadingOverlay.CloseLoadingDialog(this._loadingDialog);
                                }
                            };

                            Checkout.prototype.submitOrder = function () {
                                var _this = this;
                                Controls.LoadingOverlay.ShowLoadingDialog(this._loadingDialog, this._loadingText, Controls.Resources.String_180);

                                Controls.CheckoutService.SubmitOrder(this.tenderLines, this.paymentCard().PaymentAddress.Email).done(function (data) {
                                    if (!Microsoft.Utils.isNullOrUndefined(data.Errors) && data.Errors.length > 0) {
                                        switch (data.Errors[0].ErrorCode) {
                                            case "Microsoft_Dynamics_Commerce_Runtime_BlockedLoyaltyCard":
                                                _this.errorMessage(Controls.Resources.String_154);
                                                break;
                                            case "Microsoft_Dynamics_Commerce_Runtime_NoTenderLoyaltyCard":
                                                _this.errorMessage(Controls.Resources.String_155);
                                                break;
                                            case "Microsoft_Dynamics_Commerce_Runtime_NotEnoughRewardPoints":
                                                _this.errorMessage(Controls.Resources.String_156);
                                                break;
                                            case "Microsoft_Dynamics_Commerce_Runtime_InvalidLoyaltyCardNumber":
                                                _this.errorMessage(Controls.Resources.String_157);
                                                break;
                                            default:
                                                _this.errorMessage(data.Errors[0].ErrorMessage);
                                                break;
                                        }

                                        _this.showError(false);
                                    } else {
                                        _this.orderNumber(data.OrderNumber);
                                        _this.errorPanel.hide();
                                        if (Microsoft.Utils.isNullOrWhiteSpace(msaxValues.msax_OrderConfirmationUrl)) {
                                            _this.showCheckoutFragment(_this._checkoutFragments.Confirmation);
                                        } else {
                                            window.location.href = msaxValues.msax_OrderConfirmationUrl += '?confirmationId=' + data.OrderNumber;
                                        }
                                    }

                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                }).fail(function (errors) {
                                    _this.errorMessage(Controls.Resources.String_69);
                                    _this.showError(true);
                                    Controls.LoadingOverlay.CloseLoadingDialog(_this._loadingDialog);
                                });
                            };
                            return Checkout;
                        })();
                        Controls.Checkout = Checkout;
                    })(Sdk.Controls || (Sdk.Controls = {}));
                    var Controls = Sdk.Controls;
                })(Ecommerce.Sdk || (Ecommerce.Sdk = {}));
                var Sdk = Ecommerce.Sdk;
            })(Retail.Ecommerce || (Retail.Ecommerce = {}));
            var Ecommerce = Retail.Ecommerce;
        })(Dynamics.Retail || (Dynamics.Retail = {}));
        var Retail = Dynamics.Retail;
    })(Microsoft.Dynamics || (Microsoft.Dynamics = {}));
    var Dynamics = Microsoft.Dynamics;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.isNullOrUndefined = function (o) {
            return (o === undefined || o === null);
        };

        Utils.isNullOrEmpty = function (o) {
            return (Utils.isNullOrUndefined(o) || o === '');
        };

        Utils.isNullOrWhiteSpace = function (o) {
            return (Utils.isNullOrEmpty(o) || (typeof o === 'string' && o.replace(/\s/g, '').length < 1));
        };

        Utils.hasElements = function (o) {
            return !Utils.isNullOrUndefined(o) && o.length > 0;
        };

        Utils.getValueOrDefault = function (o, defaultValue) {
            return Utils.isNullOrWhiteSpace(o) ? defaultValue : o;
        };

        Utils.hasErrors = function (o) {
            return (!Utils.isNullOrUndefined(o) && !this.hasElements(o.Errors));
        };

        Utils.format = function (object) {
            var params = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                params[_i] = arguments[_i + 1];
            }
            if (Utils.isNullOrWhiteSpace(object)) {
                return object;
            }

            if (params == null) {
                throw Microsoft.Dynamics.Retail.Ecommerce.Sdk.Controls.Resources.String_70;
            }

            for (var index = 0; index < params.length; index++) {
                if (params[index] == null) {
                    throw Microsoft.Dynamics.Retail.Ecommerce.Sdk.Controls.Resources.String_70;
                }

                var regexp = new RegExp('\\{' + index + '\\}', 'gi');
                object = object.replace(regexp, params[index]);
            }

            return object;
        };

        Utils.parseNumberFromLocaleString = function (localizedNumberString) {
            var currDecimalOperator = this.getDecimalOperatorForUiCulture();

            var numberTokens = localizedNumberString.split(currDecimalOperator);
            if (numberTokens.length > 2) {
                throw "Please enter a valid number";
            }

            var regexp = new RegExp("[^0-9]", "gi");
            var integerDigits = numberTokens[0].replace(regexp, "");
            var fractionalDigits = "";
            if (numberTokens.length == 2) {
                fractionalDigits = numberTokens[1].replace(regexp, "");
            }

            var numberString = integerDigits + '.' + fractionalDigits;

            var parsedNumber = parsedNumber = Number(numberString);
            if (isNaN(parsedNumber)) {
                parsedNumber = 0;
            }
            return parsedNumber;
        };

        Utils.getDecimalOperatorForUiCulture = function () {
            return '.';
        };

        Utils.formatNumber = function (numberValue) {
            var formattedNumber = numberValue.toFixed(2);
            return formattedNumber;
        };

        Utils.getCurrentUiCulture = function () {
            if (!Utils.isNullOrWhiteSpace(this.currentUiCulture)) {
                return this.currentUiCulture;
            }

            var uiCulture = Utils.getCookieValue(this.uiCultureCookieName);

            if (Utils.isNullOrWhiteSpace(uiCulture)) {
                uiCulture = this.defaultUiCulture;
            }

            return uiCulture;
        };

        Utils.getCookieValue = function (cookieName) {
            var nameWithEqSign = cookieName + "=";
            var allCookies = document.cookie.split(';');
            for (var i = 0; i < allCookies.length; i++) {
                var singleCookie = allCookies[i];
                while (singleCookie.charAt(0) == ' ') {
                    singleCookie = singleCookie.substring(1, singleCookie.length);
                }
                if (singleCookie.indexOf(nameWithEqSign) == 0) {
                    return singleCookie.substring(nameWithEqSign.length, singleCookie.length);
                }
            }

            return null;
        };

        Utils.clone = function (origObject) {
            return Utils.safeClone(origObject, []);
        };

        Utils.safeClone = function (origObject, cloneMap) {
            if (Utils.isNullOrUndefined(origObject)) {
                return origObject;
            }

            var newObj;
            if (origObject instanceof Array) {
                if (!cloneMap.some(function (val) {
                    if (val.id === origObject) {
                        newObj = val.value;
                        return true;
                    }

                    return false;
                })) {
                    newObj = [];
                    cloneMap.push({ id: origObject, value: newObj });
                    for (var i = 0; i < origObject.length; i++) {
                        if (typeof origObject[i] == "object") {
                            newObj.push(Utils.safeClone(origObject[i], cloneMap));
                        } else {
                            newObj.push(origObject[i]);
                        }
                    }
                }
            } else if (origObject instanceof Date) {
                newObj = new Date(origObject.valueOf());
            } else if (origObject instanceof Object) {
                if (!cloneMap.some(function (val) {
                    if (val.id === origObject) {
                        newObj = val.value;
                        return true;
                    }

                    return false;
                })) {
                    newObj = $.extend(false, {}, origObject);
                    cloneMap.push({ id: origObject, value: newObj });
                    for (var property in newObj) {
                        if (newObj.hasOwnProperty(property)) {
                            if (typeof newObj[property] == "object") {
                                if (property === "__metadata") {
                                    newObj[property] = $.extend(false, {}, origObject[property]);
                                } else {
                                    newObj[property] = Utils.safeClone(origObject[property], cloneMap);
                                }
                            }
                        }
                    }
                }
            } else {
                newObj = origObject;
            }

            return newObj;
        };
        Utils.currentUiCulture = "";
        Utils.defaultUiCulture = "en-US";
        Utils.uiCultureCookieName = "cuid";
        return Utils;
    })();
    Microsoft.Utils = Utils;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (Dynamics) {
        (function (Retail) {
            (function (Ecommerce) {
                (function (Sdk) {
                    (function (Controls) {
                        

                        var AsyncResult = (function () {
                            function AsyncResult() {
                                this._callerContext = this;
                                this._succeded = false;
                                this._failed = false;
                                this._successCallbacks = [];
                                this._errorCallbacks = [];
                            }
                            AsyncResult.prototype.resolve = function (result) {
                                this._succeded = true;
                                this._result = result;

                                FunctionQueueHelper.callFunctions(this._successCallbacks, this._callerContext, this._result);
                            };

                            AsyncResult.prototype.reject = function (errors) {
                                this._failed = true;
                                this._errors = errors;

                                FunctionQueueHelper.callFunctions(this._errorCallbacks, this._callerContext, this._errors);
                            };

                            AsyncResult.prototype.done = function (callback) {
                                if (this._succeded && callback) {
                                    callback.call(this._callerContext, this._result);
                                } else {
                                    FunctionQueueHelper.queueFunction(this._successCallbacks, callback);
                                }

                                return this;
                            };

                            AsyncResult.prototype.fail = function (callback) {
                                if (this._failed && callback) {
                                    callback.call(this._callerContext, this._errors);
                                } else {
                                    FunctionQueueHelper.queueFunction(this._errorCallbacks, callback);
                                }

                                return this;
                            };
                            return AsyncResult;
                        })();
                        Controls.AsyncResult = AsyncResult;

                        var FunctionQueueHelper = (function () {
                            function FunctionQueueHelper() {
                            }
                            FunctionQueueHelper.callFunctions = function (functionQueue, callerContext, data) {
                                if (!Microsoft.Utils.hasElements(functionQueue)) {
                                    return;
                                }

                                for (var i = 0; i < functionQueue.length; i++) {
                                    functionQueue[i].call(callerContext, data);
                                }

                                functionQueue = [];
                            };

                            FunctionQueueHelper.queueFunction = function (functionQueue, callback) {
                                if (!Microsoft.Utils.isNullOrUndefined(callback)) {
                                    functionQueue.push(callback);
                                }
                            };
                            return FunctionQueueHelper;
                        })();
                        Controls.FunctionQueueHelper = FunctionQueueHelper;
                    })(Sdk.Controls || (Sdk.Controls = {}));
                    var Controls = Sdk.Controls;
                })(Ecommerce.Sdk || (Ecommerce.Sdk = {}));
                var Sdk = Ecommerce.Sdk;
            })(Retail.Ecommerce || (Retail.Ecommerce = {}));
            var Ecommerce = Retail.Ecommerce;
        })(Dynamics.Retail || (Dynamics.Retail = {}));
        var Retail = Dynamics.Retail;
    })(Microsoft.Dynamics || (Microsoft.Dynamics = {}));
    var Dynamics = Microsoft.Dynamics;
})(Microsoft || (Microsoft = {}));
"use strict";
var Microsoft;
(function (Microsoft) {
    (function (Dynamics) {
        (function (Retail) {
            (function (Ecommerce) {
                (function (Sdk) {
                    (function (Controls) {
                        var ChannelService = (function () {
                            function ChannelService() {
                            }
                            ChannelService.GetProxy = function () {
                                this.proxy = new Controls.AjaxProxy(msaxValues.msax_ChannelServiceUrl + '/');
                            };

                            ChannelService.GetChannelConfiguration = function () {
                                var asyncResult = new Controls.AsyncResult();

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("GetChannelConfiguration", null, function (data) {
                                    asyncResult.resolve(data);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };

                            ChannelService.GetTenderTypes = function () {
                                var asyncResult = new Controls.AsyncResult();

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("GetChannelTenderTypes", null, function (data) {
                                    asyncResult.resolve(data);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };

                            ChannelService.GetCountryRegionInfo = function () {
                                var asyncResult = new Controls.AsyncResult();

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("GetChannelCountryRegionInfo", null, function (data) {
                                    asyncResult.resolve(data);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };

                            ChannelService.GetStateProvinceInfo = function (countryCode) {
                                var asyncResult = new Controls.AsyncResult();

                                var data = {
                                    'countryCode': countryCode
                                };

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("GetStateProvinceInfo", data, function (data) {
                                    asyncResult.resolve(data);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };
                            return ChannelService;
                        })();
                        Controls.ChannelService = ChannelService;
                    })(Sdk.Controls || (Sdk.Controls = {}));
                    var Controls = Sdk.Controls;
                })(Ecommerce.Sdk || (Ecommerce.Sdk = {}));
                var Sdk = Ecommerce.Sdk;
            })(Retail.Ecommerce || (Retail.Ecommerce = {}));
            var Ecommerce = Retail.Ecommerce;
        })(Dynamics.Retail || (Dynamics.Retail = {}));
        var Retail = Dynamics.Retail;
    })(Microsoft.Dynamics || (Microsoft.Dynamics = {}));
    var Dynamics = Microsoft.Dynamics;
})(Microsoft || (Microsoft = {}));
"use strict";
var Microsoft;
(function (Microsoft) {
    (function (Dynamics) {
        (function (Retail) {
            (function (Ecommerce) {
                (function (Sdk) {
                    (function (Controls) {
                        var CustomerService = (function () {
                            function CustomerService() {
                            }
                            CustomerService.GetProxy = function () {
                                this.proxy = new Controls.AjaxProxy(msaxValues.msax_CustomerServiceUrl + '/');
                            };

                            CustomerService.GetAddresses = function () {
                                var asyncResult = new Controls.AsyncResult();

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("GetAddresses", null, function (data) {
                                    asyncResult.resolve(data);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };
                            return CustomerService;
                        })();
                        Controls.CustomerService = CustomerService;
                    })(Sdk.Controls || (Sdk.Controls = {}));
                    var Controls = Sdk.Controls;
                })(Ecommerce.Sdk || (Ecommerce.Sdk = {}));
                var Sdk = Ecommerce.Sdk;
            })(Retail.Ecommerce || (Retail.Ecommerce = {}));
            var Ecommerce = Retail.Ecommerce;
        })(Dynamics.Retail || (Dynamics.Retail = {}));
        var Retail = Dynamics.Retail;
    })(Microsoft.Dynamics || (Microsoft.Dynamics = {}));
    var Dynamics = Microsoft.Dynamics;
})(Microsoft || (Microsoft = {}));
"use strict";
var Microsoft;
(function (Microsoft) {
    (function (Dynamics) {
        (function (Retail) {
            (function (Ecommerce) {
                (function (Sdk) {
                    (function (Controls) {
                        var LoyaltyService = (function () {
                            function LoyaltyService() {
                            }
                            LoyaltyService.GetProxy = function () {
                                this.proxy = new Controls.AjaxProxy(msaxValues.msax_LoyaltyServiceUrl + '/');
                            };

                            LoyaltyService.GetLoyaltyCards = function () {
                                var asyncResult = new Controls.AsyncResult();

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("GetLoyaltyCards", null, function (data) {
                                    asyncResult.resolve(data);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };

                            LoyaltyService.GetAllLoyaltyCardsStatus = function () {
                                var asyncResult = new Controls.AsyncResult();

                                var data = {};

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("GetAllLoyaltyCardsStatus", data, function (data) {
                                    asyncResult.resolve(data);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });
                            };

                            LoyaltyService.GetLoyaltyCardStatus = function (loyaltyCardNumber) {
                                var asyncResult = new Controls.AsyncResult();

                                var data = {
                                    "loyaltyCardNumber": loyaltyCardNumber
                                };

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("GetLoyaltyCardStatus", data, function (data) {
                                    asyncResult.resolve(data);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });
                            };

                            LoyaltyService.UpdateLoyaltyCardId = function (isCheckoutSession, loyaltyCardId, shoppingCartDataLevel) {
                                var asyncResult = new Controls.AsyncResult();

                                var data = {
                                    "isCheckoutSession": isCheckoutSession,
                                    "loyaltyCardId": loyaltyCardId,
                                    "dataLevel": shoppingCartDataLevel
                                };

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("UpdateLoyaltyCardId", data, function (data) {
                                    Controls.ShoppingCartService.UpdateShoppingCart(data, isCheckoutSession);
                                    asyncResult.resolve(data);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };
                            return LoyaltyService;
                        })();
                        Controls.LoyaltyService = LoyaltyService;
                    })(Sdk.Controls || (Sdk.Controls = {}));
                    var Controls = Sdk.Controls;
                })(Ecommerce.Sdk || (Ecommerce.Sdk = {}));
                var Sdk = Ecommerce.Sdk;
            })(Retail.Ecommerce || (Retail.Ecommerce = {}));
            var Ecommerce = Retail.Ecommerce;
        })(Dynamics.Retail || (Dynamics.Retail = {}));
        var Retail = Dynamics.Retail;
    })(Microsoft.Dynamics || (Microsoft.Dynamics = {}));
    var Dynamics = Microsoft.Dynamics;
})(Microsoft || (Microsoft = {}));
"use strict";
var Microsoft;
(function (Microsoft) {
    (function (Dynamics) {
        (function (Retail) {
            (function (Ecommerce) {
                (function (Sdk) {
                    (function (Controls) {
                        var StoreProductAvailabilityService = (function () {
                            function StoreProductAvailabilityService() {
                            }
                            StoreProductAvailabilityService.GetProxy = function () {
                                this.proxy = new Controls.AjaxProxy(msaxValues.msax_StoreProductAvailabilityServiceUrl + '/');
                            };

                            StoreProductAvailabilityService.GetNearbyStoresWithAvailability = function (latitude, longitude, items) {
                                var asyncResult = new Controls.AsyncResult();

                                var data = {
                                    "latitude": latitude,
                                    "longitude": longitude,
                                    "items": items
                                };

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("GetNearbyStoresWithAvailability", data, function (data) {
                                    asyncResult.resolve(data);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };

                            StoreProductAvailabilityService.GetNearbyStores = function (latitude, longitude) {
                                var asyncResult = new Controls.AsyncResult();

                                var data = {
                                    "latitude": latitude,
                                    "longitude": longitude
                                };

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("GetNearbyStores", data, function (data) {
                                    asyncResult.resolve(data);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };
                            return StoreProductAvailabilityService;
                        })();
                        Controls.StoreProductAvailabilityService = StoreProductAvailabilityService;
                    })(Sdk.Controls || (Sdk.Controls = {}));
                    var Controls = Sdk.Controls;
                })(Ecommerce.Sdk || (Ecommerce.Sdk = {}));
                var Sdk = Ecommerce.Sdk;
            })(Retail.Ecommerce || (Retail.Ecommerce = {}));
            var Ecommerce = Retail.Ecommerce;
        })(Dynamics.Retail || (Dynamics.Retail = {}));
        var Retail = Dynamics.Retail;
    })(Microsoft.Dynamics || (Microsoft.Dynamics = {}));
    var Dynamics = Microsoft.Dynamics;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (Dynamics) {
        (function (Retail) {
            (function (Ecommerce) {
                (function (Sdk) {
                    (function (Controls) {
                        Controls.ResourceStrings["fr"] = {
                            String_1: "(FR) Shopping cart",
                            String_2: "(FR) Product details",
                            String_3: "(FR) Each",
                            String_4: "(FR) Quantity",
                            String_5: "(FR) Line total",
                            String_6: "(FR) Remove",
                            String_7: "(FR) Savings",
                            String_8: "(FR) Update quantity",
                            String_9: "(FR) Order summary",
                            String_10: "(FR) Subtotal:",
                            String_11: "(FR) Shipping and handling:",
                            String_12: "(FR) Order total:",
                            String_13: "(FR) Total savings:",
                            String_14: "(FR) Next step",
                            String_15: "(FR) There are no items in your shopping cart. Please add items to the cart.",
                            String_16: "(FR) Delivery information",
                            String_17: "(FR) Delivery preference:",
                            String_18: "(FR) Shipping address",
                            String_19: "(FR) Shipping name",
                            String_20: "(FR) Country/region",
                            String_21: "(FR) United States",
                            String_22: "(FR) Address",
                            String_23: "(FR) City",
                            String_24: "(FR) State/province",
                            String_25: "(FR) ZIP/postal code",
                            String_26: "(FR) Shipping method",
                            String_27: "(FR) Get shipping options",
                            String_28: "(FR) Previous step",
                            String_29: "(FR) Name",
                            String_30: "(FR) Billing information",
                            String_31: "(FR) Contact information",
                            String_32: "(FR) Email address",
                            String_33: "(FR) Confirm email address",
                            String_34: "(FR) Payment method",
                            String_35: "(FR) Card number",
                            String_36: "(FR) Card type",
                            String_37: "(FR) Expiration month",
                            String_38: "(FR) Expiration year",
                            String_39: "(FR) CCID",
                            String_40: "(FR) What is this?",
                            String_41: "(FR) Payment amount",
                            String_42: "(FR) Billing address",
                            String_43: "(FR) Same as shipping address",
                            String_44: "(FR) Address2",
                            String_45: "(FR) Review and confirm",
                            String_46: "(FR) Order information",
                            String_47: "(FR) Edit",
                            String_48: "(FR) Credit card",
                            String_49: "(FR) Checkout",
                            String_50: "(FR) You have not added any promotion code to your order",
                            String_51: "(FR) Tax:",
                            String_52: "(FR) Submit order",
                            String_53: "(FR) Thank you for your order",
                            String_54: "(FR) Your order confirmation number is ",
                            String_55: "(FR) Street",
                            String_56: "(FR) State",
                            String_57: "(FR) Zipcode",
                            String_58: "(FR) Email",
                            String_59: "(FR) Payment",
                            String_60: "(FR) CardNumber",
                            String_61: "(FR) Please select shipping method",
                            String_62: "(FR) The confirm email address must match the email address.",
                            String_63: "(FR) Sorry, something went wrong. The shopping cart information couldn't be retrieved. Please refresh the page and try again.",
                            String_64: "(FR) Sorry, something went wrong. The product was not removed from the cart successfully. Please refresh the page and try again.",
                            String_65: "(FR) Sorry, something went wrong. The product quantity couldn't be updated. Please refresh the page and try again.",
                            String_66: "(FR) Sorry, something went wrong. Delivery methods could not be retrieved. Please refresh the page and try again.",
                            String_67: "(FR) Sorry, something went wrong. The shipping information was not stored successfully. Please refresh the page and try again.",
                            String_68: "(FR) Sorry, something went wrong. The payment card type information was not retrieved successfully. Please refresh the page and try again.",
                            String_69: "(FR) Sorry, something went wrong. The order submission was not successful. Please refresh the page and try again.",
                            String_70: "(FR) Invalid parameter",
                            String_71: "(FR) validatorType attribute is not provided for validator binding.",
                            String_72: "(FR) Use text characters only. Numbers, spaces, and special characters are not allowed.",
                            String_73: "(FR) Use text characters only. Numbers, spaces, and special characters are not allowed.",
                            String_74: "(FR) The quantity field cannot be empty",
                            String_75: "(FR) Select delivery method.",
                            String_76: "(FR) The email address is invalid.",
                            String_77: "(FR) Please enter the name.",
                            String_78: "(FR) Please enter the street number.",
                            String_79: "(FR) Please enter the address.",
                            String_80: "(FR) Please enter the city.",
                            String_81: "(FR) Please enter the zip/postal code.",
                            String_82: "(FR) Please enter the state.",
                            String_83: "(FR) Please enter the country.",
                            String_84: "(FR) Please specify a payment card name.",
                            String_85: "(FR) Please enter a valid card number.",
                            String_86: "(FR) Please enter a valid CCID.",
                            String_87: "(FR) Please specify a valid amount.",
                            String_88: "(FR) {0} PRODUCT(S)",
                            String_89: "(FR) Included",
                            String_90: "(FR) Color: {0}",
                            String_91: "(FR) Size: {0}",
                            String_92: "(FR) Style: {0}",
                            String_93: "(FR) Sorry, something went wrong. The promotion code could not be added successfully. Please refresh the page and try again.",
                            String_94: "(FR) Sorry, something went wrong. The promotion code could not be removed successfully. Please refresh the page and try again.",
                            String_95: "(FR) Apply",
                            String_96: "(FR) Promotion Codes",
                            String_97: "(FR) Please enter a promotion code",
                            String_98: "(FR) Sorry, something went wrong. The channel configuration could not be retrieved successfully. Please refresh the page and try again.",
                            String_99: "(FR) Ship items",
                            String_100: "(FR) Pick up in store",
                            String_101: "(FR) Select delivery options by item",
                            String_102: "(FR) Find a store",
                            String_103: "(FR) miles",
                            String_104: "(FR) Available stores",
                            String_105: "(FR) Store",
                            String_106: "(FR) Distance",
                            String_107: "(FR) Products are not available for pick up in the stores around the location you searched. Please update your delivery preferences and try again.",
                            String_108: "(FR) Sorry, something went wrong. An error occurred while trying to get stores. Please refresh the page and try again.",
                            String_109: "(FR) Sorry, we were not able to decipher the address you gave us.  Please enter a valid Address",
                            String_110: "(FR) Sorry, something went wrong. An error has occured while looking up the address you provided. Please refresh the page and try again.",
                            String_111: "(FR) Products are not available in this store",
                            String_112: "(FR) Product availability:",
                            String_113: "(FR) Products are not available in the selected store, Please select a different store",
                            String_114: "(FR) Please select a store for pick up",
                            String_115: "(FR) Store address",
                            String_116: "(FR) Send to me",
                            String_117: "(FR) Optional note",
                            String_118: "(FR) Please enter email address for gift card delivery",
                            String_119: "(FR) Sorry, something went wrong. An error occurred while trying to get the email address. Please enter the email address in the text box below",
                            String_120: "(FR) Enter the shipping address and then click get shipping options to view the shipping options that are available for your area.",
                            String_121: "(FR) Delivery method",
                            String_122: "(FR) Select your delivery preference",
                            String_123: "(FR) Cancel",
                            String_124: "(FR) Done",
                            String_125: "(FR) for product: {0}",
                            String_126: "(FR) Please select delivery preference for product {0}",
                            String_127: "(FR) Add credit card",
                            String_128: "(FR) Gift card",
                            String_129: "(FR) Add gift card",
                            String_130: "(FR) Loyalty card",
                            String_131: "(FR) Add loyalty card",
                            String_132: "(FR) Payment information",
                            String_133: "(FR) Payment total:",
                            String_134: "(FR) Order total:",
                            String_135: "(FR) Gift card does not exist",
                            String_136: "(FR) Gift card balance",
                            String_137: "(FR) Card details",
                            String_138: "(FR) Sorry, something went wrong. An error occurred while trying to get payment methods supported by the store. Please refresh the page and try again.",
                            String_139: "(FR) Please select payment method",
                            String_140: "(FR) The expiration date is not valid. Please select valid expiration month and year and then try again",
                            String_141: "(FR) Please enter a valid gift card number",
                            String_142: "(FR) Get gift card balance",
                            String_143: "(FR) Apply full amount",
                            String_144: "(FR) Please enter a gift card number",
                            String_145: "(FR) Sorry, something went wrong. An error occurred while trying to get gift card balance. Please refresh the page and try again.",
                            String_146: "(FR) Gift card payment amount cannot be zero",
                            String_147: "(FR) Gift card payment amount is more than order total",
                            String_148: "(FR) Gift card does not have sufficient balance",
                            String_149: "(FR) Payment amount is different from the order total",
                            String_150: "(FR) Sorry, something went wrong. An error occurred while trying to get loyalty card information. Please refresh the page and try again.",
                            String_151: "(FR) Please enter a valid loyalty card number",
                            String_152: "(FR) Loyalty card payment amount cannot be zero",
                            String_153: "(FR) Loyalty card payment amount is more than order total",
                            String_154: "(FR) The loyalty card is blocked",
                            String_155: "(FR) The loyalty card is not allowed for payment",
                            String_156: "(FR) The loyalty payment amount exceeds what is allowed for this loyalty card in this transaction",
                            String_157: "(FR) The loyalty card number does not exist",
                            String_158: "(FR) Please select delivery preference",
                            String_159: "(FR) Please select a delivery preference...",
                            String_160: "(FR) Sorry, something went wrong. An error occurred while trying to get delivery methods information. Please refresh the page and try again.",
                            String_161: "(FR) Select address...",
                            String_162: "(FR) You have not added loyalty card number to your order",
                            String_163: "(FR) Enter a reward card for the current order. You can include only one reward card per order",
                            String_164: "(FR) Sorry, something went wrong. An error occurred while trying to update reward card id in cart. Please refresh the page and try again.",
                            String_165: "(FR) Sorry, something went wrong. An error occurred while retrieving the country region information. Please refresh the page and try again.",
                            String_166: "(FR) TBD",
                            String_167: "(FR) Mini Cart",
                            String_168: "(FR) Ordering FAQ",
                            String_169: "(FR) Return policy",
                            String_170: "(FR) Store locator tool",
                            String_171: "(FR) Continue shopping",
                            String_172: "(FR) Cart Order Total",
                            String_173: "(FR) View full cart contents",
                            String_174: "(FR) Quantity:",
                            String_175: "(FR) Added to your cart:",
                            String_176: "(FR) Loading ...",
                            String_177: "(FR) Sorry, something went wrong. The cart's promotion information couldn't be retrieved. Please refresh the page and try again.",
                            String_178: "(FR) Delivery method",
                            String_179: "(FR) Updating shopping cart ...",
                            String_180: "(FR) Submitting order ...",
                            String_181: "(FR) Discount code",
                            String_182: "(FR) Add coupon code",
                            String_183: "(FR) Enter a discount code",
                            String_184: "(FR) Please enter a valid discount code",
                            String_185: "(FR) Sorry, something went wrong. An error occurred while retrieving the state/province information. Please refresh the page and try again.",
                            String_186: "(FR) Edit reward card",
                            String_187: "(FR) Reward card",
                            String_188: "(FR) Add discount code",
                            String_189: "(FR) Select country/region",
                            String_190: "(FR) Select state/province",
                            String_191: "(FR) You have selected multiple delivery methods for this order",
                            String_192: "(FR) 01-January",
                            String_193: "(FR) 02-February",
                            String_194: "(FR) 03-March",
                            String_195: "(FR) 04-April",
                            String_196: "(FR) 05-May",
                            String_197: "(FR) 06-June",
                            String_198: "(FR) 07-July",
                            String_199: "(FR) 08-August",
                            String_200: "(FR) 09-September",
                            String_201: "(FR) 10-October",
                            String_202: "(FR) 11-November",
                            String_203: "(FR) 12-December"
                        };
                    })(Sdk.Controls || (Sdk.Controls = {}));
                    var Controls = Sdk.Controls;
                })(Ecommerce.Sdk || (Ecommerce.Sdk = {}));
                var Sdk = Ecommerce.Sdk;
            })(Retail.Ecommerce || (Retail.Ecommerce = {}));
            var Ecommerce = Retail.Ecommerce;
        })(Dynamics.Retail || (Dynamics.Retail = {}));
        var Retail = Dynamics.Retail;
    })(Microsoft.Dynamics || (Microsoft.Dynamics = {}));
    var Dynamics = Microsoft.Dynamics;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (Dynamics) {
        (function (Retail) {
            (function (Ecommerce) {
                (function (Sdk) {
                    (function (Controls) {
                        Controls.ResourceStrings["en-us"] = {
                            String_1: "Shopping cart",
                            String_2: "Product details",
                            String_3: "Each",
                            String_4: "Quantity",
                            String_5: "Line total",
                            String_6: "Remove",
                            String_7: "Savings",
                            String_8: "Update quantity",
                            String_9: "Order summary",
                            String_10: "Subtotal:",
                            String_11: "Shipping and handling:",
                            String_12: "Order total:",
                            String_13: "Total savings:",
                            String_14: "Next step",
                            String_15: "There are no items in your shopping cart. Please add items to the cart.",
                            String_16: "Delivery information",
                            String_17: "Delivery preference:",
                            String_18: "Shipping address",
                            String_19: "Shipping name",
                            String_20: "Country/region",
                            String_21: "United States",
                            String_22: "Address",
                            String_23: "City",
                            String_24: "State/province",
                            String_25: "ZIP/postal code",
                            String_26: "Shipping method",
                            String_27: "Get shipping options",
                            String_28: "Previous step",
                            String_29: "Name",
                            String_30: "Billing information",
                            String_31: "Contact information",
                            String_32: "Email address",
                            String_33: "Confirm email address",
                            String_34: "Payment method",
                            String_35: "Card number",
                            String_36: "Card type",
                            String_37: "Expiration month",
                            String_38: "Expiration year",
                            String_39: "CCID",
                            String_40: "What is this?",
                            String_41: "Payment amount",
                            String_42: "Billing address",
                            String_43: "Same as shipping address",
                            String_44: "Address2",
                            String_45: "Review and confirm",
                            String_46: "Order information",
                            String_47: "Edit",
                            String_48: "Credit card",
                            String_49: "Checkout",
                            String_50: "You have not added any promotion code to your order",
                            String_51: "Tax:",
                            String_52: "Submit order",
                            String_53: "Thank you for your order",
                            String_54: "Your order confirmation number is ",
                            String_55: "Street",
                            String_56: "State",
                            String_57: "Zipcode",
                            String_58: "Email",
                            String_59: "Payment",
                            String_60: "CardNumber",
                            String_61: "Please select shipping method",
                            String_62: "The confirm email address must match the email address.",
                            String_63: "Sorry, something went wrong. The shopping cart information couldn't be retrieved. Please refresh the page and try again.",
                            String_64: "Sorry, something went wrong. The product was not removed from the cart successfully. Please refresh the page and try again.",
                            String_65: "Sorry, something went wrong. The product quantity couldn't be updated. Please refresh the page and try again.",
                            String_66: "Sorry, something went wrong. Delivery methods could not be retrieved. Please refresh the page and try again.",
                            String_67: "Sorry, something went wrong. The shipping information was not stored successfully. Please refresh the page and try again.",
                            String_68: "Sorry, something went wrong. The payment card type information was not retrieved successfully. Please refresh the page and try again.",
                            String_69: "Sorry, something went wrong. The order submission was not successful. Please refresh the page and try again.",
                            String_70: "Invalid parameter",
                            String_71: "validatorType attribute is not provided for validator binding.",
                            String_72: "Use text characters only. Numbers, spaces, and special characters are not allowed.",
                            String_73: "Use text characters only. Numbers, spaces, and special characters are not allowed.",
                            String_74: "The quantity field cannot be empty",
                            String_75: "Select delivery method.",
                            String_76: "The email address is invalid.",
                            String_77: "Please enter the name.",
                            String_78: "Please enter the street number.",
                            String_79: "Please enter the address.",
                            String_80: "Please enter the city.",
                            String_81: "Please enter the zip/postal code.",
                            String_82: "Please enter the state.",
                            String_83: "Please enter the country.",
                            String_84: "Please specify a payment card name.",
                            String_85: "Please enter a valid card number.",
                            String_86: "Please enter a valid CCID.",
                            String_87: "Please specify a valid amount.",
                            String_88: "{0} PRODUCT(S)",
                            String_89: "Included",
                            String_90: "Color: {0}",
                            String_91: "Size: {0}",
                            String_92: "Style: {0}",
                            String_93: "Sorry, something went wrong. The promotion code could not be added successfully. Please refresh the page and try again.",
                            String_94: "Sorry, something went wrong. The promotion code could not be removed successfully. Please refresh the page and try again.",
                            String_95: "Apply",
                            String_96: "Promotion Codes",
                            String_97: "Please enter a promotion code",
                            String_98: "Sorry, something went wrong. The channel configuration could not be retrieved successfully. Please refresh the page and try again.",
                            String_99: "Ship items",
                            String_100: "Pick up in store",
                            String_101: "Select delivery options by item",
                            String_102: "Find a store",
                            String_103: "miles",
                            String_104: "Available stores",
                            String_105: "Store",
                            String_106: "Distance",
                            String_107: "Products are not available for pick up in the stores around the location you searched. Please update your delivery preferences and try again.",
                            String_108: "Sorry, something went wrong. An error occurred while trying to get stores. Please refresh the page and try again.",
                            String_109: "Sorry, we were not able to decipher the address you gave us.  Please enter a valid Address",
                            String_110: "Sorry, something went wrong. An error has occured while looking up the address you provided. Please refresh the page and try again.",
                            String_111: "Products are not available in this store",
                            String_112: "Product availability:",
                            String_113: "Products are not available in the selected store, Please select a different store",
                            String_114: "Please select a store for pick up",
                            String_115: "Store address",
                            String_116: "Send to me",
                            String_117: "Optional note",
                            String_118: "Please enter email address for gift card delivery",
                            String_119: "Sorry, something went wrong. An error occurred while trying to get the email address. Please enter the email address in the text box below",
                            String_120: "Enter the shipping address and then click get shipping options to view the shipping options that are available for your area.",
                            String_121: "Delivery method",
                            String_122: "Select your delivery preference",
                            String_123: "Cancel",
                            String_124: "Done",
                            String_125: "for product: {0}",
                            String_126: "Please select delivery preference for product {0}",
                            String_127: "Add credit card",
                            String_128: "Gift card",
                            String_129: "Add gift card",
                            String_130: "Loyalty card",
                            String_131: "Add loyalty card",
                            String_132: "Payment information",
                            String_133: "Payment total:",
                            String_134: "Order total:",
                            String_135: "Gift card does not exist",
                            String_136: "Gift card balance",
                            String_137: "Card details",
                            String_138: "Sorry, something went wrong. An error occurred while trying to get payment methods supported by the store. Please refresh the page and try again.",
                            String_139: "Please select payment method",
                            String_140: "The expiration date is not valid. Please select valid expiration month and year and then try again",
                            String_141: "Please enter a valid gift card number",
                            String_142: "Get gift card balance",
                            String_143: "Apply full amount",
                            String_144: "Please enter a gift card number",
                            String_145: "Sorry, something went wrong. An error occurred while trying to get gift card balance. Please refresh the page and try again.",
                            String_146: "Gift card payment amount cannot be zero",
                            String_147: "Gift card payment amount is more than order total",
                            String_148: "Gift card does not have sufficient balance",
                            String_149: "Payment amount is different from the order total",
                            String_150: "Sorry, something went wrong. An error occurred while trying to get loyalty card information. Please refresh the page and try again.",
                            String_151: "Please enter a valid loyalty card number",
                            String_152: "Loyalty card payment amount cannot be zero",
                            String_153: "Loyalty card payment amount is more than order total",
                            String_154: "The loyalty card is blocked",
                            String_155: "The loyalty card is not allowed for payment",
                            String_156: "The loyalty payment amount exceeds what is allowed for this loyalty card in this transaction",
                            String_157: "The loyalty card number does not exist",
                            String_158: "Please select delivery preference",
                            String_159: "Please select a delivery preference...",
                            String_160: "Sorry, something went wrong. An error occurred while trying to get delivery methods information. Please refresh the page and try again.",
                            String_161: "Select address...",
                            String_162: "You have not added loyalty card number to your order",
                            String_163: "Enter a reward card for the current order. You can include only one reward card per order",
                            String_164: "Sorry, something went wrong. An error occurred while trying to update reward card id in cart. Please refresh the page and try again.",
                            String_165: "Sorry, something went wrong. An error occurred while retrieving the country region information. Please refresh the page and try again.",
                            String_166: "TBD",
                            String_167: "Mini Cart",
                            String_168: "Ordering FAQ",
                            String_169: "Return policy",
                            String_170: "Store locator tool",
                            String_171: "Continue shopping",
                            String_172: "Cart Order Total",
                            String_173: "View full cart contents",
                            String_174: "Quantity:",
                            String_175: "Added to your cart:",
                            String_176: "Loading ...",
                            String_177: "Sorry, something went wrong. The cart's promotion information couldn't be retrieved. Please refresh the page and try again.",
                            String_178: "Delivery method",
                            String_179: "Updating shopping cart ...",
                            String_180: "Submitting order ...",
                            String_181: "Discount code",
                            String_182: "Add coupon code",
                            String_183: "Enter a discount code",
                            String_184: "Please enter a valid discount code",
                            String_185: "Sorry, something went wrong. An error occurred while retrieving the state/province information. Please refresh the page and try again.",
                            String_186: "Edit reward card",
                            String_187: "Reward card",
                            String_188: "Add discount code",
                            String_189: "Select country/region",
                            String_190: "Select state/province",
                            String_191: "You have selected multiple delivery methods for this order",
                            String_192: "01-January",
                            String_193: "02-February",
                            String_194: "03-March",
                            String_195: "04-April",
                            String_196: "05-May",
                            String_197: "06-June",
                            String_198: "07-July",
                            String_199: "08-August",
                            String_200: "09-September",
                            String_201: "10-October",
                            String_202: "11-November",
                            String_203: "12-December"
                        };
                    })(Sdk.Controls || (Sdk.Controls = {}));
                    var Controls = Sdk.Controls;
                })(Ecommerce.Sdk || (Ecommerce.Sdk = {}));
                var Sdk = Ecommerce.Sdk;
            })(Retail.Ecommerce || (Retail.Ecommerce = {}));
            var Ecommerce = Retail.Ecommerce;
        })(Dynamics.Retail || (Dynamics.Retail = {}));
        var Retail = Dynamics.Retail;
    })(Microsoft.Dynamics || (Microsoft.Dynamics = {}));
    var Dynamics = Microsoft.Dynamics;
})(Microsoft || (Microsoft = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Microsoft;
(function (Microsoft) {
    (function (Dynamics) {
        (function (Retail) {
            (function (Ecommerce) {
                (function (Sdk) {
                    (function (Controls) {
                        var stringValidationErrorMessage = Controls.Resources.String_72;
                        var stringValidationRegex = Controls.Resources.String_73;

                        
                        ;

                        var FieldValidator = (function () {
                            function FieldValidator(params) {
                                this._validationAttributes = params;
                            }
                            FieldValidator.prototype.setValidationAttributes = function (element) {
                                for (var attrName in this._validationAttributes) {
                                    if (attrName != "title") {
                                        var value = this._validationAttributes[attrName];
                                        if (value) {
                                            element.setAttribute(attrName, value);
                                        }

                                        if (this._validationAttributes.required !== true) {
                                            element.removeAttribute("required");
                                        }
                                    }
                                }
                            };

                            FieldValidator.prototype.setTitleAttributeIfInvalid = function (element) {
                                var value = this._validationAttributes["title"];
                                if (value && element.getAttribute("msax-isValid") == "false") {
                                    element.setAttribute("title", value);
                                } else {
                                    element.removeAttribute("title");
                                }
                            };
                            return FieldValidator;
                        })();
                        Controls.FieldValidator = FieldValidator;

                        var EntityValidatorBase = (function () {
                            function EntityValidatorBase() {
                            }
                            EntityValidatorBase.prototype.setValidationAttributes = function (element, fieldName) {
                                var fieldValidator = this[fieldName];
                                if (fieldValidator) {
                                    fieldValidator.setValidationAttributes(element);
                                }
                            };
                            return EntityValidatorBase;
                        })();
                        Controls.EntityValidatorBase = EntityValidatorBase;

                        var ShoppingCartItemValidator = (function (_super) {
                            __extends(ShoppingCartItemValidator, _super);
                            function ShoppingCartItemValidator() {
                                _super.call(this);

                                this.Quantity = new FieldValidator({ maxLength: 3, required: true, title: Controls.Resources.String_74 });
                            }
                            return ShoppingCartItemValidator;
                        })(EntityValidatorBase);
                        Controls.ShoppingCartItemValidator = ShoppingCartItemValidator;

                        var SelectedOrderDeliveryOptionValidator = (function (_super) {
                            __extends(SelectedOrderDeliveryOptionValidator, _super);
                            function SelectedOrderDeliveryOptionValidator() {
                                _super.call(this);

                                this.DeliveryModeId = new FieldValidator({
                                    required: true, title: Controls.Resources.String_75
                                });
                            }
                            return SelectedOrderDeliveryOptionValidator;
                        })(EntityValidatorBase);
                        Controls.SelectedOrderDeliveryOptionValidator = SelectedOrderDeliveryOptionValidator;

                        var CustomerValidator = (function (_super) {
                            __extends(CustomerValidator, _super);
                            function CustomerValidator() {
                                _super.call(this);

                                this.FirstName = new FieldValidator({ maxLength: 25, required: true, title: stringValidationErrorMessage, pattern: stringValidationRegex });
                                this.MiddleName = new FieldValidator({ maxLength: 25, title: stringValidationErrorMessage, pattern: stringValidationRegex });
                                this.LastName = new FieldValidator({ maxLength: 25, required: true, title: stringValidationErrorMessage, pattern: stringValidationRegex });
                                this.Name = new FieldValidator({ maxLength: 100, required: true });
                            }
                            return CustomerValidator;
                        })(EntityValidatorBase);
                        Controls.CustomerValidator = CustomerValidator;

                        var AddressValidator = (function (_super) {
                            __extends(AddressValidator, _super);
                            function AddressValidator() {
                                _super.call(this);

                                this.Phone = new FieldValidator({ maxLength: 20 });
                                this.Url = new FieldValidator({ maxLength: 255 });
                                this.Email = new FieldValidator({ maxLength: 80, required: true, title: Controls.Resources.String_76, pattern: "^[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+.[a-zA-Z]{2,4}$" });
                                this.Name = new FieldValidator({ maxLength: 60, required: true, title: Controls.Resources.String_77 });
                                this.StreetNumber = new FieldValidator({ maxLength: 20, title: Controls.Resources.String_78 });
                                this.Street = new FieldValidator({ maxLength: 250, required: true, title: Controls.Resources.String_79 });
                                this.City = new FieldValidator({ maxLength: 60, required: true, title: Controls.Resources.String_80 });
                                this.ZipCode = new FieldValidator({ maxLength: 10, required: true, title: Controls.Resources.String_81 });
                                this.State = new FieldValidator({ maxLength: 10, required: true, title: Controls.Resources.String_82 });
                                this.Country = new FieldValidator({ required: true, title: Controls.Resources.String_83 });
                            }
                            return AddressValidator;
                        })(EntityValidatorBase);
                        Controls.AddressValidator = AddressValidator;

                        var PaymentCardTypeValidator = (function (_super) {
                            __extends(PaymentCardTypeValidator, _super);
                            function PaymentCardTypeValidator() {
                                _super.call(this);

                                this.NameOnCard = new FieldValidator({ maxLength: 100, required: true, title: Controls.Resources.String_84 });
                                this.CardNumber = new FieldValidator({ maxLength: 30, required: true, title: Controls.Resources.String_85 });
                                this.CCID = new FieldValidator({ maxLength: 50, required: true, title: Controls.Resources.String_86, pattern: "^[0-9]{3,4}$" });
                                this.PaymentAmount = new FieldValidator({ maxLength: 100, required: true, title: Controls.Resources.String_87, pattern: "\w+([0123456789.]\w+)*" });
                            }
                            return PaymentCardTypeValidator;
                        })(EntityValidatorBase);
                        Controls.PaymentCardTypeValidator = PaymentCardTypeValidator;

                        var GiftCardTypeValidator = (function (_super) {
                            __extends(GiftCardTypeValidator, _super);
                            function GiftCardTypeValidator() {
                                _super.call(this);

                                this.CardNumber = new FieldValidator({ maxLength: 30, required: true, title: Controls.Resources.String_141 });
                                this.PaymentAmount = new FieldValidator({ maxLength: 100, required: true, title: Controls.Resources.String_87 });
                            }
                            return GiftCardTypeValidator;
                        })(EntityValidatorBase);
                        Controls.GiftCardTypeValidator = GiftCardTypeValidator;

                        var LoyaltyCardTypeValidator = (function (_super) {
                            __extends(LoyaltyCardTypeValidator, _super);
                            function LoyaltyCardTypeValidator() {
                                _super.call(this);

                                this.CardNumber = new FieldValidator({ maxLength: 30, required: true, title: Controls.Resources.String_151 });
                                this.PaymentAmount = new FieldValidator({ maxLength: 100, required: true, title: Controls.Resources.String_87 });
                            }
                            return LoyaltyCardTypeValidator;
                        })(EntityValidatorBase);
                        Controls.LoyaltyCardTypeValidator = LoyaltyCardTypeValidator;

                        var DiscountCardTypeValidator = (function (_super) {
                            __extends(DiscountCardTypeValidator, _super);
                            function DiscountCardTypeValidator() {
                                _super.call(this);

                                this.CardNumber = new FieldValidator({ maxLength: 100, required: true, title: Controls.Resources.String_184 });
                            }
                            return DiscountCardTypeValidator;
                        })(EntityValidatorBase);
                        Controls.DiscountCardTypeValidator = DiscountCardTypeValidator;
                    })(Sdk.Controls || (Sdk.Controls = {}));
                    var Controls = Sdk.Controls;
                })(Ecommerce.Sdk || (Ecommerce.Sdk = {}));
                var Sdk = Ecommerce.Sdk;
            })(Retail.Ecommerce || (Retail.Ecommerce = {}));
            var Ecommerce = Retail.Ecommerce;
        })(Dynamics.Retail || (Dynamics.Retail = {}));
        var Retail = Dynamics.Retail;
    })(Microsoft.Dynamics || (Microsoft.Dynamics = {}));
    var Dynamics = Microsoft.Dynamics;
})(Microsoft || (Microsoft = {}));
"use strict";
var Microsoft;
(function (Microsoft) {
    (function (Dynamics) {
        (function (Retail) {
            (function (Ecommerce) {
                (function (Sdk) {
                    (function (Controls) {
                        var ShoppingCartService = (function () {
                            function ShoppingCartService() {
                            }
                            ShoppingCartService.GetProxy = function () {
                                this.proxy = new Controls.AjaxProxy(msaxValues.msax_ShoppingCartServiceUrl + '/');
                            };

                            ShoppingCartService.UpdateShoppingCart = function (shoppingCartResponse, isCheckoutSession) {
                                if (!Microsoft.Utils.isNullOrUndefined(shoppingCartResponse.ShoppingCart) && Microsoft.Utils.hasElements(shoppingCartResponse.ShoppingCart.Items)) {
                                    for (var index in shoppingCartResponse.ShoppingCart.Items) {
                                        var item = shoppingCartResponse.ShoppingCart.Items[index];
                                        if (!Microsoft.Utils.isNullOrWhiteSpace(item.ProductDetails)) {
                                            item["ProductDetailsExpanded"] = JSON.parse(item.ProductDetails);
                                        } else {
                                            item["ProductDetailsExpanded"] = { Name: "", ProductUrl: "", DimensionValues: "", ProductNumber: "" };
                                        }

                                        item.ImageMarkup = ShoppingCartService.BuildImageMarkup50x50(item.Image);

                                        item.OfferNames = item.OfferNames.replace(",", "\n");

                                        if (item.ItemType == Controls.TransactionItemType.Kit) {
                                            item.NoOfComponents = Microsoft.Utils.format(Controls.Resources.String_88, item.KitComponents.length);

                                            for (var j = 0; j < item.KitComponents.length; j++) {
                                                item.KitComponents[j].ProductDetailsExpanded = [];

                                                item.KitComponents[j].ProductDetailsExpanded.Name = item.KitComponents[j].Name;
                                                item.KitComponents[j].ProductDetailsExpanded.ProductUrl = item.KitComponents[j].ProductUrl;
                                                item.KitComponents[j].ProductDetailsExpanded.ProductNumber = item.KitComponents[j].ProductNumber;
                                                item.KitComponents[j].ProductDetailsExpanded.DimensionValues = ShoppingCartService.GetDimensionValues(item.KitComponents[j].Color, item.KitComponents[j].Size, item.KitComponents[j].Style);

                                                item.KitComponents[j].ImageMarkup = ShoppingCartService.BuildImageMarkup50x50(item.KitComponents[j].Image);
                                            }
                                        }
                                    }
                                }

                                if (isCheckoutSession) {
                                    $(document).trigger('UpdateCheckoutCart', [shoppingCartResponse]);
                                } else {
                                    $(document).trigger('UpdateShoppingCart', [shoppingCartResponse]);
                                }
                            };

                            ShoppingCartService.GetDimensionValues = function (color, size, style) {
                                var hasColor = !Microsoft.Utils.isNullOrWhiteSpace(color);
                                var hasSize = !Microsoft.Utils.isNullOrWhiteSpace(size);
                                var hasStyle = !Microsoft.Utils.isNullOrWhiteSpace(style);

                                var dimensionValues = null;
                                if (hasColor || hasSize || hasStyle) {
                                    dimensionValues = '' + (!hasColor ? '' : color) + (hasColor && (hasSize || hasStyle) ? ', ' : '') + (!hasSize ? '' : size) + (hasStyle && (hasColor || hasSize) ? ', ' : '') + (!hasStyle ? '' : style) + '';
                                }

                                return dimensionValues;
                            };

                            ShoppingCartService.OnUpdateShoppingCart = function (callerContext, handler) {
                                $(document).on('UpdateShoppingCart', $.proxy(handler, callerContext));
                            };

                            ShoppingCartService.OnUpdateCheckoutCart = function (callerContext, handler) {
                                $(document).on('UpdateCheckoutCart', $.proxy(handler, callerContext));
                            };

                            ShoppingCartService.GetShoppingCart = function (isCheckoutSession, shoppingCartDataLevel) {
                                var asyncResult = new Controls.AsyncResult();

                                var data = {
                                    "isCheckoutSession": isCheckoutSession,
                                    "dataLevel": shoppingCartDataLevel
                                };

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("GetShoppingCart", data, function (data) {
                                    ShoppingCartService.UpdateShoppingCart(data, isCheckoutSession);
                                    asyncResult.resolve(data);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };

                            ShoppingCartService.RemoveFromCart = function (isCheckoutSession, lineId, shoppingCartDataLevel) {
                                var asyncResult = new Controls.AsyncResult();

                                var data = {
                                    "isCheckoutSession": isCheckoutSession,
                                    "lineIds": [lineId],
                                    "dataLevel": shoppingCartDataLevel
                                };

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("RemoveItems", data, function (data) {
                                    ShoppingCartService.UpdateShoppingCart(data, isCheckoutSession);
                                    asyncResult.resolve(data);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };

                            ShoppingCartService.UpdateQuantity = function (isCheckoutSession, items, shoppingCartDataLevel) {
                                var asyncResult = new Controls.AsyncResult();

                                var data = {
                                    "isCheckoutSession": isCheckoutSession,
                                    "items": items,
                                    "dataLevel": shoppingCartDataLevel
                                };

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("UpdateItems", data, function (data) {
                                    ShoppingCartService.UpdateShoppingCart(data, isCheckoutSession);
                                    asyncResult.resolve(data);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };

                            ShoppingCartService.GetPromotions = function (isCheckoutSession, shoppingCartDataLevel) {
                                var asyncResult = new Controls.AsyncResult();

                                var data = {
                                    "isCheckoutSession": isCheckoutSession,
                                    "dataLevel": shoppingCartDataLevel
                                };

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("GetPromotions", data, function (data) {
                                    ShoppingCartService.UpdateShoppingCart(data, isCheckoutSession);
                                    asyncResult.resolve(data);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };

                            ShoppingCartService.AddOrRemovePromotion = function (isCheckoutSession, promoCode, isAdd, shoppingCartDataLevel) {
                                var asyncResult = new Controls.AsyncResult();

                                var data = {
                                    "isCheckoutSession": isCheckoutSession,
                                    "promotionCode": promoCode,
                                    "isAdd": isAdd,
                                    "dataLevel": shoppingCartDataLevel
                                };

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("AddOrRemovePromotionCode", data, function (data) {
                                    ShoppingCartService.UpdateShoppingCart(data, isCheckoutSession);
                                    asyncResult.resolve(data);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };

                            ShoppingCartService.CommenceCheckout = function (dataLevel) {
                                var asyncResult = new Controls.AsyncResult();

                                var data = {
                                    "dataLevel": dataLevel
                                };

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("CommenceCheckout", data, function (data) {
                                    ShoppingCartService.UpdateShoppingCart(data, true);
                                    asyncResult.resolve(data);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };

                            ShoppingCartService.GetNoImageMarkup = function () {
                                return Microsoft.Utils.format('<span class=\"msax-NoImageContainer\"></span>');
                            };

                            ShoppingCartService.BuildImageMarkup = function (imageData, width, height) {
                                if (!Microsoft.Utils.isNullOrUndefined(imageData)) {
                                    var imageUrl = imageData.Url;
                                    var altText = imageData.AltText;
                                    var imageClassName = "msax-Image";

                                    if (!Microsoft.Utils.isNullOrWhiteSpace(imageUrl)) {
                                        var errorScript = Microsoft.Utils.format('onerror=\"this.parentNode.innerHTML=Microsoft.Dynamics.Retail.Ecommerce.Sdk.Controls.ShoppingCartService.GetNoImageMarkup();\"');
                                        return Microsoft.Utils.format('<img src=\"{0}\" class=\"{1}\" alt=\"{2}\" width=\"{3}\" height=\"{4}\" {5} />', imageUrl, imageClassName, altText, width, height, errorScript);
                                    } else {
                                        return ShoppingCartService.GetNoImageMarkup();
                                    }
                                } else {
                                    return ShoppingCartService.GetNoImageMarkup();
                                }
                            };

                            ShoppingCartService.BuildImageMarkup50x50 = function (imageData) {
                                return ShoppingCartService.BuildImageMarkup(imageData, 50, 50);
                            };
                            return ShoppingCartService;
                        })();
                        Controls.ShoppingCartService = ShoppingCartService;
                    })(Sdk.Controls || (Sdk.Controls = {}));
                    var Controls = Sdk.Controls;
                })(Ecommerce.Sdk || (Ecommerce.Sdk = {}));
                var Sdk = Ecommerce.Sdk;
            })(Retail.Ecommerce || (Retail.Ecommerce = {}));
            var Ecommerce = Retail.Ecommerce;
        })(Dynamics.Retail || (Dynamics.Retail = {}));
        var Retail = Dynamics.Retail;
    })(Microsoft.Dynamics || (Microsoft.Dynamics = {}));
    var Dynamics = Microsoft.Dynamics;
})(Microsoft || (Microsoft = {}));
"use strict";
var Microsoft;
(function (Microsoft) {
    (function (Dynamics) {
        (function (Retail) {
            (function (Ecommerce) {
                (function (Sdk) {
                    (function (Controls) {
                        var CheckoutService = (function () {
                            function CheckoutService() {
                            }
                            CheckoutService.GetProxy = function () {
                                this.proxy = new Controls.AjaxProxy(msaxValues.msax_CheckoutServiceUrl + '/');
                            };

                            CheckoutService.SubmitOrder = function (tenderLineData, email) {
                                var asyncResult = new Controls.AsyncResult();

                                var data = {
                                    "tenderDataLine": tenderLineData,
                                    "emailAddress": email
                                };

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("CreateOrder", data, function (data) {
                                    asyncResult.resolve(data);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };

                            CheckoutService.GetDeliveryPreferences = function () {
                                var asyncResult = new Controls.AsyncResult();

                                var data = {};

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("GetDeliveryPreferences", data, function (response) {
                                    asyncResult.resolve(response);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };

                            CheckoutService.GetDeliveryOptionsInfo = function () {
                                var asyncResult = new Controls.AsyncResult();

                                var data = {};

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("GetDeliveryOptionsInfo", data, function (response) {
                                    asyncResult.resolve(response);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };

                            CheckoutService.GetOrderDeliveryOptionsForShipping = function (shipToAddress) {
                                var asyncResult = new Controls.AsyncResult();

                                var data = {
                                    "shipToAddress": shipToAddress
                                };

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("GetOrderDeliveryOptionsForShipping", data, function (response) {
                                    asyncResult.resolve(response);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };

                            CheckoutService.GetLineDeliveryOptionsForShipping = function (selectedLineShippingInfo) {
                                var asyncResult = new Controls.AsyncResult();

                                var data = {
                                    "selectedLineShippingInfo": selectedLineShippingInfo
                                };

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("GetLineDeliveryOptionsForShipping", data, function (response) {
                                    asyncResult.resolve(response);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };

                            CheckoutService.SetOrderDeliveryOption = function (selectedDeliveryOption, dataLevel) {
                                var asyncResult = new Controls.AsyncResult();

                                var data = {
                                    "selectedDeliveryOption": selectedDeliveryOption,
                                    "dataLevel": dataLevel
                                };

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("SetOrderDeliveryOption", data, function (response) {
                                    Controls.ShoppingCartService.UpdateShoppingCart(response, true);
                                    asyncResult.resolve(response);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };

                            CheckoutService.SetLineDeliveryOptions = function (lineDeliveryOptions, dataLevel) {
                                var asyncResult = new Controls.AsyncResult();

                                var data = {
                                    "selectedLineDeliveryOptions": lineDeliveryOptions,
                                    "dataLevel": dataLevel
                                };

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("SetLineDeliveryOptions", data, function (response) {
                                    Controls.ShoppingCartService.UpdateShoppingCart(response, true);
                                    asyncResult.resolve(response);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };

                            CheckoutService.GetPaymentCardTypes = function () {
                                var asyncResult = new Controls.AsyncResult();

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("GetPaymentCardTypes", null, function (data) {
                                    asyncResult.resolve(data);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };

                            CheckoutService.IsAuthenticatedSession = function () {
                                var asyncResult = new Controls.AsyncResult();

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("IsAuthenticatedSession", null, function (data) {
                                    asyncResult.resolve(data);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };

                            CheckoutService.GetUserEmail = function () {
                                var asyncResult = new Controls.AsyncResult();

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                this.proxy.SubmitRequest("GetUserEmail", null, function (data) {
                                    asyncResult.resolve(data);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };

                            CheckoutService.GetGiftCardBalance = function (giftCardNumber) {
                                var asyncResult = new Controls.AsyncResult();

                                if (Microsoft.Utils.isNullOrUndefined(this.proxy)) {
                                    this.GetProxy();
                                }

                                var data = {
                                    "giftCardId": giftCardNumber
                                };

                                this.proxy.SubmitRequest("GetGiftCardInformation", data, function (data) {
                                    asyncResult.resolve(data);
                                }, function (errors) {
                                    asyncResult.reject(errors);
                                });

                                return asyncResult;
                            };
                            return CheckoutService;
                        })();
                        Controls.CheckoutService = CheckoutService;
                    })(Sdk.Controls || (Sdk.Controls = {}));
                    var Controls = Sdk.Controls;
                })(Ecommerce.Sdk || (Ecommerce.Sdk = {}));
                var Sdk = Ecommerce.Sdk;
            })(Retail.Ecommerce || (Retail.Ecommerce = {}));
            var Ecommerce = Retail.Ecommerce;
        })(Dynamics.Retail || (Dynamics.Retail = {}));
        var Retail = Dynamics.Retail;
    })(Microsoft.Dynamics || (Microsoft.Dynamics = {}));
    var Dynamics = Microsoft.Dynamics;
})(Microsoft || (Microsoft = {}));

ko.bindingHandlers.validator = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var binding = ko.utils.unwrapObservable(valueAccessor()) || {};

        if (!Microsoft.Utils.isNullOrWhiteSpace(binding.field)) {
            var valueObject = binding.data ? binding.data[binding.field] : bindingContext.$data[binding.field];

            var observableValueObject;
            if (ko.isObservable(valueObject)) {
                observableValueObject = valueObject;
            } else {
                observableValueObject = ko.observable(valueObject);

                observableValueObject.subscribe(function (newValue) {
                    if (Microsoft.Utils.isNullOrUndefined(binding.data)) {
                        bindingContext.$data[binding.field] = newValue;
                    } else {
                        binding.data[binding.field] = newValue;
                    }
                });
            }

            ko.applyBindingsToNode(element, { value: observableValueObject });
        }

        if (Microsoft.Utils.isNullOrUndefined(binding.validatorType)) {
            throw Microsoft.Dynamics.Retail.Ecommerce.Sdk.Controls.Resources.String_71;
        }

        var validator = Object.create(Microsoft.Dynamics.Retail.Ecommerce.Sdk.Controls[binding.validatorType].prototype);
        validator.constructor.apply(validator);

        var field = binding.validatorField ? binding.validatorField : binding.field;
        validator.setValidationAttributes(element, field);

        var $element = $(element);
        $element.attr("msax-isValid", true);

        $element.change(function (eventObject) {
            var isValid = eventObject.currentTarget.checkValidity();

            if (eventObject.currentTarget.type === "select-one" && eventObject.currentTarget.selectedIndex != 0) {
                isValid = true;
            }

            if (isValid && binding.validate) {
                isValid = binding.validate.call(viewModel, eventObject.currentTarget);
            }

            $element.attr("msax-isValid", isValid);

            if (eventObject.currentTarget.type === "radio") {
                var $label = $element.parent().find("[for=" + eventObject.currentTarget.id + "]");
                $label.attr("msax-isValid", isValid);
            }

            if (!Microsoft.Utils.isNullOrWhiteSpace(validator[field])) {
                validator[field].setTitleAttributeIfInvalid(element);
            }

            return isValid;
        });
    }
};

ko.bindingHandlers.submitIfValid = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var binding = ko.utils.unwrapObservable(valueAccessor()) || {};
        var $element = $(element);

        $element.click(function (eventObject) {
            eventObject.preventDefault();

            var container;

            if (Microsoft.Utils.isNullOrWhiteSpace(binding.containerSelector) || binding.containerSelector.length == 0) {
                var containerObservable = binding.containerSelector;
                container = containerObservable();
            } else {
                container = binding.containerSelector;
            }

            var $wrapper = $element.closest(container);

            if ($wrapper.length === 0) {
                $wrapper = $(container);
            }

            $wrapper.find("input,select").each(function (index, elem) {
                $(elem).change();
            });

            var $invalidFields = $wrapper.find("[msax-isValid=false]");

            $invalidFields.first().focus();
            $invalidFields.first().select();

            if ($invalidFields.length === 0) {
                var isValid = true;
                if (binding.validate) {
                    isValid = binding.validate.call(viewModel, $wrapper);
                }

                if (isValid) {
                    binding.submit.call(viewModel, eventObject);
                }
            }
        });
    }
};

ko.bindingHandlers.resx = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var binding = ko.utils.unwrapObservable(valueAccessor()) || {};

        for (var memberName in binding) {
            switch (memberName) {
                case "textContent":
                    element.textContent = Microsoft.Dynamics.Retail.Ecommerce.Sdk.Controls.Resources[binding[memberName]];
                    break;

                case "label":
                    element.label = Microsoft.Dynamics.Retail.Ecommerce.Sdk.Controls.Resources[binding[memberName]];
                    break;
            }
        }
    }
};
//# sourceMappingURL=Scripts.js.map
