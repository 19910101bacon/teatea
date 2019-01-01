$(document).ready(function() {
  // $('[data-toggle="tooltip"]').tooltip();
  var actions = $("table td:last-child").html();
  // Append table with add row form on add new button click
  $(".add-new").click(function() {
    $(this).attr("disabled", "disabled");
    var index = $("table tbody tr:last-child").index();
    var row = '<tr>' +
      '<td><input type="text" class="form-control" name="index" id="index" ></td>' +
      '<td><input type="text" class="form-control" name="name" id="name"></td>' +
      '<td><input type="text" class="form-control" name="price" id="money"></td>' +
      '<td><input type="text" class="form-control" name="state" id="state"></td>' +
      '<td>' + actions + '</td>' +
      '</tr>';
    $("table").append(row);
    $("table tbody tr").eq(index + 1).find(".add, .edit").toggle();
    // $('[data-toggle="tooltip"]').tooltip();
  });
  // Add row on add button click
  $(document).on("click", ".add", function() {
    var empty = false;
    var input = $(this).parents("tr").find('input[type="text"]');
    var data = [];
    // console.log(input);
    Check_all_input(Post_to_API)

    function Check_all_input(callback) {
      input.each(function(i, value) {
          Check_empty_value($(this));
          if (i == 1) {

            // input : 一個詞 string   ----->   檢索 items collection的 name欄位 ----> output : "exist"  "nonexist"

            Get_from_API($(this).val());

            function Get_from_API(typing_Iname, callback) {
              $.ajax("http://34.226.147.247:3000/items", {
                type: 'GET',
                success: function(result) {
                  var array_result = JSON.parse(result);
                  var len = array_result.length;
                  var flag = 0; //To record whether typing_Iname matches the data from database or not
                  for (var i = 0; i < len; i++) {
                    // alert(array_result[0][i].Ianme);
                    if (typing_Iname == array_result[i].Iname) {
                      flag = 1;
                      alert("Bingo");
                    }
                  }
                  if (!flag) {
                    // alert("Not match!");

                  }

                },
                error: function(jqXHR, textStatus, errorThrown) {
                  console.log(textStatus, errorThrown);
                  alert(textStatus, errorThrown);
                }
              });
            }
          }

          function Check_empty_value(cell) {
            if (!cell.val()) {
              cell.addClass("error");
              empty = true;
            } else {
              cell.removeClass("error");
              data.push(cell.val())
              // console.log(data)
            }
          }
        })
        callback();
      };

    function Post_to_API() {
      var array_data = data.toString().split(",");
      $.ajax({
        type: 'POST',
        url: 'https://cors.io/?http://34.226.147.247:3000/items',
        data: {
          Iname: array_data[1],
          Price: parseInt(array_data[2]),
          State: array_data[3]
        },
        success: function(data1) {
          alert(data1);
        },
        contentType: "application/x-www-form-urlencoded",
        dataType: "Text"
      });

    }



    $(this).parents("tr").find(".error").first().focus();
    if (!empty) {
      input.each(function() {
        $(this).parent("td").html($(this).val());
      });
      $(this).parents("tr").find(".add, .edit").toggle();
      $(".add-new").removeAttr("disabled");
    }
  });
  // Edit row on edit button click
  $(document).on("click", ".edit", function(err, result) {
    $(this).parents("tr").find("td:not(:last-child)").each(function() {
      $(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
    });
    $(this).parents("tr").find(".add, .edit").toggle();
    $(".add-new").attr("disabled", "disabled");
  });
  // Delete row on delete button click
  $(document).on("click", ".delete", function() {
    $(this).parents("tr").remove();
    $(".add-new").removeAttr("disabled");
  });
});
