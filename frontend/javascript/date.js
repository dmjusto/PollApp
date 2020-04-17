const months = ['january', 'february', 'march', 'april', 'may', 'june',
                'july', 'august', 'september', 'october', 'december'];
const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const dateDisplay = document.querySelector('.date');

var today = new Date();
const day = days[today.getDay()] + ', ';
const month = months[today.getMonth()] + ' ';
const date = today.getDate().toString();

dateDisplay.textContent = day + month + date;