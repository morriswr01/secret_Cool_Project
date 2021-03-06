$(document).ready(function () {

  // Remove empty fields from GET forms
  $("form").submit(function () {
    $(this).find(":input").filter(function () {
      return !this.value;
    }).attr("disabled", "disabled");
    return true; // ensure form still submits
  });
  // Un-disable form fields when page loads, in case they click back after submission
  $("form").find(":input").prop("disabled", false);


  //Show applicant login modal
  $('#applicant-login-button').click(function () {
    target = $('#applicant-login-modal');

    target.css("display", "block");
  });

  //Show admin login modal
  $('#admin-login-button').click(function () {
    target = $('#admin-login-modal');

    target.css("display", "block");
  });

  //Show show account settings modal
  $('#account-settings-button').click(function () {
    target = $('#account-settings-modal');

    target.css("display", "block");
  });

  $('#new-job-button').click(function () {
    target = $('#add-new-job-modal');

    target.css("display", "block");
  });

  //Close modals on clicking cross button
  $('.close-modal').click(function () {
    target = $(this).parent().parent().parent();

    target.css("display", "none");
  });

  //Show accordion upon selecting a job to view
  $('.selectJob').on('click', function (e) {
    target = $(this).next().first();

    $('.jobDesc').not(target).hide();

    $(target).toggle('fast');
  });

  // CREATEAPPLICATION PAGE

  //Populate languages dropdown
  var languages = ["SQL", "Javascript", "Java", "C#", "Python", "C++", "PHP", "Ruby", "Swift"];
  var options = '';
  languages.forEach(language => {
    options += '<option value="' + language + '">' + language + '</option>';
  });
  $('#progLangName').append(options);

  //Populate Number of years of employment worked
  options = '';
  for (let i = 0; i < 50; i++) {
    options += '<option value="' + i + '">' + i + ' years</option>';
  }
  options += '<option value="50">50+</option>';
  $('#years').append(options);

  //Add new a-level on clicking add
  $('.add-input').click(function (e) {
    e.preventDefault();
    appendDiv = $(this).parent().siblings().first().next();
    fieldName = appendDiv.attr('id');
    nameInput = $(this).siblings().first();
    gradeOrProficiency = $(this).siblings().first().next();

    if (nameInput.val() != "" && gradeOrProficiency.val() != "") {
      $(appendDiv).append('<div class="threeColumnFields"><input type="text" name="' + fieldName + '[name]" value="' + nameInput.val() + '" readonly="readonly" /><input type="text" name="' + fieldName + '[proficiency]" value="' + gradeOrProficiency.val() + '" readonly="readonly" /><i class="remove material-icons">close</i></div>');
      $('.resetSelect').prop('selectedIndex', 0);
      nameInput.val("");
      gradeOrProficiency.val("");
    }
  });

  $('.editBtn').click(function () {
    target = $('#edit-job-modal');
    positionID = $(this).parent().attr('id');
    jobTitle = $('.' + positionID).get(0).innerHTML;
    description = $('.' + positionID).get(1).innerHTML;

    $('#editJobForm #positionID').val(positionID);
    $('#editJobForm #newJobTitle').val(jobTitle);
    $('#editJobForm #newJobDescription').val(description);

    target.css("display", "block");
  });

  //Add employment on clicking add
  $('.add-prev-employment').click(function (e) {
    e.preventDefault();
    nameInput = $('#companyName');
    postName = $('#postName');
    lengthYears = $('#years');
    lengthMonths = $('#months');

    if (nameInput.val() != "" && postName.val() != "" && lengthYears.val() != "" && lengthMonths.val() != "") {
      console.log('these are not empty');
      $('.prevEmploymentDetails').append('<div class="company"><input type="text" name="previousEmployment[companyName]" readonly="readonly" value="' + nameInput.val() + '" /><input type="text" name="previousEmployment[postName]" readonly="readonly" value="' + postName.val() + '" /> <div class="threeColumnFields employmentLength"> <input type="text" name="previousEmployment[lengthYears]" readonly="readonly" value="' + lengthYears.val() + '" /><input type="text" name="previousEmployment[lengthMonths]" readonly="readonly" value="' + lengthMonths.val() + '" /><i class="remove-employment material-icons">close</i></div>');

      $('.resetSelect').prop('selectedIndex', 0);
      nameInput.val("");
      postName.val("");
    }
  });

  //A Remove input
  $('body').on('click', '.remove', function (e) {
    $(this).parent().remove();
  });

  //A Remove employment
  $('body').on('click', '.remove-employment', function (e) {
    $(this).parent().parent().remove();
  });
  $('body').on('click', '.reqInterview', function () {
    $.ajax({
      type: 'POST',
      url: 'adminAction/',
      data: {
        applicationID: $(this).attr("id"),
        action: "requestInterview"
      },
      success: function () {
        //
      }
    });
    $(this).parent().parent().parent().fadeOut();
  });
  $('body').on('click', '.rejectApplicant', function () {
    $.ajax({
      type: 'POST',
      url: 'adminAction/',
      data: {
        applicationID: $(this).attr("id"),
        action: "rejectApplicant"
      },
      success: function () {

      }
    });
    $(this).parent().parent().parent().fadeOut();
  });
  var csrftoken = $("[name=csrfmiddlewaretoken]").val();
  $('body').on('click', '.deleteBtn', function () {
    $.ajax({
      type: 'POST',
      headers: {
        "X-CSRFToken": csrftoken
      },
      url: 'deletePosition/',
      data: {
        positionID: $(this).parent().attr("id"),
      },
      success: function () {

      }
    });
    $(this).parent().parent().parent().fadeOut();
  });
  $('body').on('click', '.applyBtn', function () {
    $.ajax({
      type: 'POST',
      headers: {
        "X-CSRFToken": csrftoken
      },
      url: 'openClosePosition/',
      data: {
        positionID: $(this).parent().attr("id"),
        current: $(this).html()
      },
      success: function () {

      }
    });
    var openUntil = $('input[name=openUntil]');
    if ($(this).html() == "Re-Open Position") {
      $(this).parent().parent().parent().find('.jobStatus').html("Position Open");
      $(this).parent().parent().parent().find('.jobStatus').addClass('open').removeClass('closed');
      $(this).parent().parent().parent().find('.jobDeadline').addClass('open').removeClass('closed');
      $(this).parent().parent().parent().find('.jobDeadline').html("Open Until: " + openUntil.val());
      $(this).html("Close Position");

    } else {
      $(this).parent().parent().parent().find('.jobStatus').html("Position Closed");
      $(this).parent().parent().parent().find('.jobStatus').addClass('closed').removeClass('open');
      $(this).parent().parent().parent().find('.jobDeadline').addClass('closed').removeClass('open');
      $(this).parent().parent().parent().find('.jobDeadline').html("N/A");
      $(this).html("Re-Open Position");
    }
  });

  $('#applicationSubmit').click(function () {
    $('#appForm').submit();
  });

  $('.rejectWithFeedback').click(function () {
		target = $('#feedback-modal');
		appId = $('#appId');
		appId.val($(this).attr('id'));

		target.css("display", "block");
	});

});