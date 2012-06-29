// jquery-mobile configuration
$(document).bind("mobileinit", function() {
    if (SugarSessionId === '') {
        $.mobile.changePage('#LoginPage');
    }
  $.mobile.page.prototype.options.addBackBtn = true; // add back button by default
 });
