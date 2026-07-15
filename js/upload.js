/* REVOGUE - closet upload, tagging, and rendering (max 15 photos, resized client-side before storing) */

const MAX_CLOSET_ITEMS = 15;
const MAX_DIMENSION = 640;
const CLOTHING_TYPES = ['top', 'bottom', 'dress', 'outerwear', 'footwear', 'accessory'];

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
  currentUser = Store.getCurrentUser();
  if (!currentUser) {
    location.href = 'login.html';
    return;
  }

  document.getElementById('greeting').textContent = `Welcome back, ${currentUser.name.split(' ')[0]}!`;
  document.getElementById('profileLine').textContent = `Styling for age ${currentUser.age} · ${currentUser.location}`;

  document.getElementById('fileInput').addEventListener('change', handleFiles);
  renderCloset();
});

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > MAX_DIMENSION) {
          height = Math.round(height * (MAX_DIMENSION / width));
          width = MAX_DIMENSION;
        } else if (height > MAX_DIMENSION) {
          width = Math.round(width * (MAX_DIMENSION / height));
          height = MAX_DIMENSION;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function handleFiles(e) {
  const files = Array.from(e.target.files || []);
  const msg = document.getElementById('uploadMsg');
  const closet = Store.getCloset(currentUser.id);

  if (!files.length) return;

  const room = MAX_CLOSET_ITEMS - closet.length;
  if (room <= 0) {
    msg.textContent = `Your closet is full (${MAX_CLOSET_ITEMS} photos max). Remove an item to add a new one.`;
    e.target.value = '';
    return;
  }

  const toAdd = files.slice(0, room);
  if (files.length > room) {
    msg.textContent = `Only ${room} more photo(s) could be added to stay within the ${MAX_CLOSET_ITEMS}-photo limit.`;
  } else {
    msg.textContent = '';
  }

  for (const file of toAdd) {
    try {
      const dataUrl = await resizeImage(file);
      closet.push({ id: 'c_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), dataUrl, type: 'top', addedAt: Date.now() });
    } catch (err) {
      // skip files that fail to load as images
    }
  }

  Store.saveCloset(currentUser.id, closet);
  e.target.value = '';
  renderCloset();
}

function renderCloset() {
  const closet = Store.getCloset(currentUser.id);
  const grid = document.getElementById('closetGrid');
  const empty = document.getElementById('closetEmpty');
  document.getElementById('closetCount').textContent = closet.length;

  grid.innerHTML = '';
  empty.style.display = closet.length ? 'none' : 'block';

  closet.forEach(item => {
    const card = document.createElement('div');
    card.className = 'closet-item';
    card.innerHTML = `
      <img src="${item.dataUrl}" alt="Closet item">
      <span class="tag">${item.type}</span>
      <button class="remove-btn" title="Remove" data-id="${item.id}">&times;</button>
      <select data-id="${item.id}" style="position:absolute; bottom:8px; left:8px; right:8px; font-size:0.72rem; padding:4px 6px; border-radius:8px; border:none;">
        ${CLOTHING_TYPES.map(t => `<option value="${t}" ${t === item.type ? 'selected' : ''}>${t}</option>`).join('')}
      </select>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const closet = Store.getCloset(currentUser.id).filter(i => i.id !== btn.dataset.id);
      Store.saveCloset(currentUser.id, closet);
      renderCloset();
    });
  });

  grid.querySelectorAll('select').forEach(sel => {
    sel.addEventListener('change', () => {
      const closet = Store.getCloset(currentUser.id);
      const item = closet.find(i => i.id === sel.dataset.id);
      if (item) item.type = sel.value;
      Store.saveCloset(currentUser.id, closet);
      renderCloset();
    });
  });
}
