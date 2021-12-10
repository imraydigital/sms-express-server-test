const fromInput = document.getElementById('from');
const numInput = document.getElementById('number');
const msgInput = document.getElementById('message');
const btn = document.getElementById('button');
const response = document.querySelector('.response');

const send = () => {
  const from = fromInput.value;
  const number = numInput.value.replace(/\D/g, '');
  const text = msgInput.value;

  fetch('/', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: from,
      number: number,
      text: text
    })
  }).then((res) => {
    console.log(res);
  }).catch((err) => {
    console.log(err)
  })
}

btn.addEventListener('click', send, false);