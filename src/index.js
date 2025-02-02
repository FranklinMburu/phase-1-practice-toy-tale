document.addEventListener('DOMContentLoaded', () => {
  fetchToys();
});

// Fetch toys from API and render them as cards
function fetchToys() {
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      const toyCollection = document.getElementById('toy-collection');
      toyCollection.innerHTML = '';  // Clear out any existing toys before rendering new ones
      toys.forEach(toy => {
        const toyCard = createToyCard(toy);
        toyCollection.appendChild(toyCard);
      });
    });
}

// Helper function to create a card for each toy
function createToyCard(toy) {
  const card = document.createElement('div');
  card.classList.add('card');

  const name = document.createElement('h2');
  name.innerText = toy.name;
  card.appendChild(name);

  const image = document.createElement('img');
  image.src = toy.image;
  image.classList.add('toy-avatar');
  card.appendChild(image);

  const likes = document.createElement('p');
  likes.innerText = `${toy.likes} Likes`;
  card.appendChild(likes);

  const likeBtn = document.createElement('button');
  likeBtn.classList.add('like-btn');
  likeBtn.id = toy.id;
  likeBtn.innerText = 'Like ❤️';
  likeBtn.addEventListener('click', () => updateLikes(toy.id, likes));
  card.appendChild(likeBtn);

  return card;
}

// Handle new toy form
const newToyButton = document.getElementById('new-toy-btn');
const toyForm = document.querySelector('.add-toy-form');
newToyButton.addEventListener('click', () => {
  toyForm.style.display = toyForm.style.display === 'block' ? 'none' : 'block';
});

toyForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = event.target.name.value;
  const image = event.target.image.value;

  const newToy = {
    name: name,
    image: image,
    likes: 0
  };

  // POST request to create a new toy
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(newToy)
  })
  .then(response => response.json())
  .then(toy => {
    const newToyCard = createToyCard(toy);
    document.getElementById('toy-collection').appendChild(newToyCard);
    toyForm.reset(); // Reset the form after submission
    toyForm.style.display = 'none'; // Hide the form
  });
});

// Function to handle the like button click
function updateLikes(toyId, likesElement) {
  const newLikesCount = parseInt(likesElement.innerText.split(' ')[0]) + 1;

  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      likes: newLikesCount
    })
  })
  .then(response => response.json())
  .then(updatedToy => {
    likesElement.innerText = `${updatedToy.likes} Likes`;
  });
}
