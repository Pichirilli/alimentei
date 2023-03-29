$(document).ready(async function () {
  const avatars = $("#avatarContainer img");

  avatars.each((index, avatar) => {
    $(avatar).on("click", (event) => {
      removeAllSelected();
      event.target.classList.add("selected");
    });
  });

  const currentAvatar = $("#currentAvatar").text();
  avatars.each((index, avatar) => {
    let src = $(avatar).attr("src");
    src == currentAvatar ? $(avatar).toggleClass("selected") : "";
  });

  $(".content-top__close").on("click", function () {
    exitModal();
  });
});

$("#loginForm").on("submit", async function (event) {
  event.preventDefault();
  await sendForm();
});

async function sendForm() {
  let selected = getAndValidateSelectedAvatar();
  let input = getAndValidateNickname();
  if (selected && input) {
    const form = document.getElementById("loginForm");
    const formData = new FormData(form);
    const img = $(".selected");
    const url = "login.php";
    formData.append("avatar_src", img.attr("src"));

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        window.location.href = "index.php?conn=failed";
      } else {
        window.location.href = "index.php";
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

function getAndValidateNickname() {
  const nicknameInput = $(".content-main__form-input");
  const nicknameValue = nicknameInput.val();
  const errorMessage = "O apelido deve conter entre 2 e 20 caracteres";
  const errorTarget = ".modal__content-main__form-nickname";

  if (nicknameValue.length < 2 || nicknameValue.length > 20) {
    raiseValidationError(errorTarget, errorMessage);
    return false;
  }

  return true;
}

function getAndValidateSelectedAvatar() {
  const selected = $("#avatarContainer").find("img.selected");

  if (selected.length > 1) {
    removeAllSelected();
    const target = "#avatarContainer";
    const message = "Selecione apenas um avatar";
    raiseValidationError(target, message);
    return false;
  } else if (selected.length == 0) {
    const target = "#avatarContainer";
    const message = "Selecione o seu avatar";
    raiseValidationError(target, message);
    return false;
  }

  return selected;
}

function raiseValidationError(target, message) {
  const duration = 2000;
  $(target).html(`<p class="error">${message}</p>`);
  setTimeout(() => $(".error").remove(), duration);

  $(".content-main__form-submit").prop("disabled", true);
  setTimeout(
    () => $(".content-main__form-submit").prop("disabled", false),
    duration
  );
}

function removeAllSelected() {
  $("img").each(function () {
    if ($(this).hasClass("selected")) {
      $(this).removeClass("selected");
    }
  });
}

function exitModal() {
  window.location.href = "index.php";
}
