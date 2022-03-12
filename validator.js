// Các bước làm
//1. lấy formElement
//2. lấy form-gruop để blur
//3. lấy elment input

//*đối tượng calidator
function validator(options) {
  var selectorRules = {};
  //*hàm thực hiện validate
  function validate(elmentInput, rule) {
    var elmentError = elmentInput.parentElement.querySelector(options.fromMessage);
    var errorMessage;

    //Lấy ra rule của selector
    var rules = selectorRules[rule.selector];

    //lặp qua từng rule và kiểm tra
    for (var i = 0; i < rules.length; ++i) {
      errorMessage = rules[i](elmentInput.value);
      if(errorMessage) break;
    }

    if (errorMessage) {
      elmentError.innerText = errorMessage;
      elmentInput.parentElement.classList.add("invalid");
    } else {
      elmentError.innerText = "";
      elmentInput.parentElement.classList.remove("invalid");
    }
  }

  var formElement = document.querySelector(options.form);

  if (formElement) {
      //* khi submit form button
    formElement.onsubmit = function(e) {
      e.preventDefault()
      //* lặp qua từng rules và validate
      options.rules.forEach(rule => {
        var elmentInput = formElement.querySelector(rule.selector);
        validate(elmentInput, rule);
      })
    }

    options.rules.forEach((rule) => {
      //*Lưu lại các rule trong input
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      var elmentInput = formElement.querySelector(rule.selector);

      if (elmentInput) {
        //*xử lý blur khỏi input
        elmentInput.onblur = function () {
          validate(elmentInput, rule);
        };

        //* xử lý xóa lỗi khi người dùng nhập
        elmentInput.oninput = function () {
          var elmentError = elmentInput.parentElement.querySelector(
            options.fromMessage
          );
          elmentError.innerText = "";
          elmentInput.parentElement.classList.remove("invalid");
        };
      }
    });
    // console.log(selectorRules);
  }
}

//*định nghĩa các ruls
validator.isRequired = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : "Vui lòng nhập trường này ";
    },
  };
};
validator.isEmail = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regexEmail.test(value) ? undefined : "Trường này phải là email";
    },
  };
};
validator.minLength = function (selector, min) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= 6 ? undefined : `Vui lòng nhập trên ${min} ký tự`;
    },
  };
};
validator.isConfirmed = function (selector, comfrimValue, comfrimPass) {
  return {
    selector: selector,
    test: function (value) {
      return value === comfrimValue()
        ? undefined
        : comfrimPass || "Nhâp sai vui lòng nhập lại ";
    },
  };
};
