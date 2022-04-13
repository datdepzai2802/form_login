function validator(option) {
  var formElement = document.querySelector(option.form);
  var ruleSelect = {};

  function errorMessage(inputElement, rule) {
    let formMessage = inputElement.parentElement.querySelector(
      option.formMessage
    );
    let errorMessage;

    var rules = ruleSelect[rule.select];

    for (var i = 0; i < rules.length; ++i) {
      errorMessage = rules[i](inputElement.value);
      if (errorMessage) break;
    }

    //kiểm tra dữ liệu input
    if (errorMessage) {
      formMessage.innerHTML = errorMessage;
      inputElement.parentElement.classList.add("invalid");
    } else {
      formMessage.innerHTML = "";
      inputElement.parentElement.classList.remove("invalid");
    }

    return !errorMessage;
  }

  if (formElement) {
    //khi ấn submit form
    formElement.onsubmit = function (e) {
      e.preventDefault();
      var errorSubmit = true;
      option.rules.map(function (rule) {
        var inputElement = formElement.querySelector(rule.select);
        var errorFormSubmit = errorMessage(inputElement, rule);
        if (!errorFormSubmit) {
          errorSubmit = false;
        }
      });

      if (errorSubmit) {
        if (typeof option.onSubmit == "function") {
          var enableinput = formElement.querySelectorAll("[name]");
          var formValue = Array.from(enableinput).reduce(function (
            values,
            input
          ) {
            return (values[input.name] = input.value) && values;
          },
          {});

          option.onSubmit(formValue);
        }
      }
    };

    // lặp qua mỗi rule
    option.rules.map(function (rule) {
      var inputElement = formElement.querySelector(rule.select);

      //lưu lại rule
      if (Array.isArray(ruleSelect[rule.select])) {
        ruleSelect[rule.select].push(rule.test);
      } else {
        ruleSelect[rule.select] = [rule.test];
      }

      if (inputElement) {
        inputElement.onblur = function () {
          errorMessage(inputElement, rule);
        };
        //kiểm tra nhập input dữ liệu
        inputElement.oninput = function () {
          let formMessage = inputElement.parentElement.querySelector(
            option.formMessage
          );
          if (inputElement.value) {
            formMessage.innerHTML = "";
            inputElement.parentElement.classList.remove("invalid");
          }
        };
      }
    });
  }
  // console.log(ruleSelect);
}

//rules
validator.isRequest = function (select) {
  return {
    select,
    test(value) {
      return value ? undefined : "Thông tin chưa được nhập";
    },
  };
};
validator.isEmail = function (select) {
  return {
    select,
    test(value) {
      const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : "Email không chính xác";
    },
  };
};

validator.isMinleng = function (select, min) {
  return {
    select,
    test(value) {
      return value.length >= min
        ? undefined
        : `Mật khẩu cần ít nhất ${min} ký tự`;
    },
  };
};

validator.isPasswordConfirm = function (select, comFirm, mesage) {
  return {
    select,
    test(value) {
      return value === comFirm()
        ? undefined
        : mesage || "Giá trị nhập lại không chính xác";
    },
  };
};
