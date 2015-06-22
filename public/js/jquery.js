$(document).ready(function() {
    
    $('input').keypress(function(event) {
		
		if (event.keyCode == 13) {
			event.preventDefault();
			var $inputs = $(this).closest("div").find("input");
			var usr = $inputs.first().val();
			if (usr === "") {
				alert("Please enter a username.");
				return;
			}
			var pwd = $inputs.last().val();
			if (pwd === "") {
				alert("Please enter a password");
				return;
			}
			var hash = Sha256.hash(pwd);
			authenticate(usr, hash);
		}

	});
	
	$('#login').click(function() {
		
		var $inputs = $(this).closest("div").find("input");
		var usr = $inputs.first().val();
		var pwd = $inputs.last().val();
		var hash = Sha256.hash(pwd);
		authenticate(usr, hash);
	
	});
	
	$('#logout').click(function() {
		
		$.ajax({
			type: 'GET',
			url: '/logout',
			success: function() {
				if (window.location.pathname === "/dashboard") {
                    window.location = "/";
                } else {
                    location.reload(true);
                }
			}
		});

	});
	
    $("#add_link").click(function() {
      
      var linkLabel = $(this).closest("div").find("input").first().val().trim();
      var linkURL = $(this).closest("div").find("input").last().val().trim();
      
      var sendingData = {
        "label": linkLabel,
        "url": linkURL
      }
      
      $.ajax({
        type: "POST",
        url: "/addLink",
        data: JSON.stringify(sendingData),
        contentType: "application/json",
        success: function(returnedData) {
          window.location.reload(true);
        },
        error: function(err) {
          console.log(err);
        }
      });
      
    });
    
    $("#remove_link").click(function() {
      
      if ($(this).text() == "Remove a link") {
        $(".remove").show();
        $(this).text("Done");
      } else {
        $(".remove").hide();
        $(this).text("Remove a link");
      }
      
    });
    
    $(".remove").click(function() {
      
      var linkLabel = $(this).closest("li").find("a").text();
      var sendingData = {
        "label": linkLabel
      }
      
      $.ajax({
        type: "POST",
        url: "/removeLink",
        data: JSON.stringify(sendingData),
        contentType: "application/json",
        success: function(returnedData) {
          window.location.reload(true);
        },
        error: function(err) {
          console.log(err);
        }
      });
      
    });
    
    $("#newEvent").click(function() {
      
      var $name = $("#newEventInput").find("input").first();
      var $location = $name.next();
      var $date = $location.next();
      var $time = $date.next();
      var $category = $time.next();
      var $privacy = $category.next();
      var $cost = $privacy.next();
      var $description = $cost.closest("div").next().find("textarea");
      
      var sendingData = {
        "name": $name.val(),
        "location": $location.val(),
        "date": $date.val(),
        "time": $time.val(),
        "category": $category.val(),
        "type": $privacy.val(),
        "cost": $cost.val(),
        "description": $description.val()
      }
      
      $.ajax({
        "type": "POST",
        "url": "/addEvent",
        "data": JSON.stringify(sendingData),
        "contentType": "application/json",
        "success": function() {
          window.location.reload(true);
        },
        "error": function(err) {
          console.log(err);
        }
      });

    });
    
    $("#removeEvent").click(function() {
      
      var url = window.location.pathname.substring(8, window.location.pathname.length);
      $.ajax({
        "type": "POST",
        "url": "/removeEvent",
        "data": JSON.stringify({ "url": url }),
        "contentType": "application/json",
        "success": function() {
          window.location = "/events";
        },
        "error": function(err) {
          console.log(err);
        }
      });
      
    });
    
    $("#addAttendee").click(function() {
      
      var url = window.location.pathname.substring(8, window.location.pathname.length);
      
      $.ajax({
        "type": "POST",
        "url": "/addAttendee",
        "data": JSON.stringify({ "url": url }),
        "contentType": "application/json",
        "success": function() {
          window.location.reload(true);
        },
        "error": function(err) {
          console.log(err);
        }
      });
      
    });
    
    $("#removeAttendee").click(function() {
      
      var url = window.location.pathname.substring(8, window.location.pathname.length);
      
      $.ajax({
        "type": "POST",
        "url": "/removeAttendee",
        "data": JSON.stringify({ "url": url }),
        "contentType": "application/json",
        "success": function() {
          window.location.reload(true);
        },
        "error": function(err) {
          console.log(err);
        }
      });
      
    });
    
    $(".event_thumb").mouseenter(function() {
      $(this).css("background", "#FADDDD").css("border", "2px solid #FA0000");
    });
    
    $(".event_thumb").mouseleave(function() {
      $(this).css("background", "#FFFFFF").css("border", "1px solid #FA0000");
    });
    
	function authenticate(usr, pwd) {
		
        var sendingData = {
			username: usr,
            password: pwd
        }

        $.ajax({
            type: 'POST',
            url: '/login',
            data: JSON.stringify(sendingData),
			contentType: 'application/json',
            success: function(returnedData) {
                if (returnedData === true) {
                    window.location.reload(true);
                } else {
                    alert("Sorry, that username/password combination was incorrect.");
					//alert(pwd);
					$("#login_form").find("input").first().next().val("");
					$("#login_form").find("input").first().next().focus();
				}
            },
            error: function(err) {
                console.log(err);
            }
		});
	}
});
