/**
 * Created by Karthik on 3/05/14.
 */
var isLogged = false;
//LOGGING IN AND GOING TO HOME PAGE ON SUCCESS
$(document).on("pageinit", "#loginForm", function () {
    $("#form1").on("submit", function (event) {
        event.preventDefault();
        $.ajax({
            type: "GET",
            url: "http://softwarehuttest.x10.mx/public/account/login/",
            data: $("#form1").serialize(),
            success: function (data) {
                console.log(data);
                if (data.loggedIn) {
                    isLogged = true;
                    $.mobile.changePage("#home");
                } else {
                    alert("You entered the wrong username or password. Please try again.");
                }
            }
        });
    });
});

$(document).on("pageinit", "#expense", function(){
    var listDescription;
    var payment;
    //expense page ACCESS SET METHOD
    $('#add_list').click( function() {

        listDescription = $('#list_description').val();
        payment = $('#payment').val();
        if(!isNaN(listDescription))
            $('.expense_list').prepend('<div>' + "\u00A3 "  + listDescription + "\t\t\t" + payment + "\t" + '</div>');
            //end of append

        //sending the expense list information to the server each time it is added.
        $.ajax({
            url: "http://softwarehuttest.x10.mx/public/user/spent",
            data: {
                amount: listDescription,
                account: payment
            },
            type: "GET",
            dataType:'json',
            async:true,
            cache:false,
            success: function (data) {
                alert(data.status);
            },
            error: function (xhr, status, error) {
                alert(error);
            }
        });

        $('#list_form')[0].reset();
        return false;
    });
});

$(document).on("pageinit", "#earnings", function(){
    var listDescription1;
    var payment1;
    //earnings page ACCESS SET METHOD
    $('#add_list1').click( function() {

        //appending information to the list in earnings page
        listDescription1 = $('#list_description1').val();
        payment1 = $('#payment1').val();
        if(!isNaN(listDescription1))
            $('.expense_list1').prepend('<div>' + "\u00A3 "  + listDescription1 + "\t\t\t" + payment1 + '</div>');
            //end of append

        $.getJSON("http://softwarehuttest.x10.mx/public/user/income", {
            amount: listDescription1,
            account: payment1
        }, function(data) {
            alert(data.status);
        }).fail(function() {
                alert("error");
            })

        $('#list_form1')[0].reset();
        return false;
    });//END OF SET METHOD ACCESS
});

$(document).on("pageinit", "#transaction" ,function(){
    //Transaction
    $.getJSON("http://softwarehuttest.x10.mx/public/user/transactionlog/", function (data) {
        //Loop for each element on the data
        $.each(data, function (elem) {
            var wrap = $("<div/>").attr('data-role', 'collapsible');
            //Create the h1 and the other elements appending them to benefits List
            $("<h1/>", {
                text: data[elem].reference
            }).appendTo(wrap);

            $("<p/>", {
                text: "Date: " + data[elem].date
            }).appendTo(wrap);

            $("<p/>", {
                text: "Days: " + data[elem].account
            }).appendTo(wrap);

            $("<p/>", {
                text: "Amount: \u00A3" + data[elem].amount
            }).appendTo(wrap);
            wrap.appendTo('#transactionList');
        });//end of for loop
        $( "#transactionList" ).collapsibleset();
    });//end of transaction page update
});

$(document).on("pageinit", "#budget",function(){
    //Budget
    $.getJSON("http://softwarehuttest.x10.mx/public/user/balance/",function(data){
        var wrap = $("<div/>").attr('data-role', 'collapsible');
        //Create the h1 and the other elements appending them to bills List
        $("<h1/>",{
            text:"Budget Details"
        }).appendTo(wrap);
        $("<p/>",{
            text:"Bank Balance: \u00A3"+ data.bank
        }).appendTo(wrap);
        $("<p/>",{
            text:"Cash Balance: \u00A3"+ data.cash
        }).appendTo(wrap);
        $("<p/>",{
            text:"Daily Budget: \u00A3"+ data.daily_aim
        }).appendTo(wrap);
        $("<p/>",{
            text:"Daily Expense: \u00A3"+ data.spent_today
        }).appendTo(wrap);
        wrap.appendTo('#budgetList');
        $( "#budgetList" ).collapsibleset();
    })//end of budget page update
});

var identity = [];
var count = 0;
$(document).on("pageinit", "#unpaidBills",function(){
    //UNPAID BILLS
    $.getJSON("http://softwarehuttest.x10.mx/public/user/listunpaidbills/",function(data){
        //Loop for each element on the data
        $.each(data,function(elem){
            var wrap = $("<div/>").attr('data-role', 'collapsible');
            identity.push(data[elem].id);
            //Create the h1 and the other elements appending them to bills List
            $("<h1/>",{
                text:data[elem].reference
            }).appendTo(wrap);
            $("<p/>",{
                text:"Account: "+ data[elem].account
            }).appendTo(wrap);
            $("<p/>",{
                text:"Amount: "+ data[elem].amount
            }).appendTo(wrap);
            $("<p/>",{
                text:"ID: "+ data[elem].id
            }).appendTo(wrap);

            /*$("<input type='submit' value='Paid' class='myinput'/>",{
             data:{'identityindex':count}, //information not being assigned
             text:"Paid"
             }).appendTo(wrap);*/

            $("<input type='submit' value='Paid' class='myinput'>",{
                text:"Paid"
            }).data('identityindex',count).appendTo(wrap);


            wrap.appendTo('#unpaidList');
            count++;
        })//end of for each loop
        $( "#unpaidList" ).collapsibleset();

        //Confirm Payment
        $(".myinput").click(function(){
            var $this = $(this);
            var index = $this.data('identityindex'); //undefined.
            $.getJSON("http://softwarehuttest.x10.mx/public/user/confirmbill/", {
                id: identity[index]
            }, function(data) {
                alert(data.status);
            }).fail(function() {
                    alert("error");
                });
            //location.reload(true); //try for immediate removal of info upon button click
        });
    });//end of unpaid bills page update
});

$(document).on("pageinit", "#benefits",function(){
    //UPDATING BENEFITS PAGE WITH INFO FROM DATABASE
    $.getJSON("http://softwarehuttest.x10.mx/public/user/listincome/", function (data) {
        //Loop for each element on the data
        $.each(data, function (elem) {
            var wrap = $("<div/>").attr('data-role', 'collapsible');
            //Create the h1 and the other elements appending them to benefits List
            $("<h1/>", {
                text: data[elem].reference
            }).appendTo(wrap);

            $("<p/>", {
                text: "Date: " + data[elem].due.date
            }).appendTo(wrap);

            $("<p/>", {
                text: "Days: " + data[elem].due.days
            }).appendTo(wrap);

            $("<p/>", {
                text: "Amount: " + data[elem].amount
            }).appendTo(wrap);
            wrap.appendTo('#benefitsList');
        });//end of for loop
        $( "#benefitsList" ).collapsibleset();
    });//end of benefits page update
});

$(document).on("pageinit", "#bills",function(){
    //UPDATING THE BILLS PAGE WITH INFO FROM DATABASE // ACCESSING GET METHOD
    $.getJSON("http://softwarehuttest.x10.mx/public/user/listbills/",function(data){
        //Loop for each element on the data
        $.each(data,function(elem){
            var wrap = $("<div/>").attr('data-role', 'collapsible');
            //Create the h1 and the other elements appending them to bills List
            $("<h1/>",{
                text:data[elem].reference
            }).appendTo(wrap);

            $("<p/>",{
                text:"Date: "+ data[elem].due.date
            }).appendTo(wrap);

            $("<p/>",{
                text:"Days: "+ data[elem].due.days
            }).appendTo(wrap);

            $("<p/>",{
                text:"Amount: "+ data[elem].amount
            }).appendTo(wrap);
            wrap.appendTo('#billsList');
        })//end of for each loop
        $( "#billsList" ).collapsibleset( "refresh" );
    })//end of bills page update
});

// triggers when leaving any page
/*$(document).on("pagebeforechange", function (e, data) {

    var to_page = data.toPage[0].id;
    // skip showing #loginForm page if condition is true
    if (to_page == "#loginForm" && isLogged) {

        // true! go to #home instead
        $.mobile.changePage("#home", {
            transition: "flip"
        });
        e.preventDefault();
    }
});*/

// triggers when leaving any page
$(document).on('pagebeforechange', function(e, data){
    var to = data.toPage;

    if (typeof to  === 'string') {
        var u = $.mobile.path.parseUrl(to);
        to = u.hash || '#' + u.pathname.substring(1);

        if (to === '#loginForm') {
            $.mobile.changePage("#home", {
                transition: "flip"
            });
            alert('Can not transition the page!');
            e.preventDefault();
            e.stopPropagation();

            // remove active status on a button, if transition was triggered with a button
            $.mobile.activePage.find('.ui-btn-active').removeClass('ui-btn-active ui-shadow').css({'box-shadow':'0 0 0 #3388CC'});
        }
    }
});

//back button for all pages less home
$.mobile.page.prototype.options.addBackBtn = "true";
$.mobile.page.prototype.options.backBtnText = "Go Back";