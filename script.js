document.addEventListener("DOMContentLoaded", () => {
  const API_URL = 'https://jsonplaceholder.typicode.com/users';
  const cardsContainer = document.getElementById('cards-container');
  const loading = document.getElementById('loading');
  const errorMessage = document.getElementById('error-message');
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');

  
  function showLoading() {
    loading.classList.remove('hidden');
  }


  function hideLoading() {
    loading.classList.add('hidden');
  }

  
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
  }


  function hideError() {
    errorMessage.classList.add('hidden');
  }


  function createUserCard(user) {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <h3>${user.name}</h3>
      <p><strong>Username:</strong> ${user.username}</p>
      <p><strong>Email:</strong> <a href="mailto:${user.email}">${user.email}</a></p>
      <p><strong>City:</strong> ${user.address.city}</p>
      <p><strong>Company:</strong> ${user.company.name}</p>
    `;
    return card;
  }

 
  function renderUsers(users) {
    cardsContainer.innerHTML = '';
    if (users.length === 0) {
      cardsContainer.innerHTML = '<p>No users found.</p>';
      return;
    }
    users.forEach(user => {
      const card = createUserCard(user);
      cardsContainer.appendChild(card);
    });
  }

 
  async function fetchUsers() {
    showLoading();
    hideError();
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const users = await response.json();
      renderUsers(users);
     
      localStorage.setItem('allUsers', JSON.stringify(users));
    } catch (err) {
      showError('Failed to fetch data. Please try again.');
    } finally {
      hideLoading();
    }
  }


  function filterUsers(term) {
    const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
    return allUsers.filter(user => user.username.toLowerCase().includes(term.toLowerCase()));
  }


  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const term = searchInput.value.trim();
    const filtered = filterUsers(term);
    renderUsers(filtered);
  
    localStorage.setItem('lastSearch', term);
  });

  
  function init() {
    fetchUsers();
    const lastSearchTerm = localStorage.getItem('lastSearch') || '';
    searchInput.value = lastSearchTerm;
    if (lastSearchTerm) {
      const filtered = filterUsers(lastSearchTerm);
      renderUsers(filtered);
    }
  }

  init();
});