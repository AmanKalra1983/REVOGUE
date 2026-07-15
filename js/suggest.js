/* REVOGUE - AI Style Advisor (simulated). Combines occasion + age + location + closet items
   into a styled "look" using randomized templates — a stand-in for a real Gemini API call
   so the app runs entirely client-side on GitHub Pages. See purpose.html for details. */

const OCCASIONS = {
  casual: {
    label: 'Casual Day Out',
    tips: [
      'keep it relaxed with easy layering and comfortable footwear',
      'balance loose and fitted pieces for an effortless silhouette',
      'roll up sleeves and add a crossbody bag for an off-duty feel'
    ],
    accessories: ['canvas tote bag', 'minimalist sneakers', 'round sunglasses', 'woven belt', 'baseball cap', 'layered pendant necklace']
  },
  office: {
    label: 'Office / Formal',
    tips: [
      'stick to clean lines and a structured silhouette for a polished look',
      'add one tailored piece to instantly sharpen the outfit',
      'keep accessories minimal and let the tailoring do the talking'
    ],
    accessories: ['leather tote bag', 'slim wristwatch', 'stud earrings', 'pointed flats', 'structured blazer pin', 'silk neck scarf']
  },
  party: {
    label: 'Party Night',
    tips: [
      'go bold with one statement piece and keep the rest sleek',
      'add metallics or shimmer to catch the light on the dance floor',
      'play with texture — velvet, satin or sequins elevate any base outfit'
    ],
    accessories: ['statement drop earrings', 'metallic clutch', 'strappy heels', 'layered chain necklace', 'cocktail ring', 'sleek hair clip']
  },
  wedding: {
    label: 'Wedding Guest',
    tips: [
      'lean into rich colours and celebratory fabrics without outshining the hosts',
      'add traditional-inspired jewellery to complement festive outfits',
      'choose comfortable heels — you will be on your feet celebrating all day'
    ],
    accessories: ['statement jhumkas', 'embellished clutch', 'block heels', 'bangles set', 'dupatta pin', 'floral hair accessory']
  },
  date: {
    label: 'Date Night',
    tips: [
      'pick one flattering piece and build a soft, romantic palette around it',
      'add a delicate accessory that catches attention without overpowering',
      'balance comfort and confidence — you should feel like yourself, elevated'
    ],
    accessories: ['delicate pendant necklace', 'strappy sandals', 'mini shoulder bag', 'subtle hoop earrings', 'silk hair ribbon', 'wrap bracelet']
  },
  travel: {
    label: 'Travel / Vacation',
    tips: [
      'prioritise breathable layers that pack flat and mix-and-match easily',
      'choose one versatile outer layer for changing weather on the go',
      'keep footwear comfortable but pack one dressier option for evenings'
    ],
    accessories: ['crossbody travel bag', 'straw hat', 'comfortable slides', 'oversized scarf', 'lightweight sunglasses', 'travel jewellery pouch']
  },
  festival: {
    label: 'Festival / Celebration',
    tips: [
      'bring in festive colour and shine through accessories and layering',
      'mix traditional and contemporary pieces for a fresh festive look',
      'add bangles, bindis or brooches for a celebratory finishing touch'
    ],
    accessories: ['statement bangles', 'embroidered potli bag', 'juttis', 'maang tikka', 'brooch pin', 'tassel earrings']
  },
  gym: {
    label: 'Gym / Sporty',
    tips: [
      'prioritise stretch and moisture-wicking pieces for full mobility',
      'coordinate colours between top and bottom for a put-together athletic look',
      'add functional accessories that keep hands free during a workout'
    ],
    accessories: ['sports duffel bag', 'running shoes', 'fitness tracker band', 'sweat-wicking cap', 'gym towel wrap', 'wireless earbuds case']
  }
};

function ageBracketTone(age) {
  if (age < 20) return 'youthful, trend-forward';
  if (age < 30) return 'fresh, confident';
  if (age < 45) return 'polished, refined';
  return 'timeless, elegant';
}

function generateLook(user, occasionKey, closetItems) {
  const occasion = OCCASIONS[occasionKey];
  const source = closetItems.length ? closetItems : [{ type: 'go-to piece' }];
  const chosen = pickRandomN(source, Math.min(3, source.length));
  const itemTypes = [...new Set(chosen.map(i => i.type))].join(', ');
  const tone = ageBracketTone(user.age);
  const tip = pickRandom(occasion.tips);
  const accessories = pickRandomN(occasion.accessories, 3);
  const seed = randomSeed();

  return {
    id: 'l_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    occasionLabel: occasion.label,
    image: picsum(seed, 460, 560),
    description: `Style your ${itemTypes} with a ${tone} touch — ${tip}. A look tailored for ${user.location}.`,
    accessories,
    thumbs: chosen.filter(i => i.dataUrl).map(i => i.dataUrl),
    timestamp: Date.now()
  };
}

function lookCardHTML(look) {
  const time = new Date(look.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  return `
    <div class="look-card">
      <img src="${look.image}" alt="Suggested styled look for ${look.occasionLabel}">
      <div>
        <span class="occasion-pill">${look.occasionLabel}</span>
        <h3>Your AI-Styled Look</h3>
        <p>${look.description}</p>
        <div class="accessory-list">
          ${look.accessories.map(a => `<a class="accessory-chip" target="_blank" rel="noopener" href="${amazonSearchUrl(a)}"><span class="cart-icon">🛒</span> ${a}</a>`).join('')}
        </div>
        <p class="form-hint" style="margin-top:14px;">Generated ${time} · Accessory links open Amazon search results</p>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('suggestBtn');
  if (!btn) return;

  const user = Store.getCurrentUser();
  if (!user) return;

  renderHistory(user);

  btn.addEventListener('click', () => {
    const closet = Store.getCloset(user.id);
    const occasionKey = document.getElementById('occasionSelect').value;
    const look = generateLook(user, occasionKey, closet);

    const history = Store.getHistory(user.id);
    history.unshift(look);
    Store.saveHistory(user.id, history);

    document.getElementById('suggestResults').innerHTML = lookCardHTML(look);
    renderHistory(user);
  });
});

function renderHistory(user) {
  const wrap = document.getElementById('historyResults');
  const history = Store.getHistory(user.id);
  if (!history.length) {
    wrap.innerHTML = '<p class="empty-state">No looks generated yet — try the AI Style Advisor above.</p>';
    return;
  }
  wrap.innerHTML = history.map(lookCardHTML).join('');
}
