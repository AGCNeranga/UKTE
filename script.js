// === Smooth Background Slideshow ===
const bgImages = [
  "https://wallpapercat.com/w/full/b/b/8/2131817-2560x1600-desktop-hd-horse-racing-wallpaper-photo.jpg",
  "https://i.guim.co.uk/img/media/0daf9002bbf54ce8211a62204eb647cbffd4e47a/32_0_3437_2063/master/3437.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=5a11078eb12d7150284057d4ba799f46",
  "https://sustainhealth.fit/wp-content/uploads/2023/04/jockeys-racing-horses-in-a-race.jpg",
  "https://images.ctfassets.net/u8w3l566ay8a/p0gNRwo9damcp4aS81ybf/74ec1bb4c307def0fcb094e49e594fe1/GettyImages-1137689666.jpg?w=980&h=520&fit=fill&f=faces",
  "https://puntcdn.com/news-uploads/Ostraka_1729336122.jpg",
  "https://horsebetting.com.au/wp-content/smush-webp/2024/08/Gentleman-Roy.jpg.webp",
  "https://plantbasednews.org/app/uploads/2021/10/plant-based-news-horse-racing-1.jpg"
];
// === charith neranga website ===
let current = 0;
const bg1 = document.getElementById('bg1');
const bg2 = document.getElementById('bg2');
bg1.style.backgroundImage = `url('${bgImages[0]}')`;

setInterval(() => {
  let next = (current + 1) % bgImages.length;
  bg2.style.backgroundImage = `url('${bgImages[next]}')`;
  bg2.style.opacity = 1;
  setTimeout(() => {
    bg1.style.backgroundImage = `url('${bgImages[next]}')`;
    bg2.style.opacity = 0;
    current = next;
  }, 2000);
}, 5000);

document.getElementById("password").addEventListener("keypress", function (e) {
  if (e.key === "Enter") checkPassword();
});

function checkPassword() {
  const entered = document.getElementById("password").value;
  if (entered === "lal1234") {
    document.getElementById("passwordScreen").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
  } else {
    alert("Incorrect password!");
  }
}

function logout() {
  document.getElementById("mainContent").style.display = "none";
  document.getElementById("passwordScreen").style.display = "block";
  document.getElementById("password").value = "";
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;");
}
// === charith neranga website ===
function clearAll() {
  document.getElementById('raceText').value = '';
  document.getElementById('meetingsInput').value = '';
  document.getElementById('minPrize').value = '';
  document.getElementById('maxPrize').value = '';
  document.getElementById('output').innerHTML = '';
  processedRaces = [];
}

function processText() {
  const text = document.getElementById('raceText').value;
  const output = document.getElementById('output');
  const minPrize = parseInt(document.getElementById('minPrize').value || 0);
  const maxPrize = parseInt(document.getElementById('maxPrize').value || 9999999);

  const meetingsRaw = document.getElementById('meetingsInput').value;
  const meetingsFilter = meetingsRaw
    ? meetingsRaw.split(',').map(m => m.trim().toUpperCase()).filter(m => m.length > 0)
    : [];

  if (!text.trim()) {
    alert('Please paste race card text first.');
    return;
  }
// === charith neranga website ===
  const lines = text.split(/\r?\n/);
  let currentMeeting = 'Unknown';
  let raceNumberCounter = 0;
  let races = [];

  const explicitRaceLineRegex = /^([\w]+(?:\s*\/\s*\d+)?)[\s]+(\d{1,2}[—:]\d{2})/;
  const timeOnlyLineRegex = /^\d{1,2}[—:]\d{2}$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/^[A-Z\s\-']{1,30}$/.test(line) && !line.match(/\d/) && !line.includes('£')) {
      currentMeeting = line;
      raceNumberCounter = 0;
      continue;
    }

    let explicitMatch = line.match(explicitRaceLineRegex);
    if (explicitMatch) {
      const raceNumber = explicitMatch[1].trim();
      const ukTime = explicitMatch[2];

      let slTime = 'N/A';
      let raceName = '';
      let prize = 0;

      for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
        const l = lines[j].trim();
        if (slTime === 'N/A' && /^\(?\d{1,2}[:.]\d{2}\)?$/.test(l)) {
          slTime = l.replace(/[()]/g, '');
        }
        if (!raceName && l.length > 5 && !l.includes('£') && !/^\(?\d{1,2}[.:]\d{2}\)?$/.test(l)) {
          raceName = l;
        }
        if (!prize) {
          const pMatch = l.match(/£([\d,]+)/);
          if (pMatch) prize = parseInt(pMatch[1].replace(/,/g, ''));
        }
        if (slTime !== 'N/A' && raceName && prize) break;
      }
      if (meetingsFilter.length && !meetingsFilter.includes(currentMeeting.toUpperCase())) continue;
      if (prize >= minPrize && prize <= maxPrize) {
        races.push({meeting: currentMeeting, raceNumber, ukTime, rawSLTime: slTime, raceName, prize});
      }
      continue;
    }
// === charith neranga website ===
    if (timeOnlyLineRegex.test(line)) {
      raceNumberCounter++;
      const ukTime = line;
      let slTime = 'N/A';
      if (i + 1 < lines.length && /^\(\d{1,2}\.\d{2}\)$/.test(lines[i + 1].trim())) {
        slTime = lines[i + 1].trim().slice(1, -1);
        i++;
      }
      let raceName = '';
      let j = i + 1;
      while (j < lines.length && lines[j].trim().length < 100) {
        const candidate = lines[j].trim();
        if (candidate.length > 5 && !candidate.includes('£') && !/^\(?\d{1,2}[.:]\d{2}\)?$/.test(candidate)) {
          raceName = candidate;
          break;
        }
        j++;
      }
      let prize = 0;
      for (let k = j; k < Math.min(j + 10, lines.length); k++) {
        const pMatch = lines[k].match(/£([\d,]+)/);
        if (pMatch) {
          prize = parseInt(pMatch[1].replace(/,/g, ''));
          break;
        }
      }
      if (meetingsFilter.length && !meetingsFilter.includes(currentMeeting.toUpperCase())) continue;
      if (prize >= minPrize && prize <= maxPrize) {
        races.push({meeting: currentMeeting, raceNumber: raceNumberCounter.toString(), ukTime, rawSLTime: slTime, raceName, prize});
      }
      continue;
    }
  }
// charith neranga website
  if (races.length === 0) {
    output.innerHTML = '<p class="text-warning">No races found for the selected criteria.</p>';
    processedRaces = [];
    return;
  }

  races.sort((a, b) => {
    const timeToMinutes = t => {
      if (t === 'N/A') return 9999;
      const parts = t.split(/[:.]/).map(Number);
      return (parts[0] || 0) * 60 + (parts[1] || 0);
    };
    return timeToMinutes(a.rawSLTime) - timeToMinutes(b.rawSLTime);
  });

  processedRaces = races;
  renderRaces(races);
}

function renderRaces(races) {
  const output = document.getElementById('output');
  output.innerHTML = races.map(r => `
    <div class="race-block">
      <div class="race-meeting">Race Course: ${r.meeting}</div>
      <div class="race-number">Race Number: ${r.raceNumber}</div>
      <div class="race-time">UK Time: ${r.ukTime}</div>
      <div class="race-time">SL Time: ${r.rawSLTime}</div>
      <div>Race Name: ${escapeHtml(r.raceName)}</div>
      <div class="race-prize">Prize Money: £${r.prize.toLocaleString()}</div>
    </div>
  `).join('');
}
// === charith neranga website ===
function showTopRaces(limit) {
  if (!processedRaces.length) {
    alert("Please process races first.");
    return;
  }
  const topRaces = [...processedRaces].sort((a, b) => b.prize - a.prize).slice(0, limit);
  renderRaces(topRaces);
}

// Best Race Per Meeting
function showBestRacePerMeeting() {
  if (!processedRaces.length) {
    alert("Please process races first.");
    return;
  }

  const bestRaces = {};
  processedRaces.forEach(r => {
    if (!bestRaces[r.meeting] || r.prize > bestRaces[r.meeting].prize) {
      bestRaces[r.meeting] = r;
    }
  });

  renderRaces(Object.values(bestRaces));
}

let processedRaces = [];



