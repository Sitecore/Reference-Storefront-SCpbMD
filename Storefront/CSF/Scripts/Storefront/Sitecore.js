/// <reference path="_references.js" />
/// <reference path="~/Scripts/knockout-2.2.1.js" />
/// <reference path="~/Scripts/jquery-ui-1.10.4.js" />
/// <reference path="~/Scripts/jquery-2.0.3.js" />
var breakpoint = 990;
var isDesktop = true;
var docHeight = 0;
var docWidth = 0;
var queryStringParamerterSort = "s";
var queryStringParamerterSortDirection = "sd";
var queryStringParamerterSortDirectionAsc = "asc";
var queryStringParamerterSortDirectionAscShort = "+";
var queryStringParamerterSortDirectionDesc = "desc";
var queryStringParamerterPage = "pg";
var map;
var searchLocation;

$(document).ready(function () {
    setClientType();

    $('.disabled').bind('click', function (e) {
        e.preventDefault();
    });

    $(".sortDropdown").change(function () {
        var val = $(this).find("option:selected").attr("value");

        if (val != null && val != "") {
            var fieldName = val.substr(0, val.length - 1);
            var direction = val.charAt(val.length - 1) == queryStringParamerterSortDirectionAscShort ? queryStringParamerterSortDirectionAsc : queryStringParamerterSortDirectionDesc;

            var url = new Uri(window.location.href)
                .deleteQueryParam(queryStringParamerterSort)
                .deleteQueryParam(queryStringParamerterSortDirection)
                .addQueryParam(queryStringParamerterSort, fieldName)
                .addQueryParam(queryStringParamerterSortDirection, direction)
                .deleteQueryParam(queryStringParamerterPage)
                .toString();

            window.location.href = url;
        }
        else {
            var url = new Uri(window.location.href)
                .deleteQueryParam(queryStringParamerterSort)
                .deleteQueryParam(queryStringParamerterSortDirection)
                .deleteQueryParam(queryStringParamerterPage)
                .toString();

            window.location.href = url;
        }
    });

    // when in edit mod in Sitecore mush the nav down a bit so it is visible
    if ($("#scPageExtendersForm").length > 0) {
        $(".navbar-fixed-top").css("margin-top", "27px");
    }

    // handle language selector changes
    $("#languageSelector").change(
        function () {
            var selectedLanguage = $('#languageSelector :selected').val();
            var selectedIndex = $('#languageSelector')[0].selectedIndex;

            if (selectedIndex > 0) {
                window.location.href = StorefrontUri("?sc_lang=" + selectedLanguage);
            }
        }
    );
});

var dontBlockUI = false;