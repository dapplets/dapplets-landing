import ajaxChimp from 'ajaxchimp';

const getInput = document.querySelector('.form__input');
getInput.addEventListener('input', isCheckError);

function isCheckError({ target }) {
  return target.classList.contains('error')
    ? target.classList.remove('error')
    : null;
}

function success() {
  const input = document.querySelector('.form__input');

  if (input.classList.contains('valid')) {
    const getForm = input.parentNode.parentNode.parentNode;
    getForm.classList.add('success');
  }
}

$('#form').ajaxChimp({
  url: 'https://dapplets.us5.list-manage.com/subscribe/post?u=cd322894ccdf61c34acfd187b&id=0c9d1e453b',
  callback: callbackFunction
});

function callbackFunction(response) {

  switch (response.result) {
    case "error": {
      // msg: '0 - Please enter a value'
    }

    case "success": {
      success();
    }
  }
}