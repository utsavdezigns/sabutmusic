/* ================================
   SABUT MUSIC — Static Site JS
   ================================ */

/* ── STATIC DATA (edit here to update content) ── */
var musicData = [
  {
    id: 1,
    title: 'Antim Patra',
    producer: 'Beat Producer',
    duration: '3:45',
    lyrics: 'Not ',
    explanation: 'हेर्नुस्, यो मेरो लागि केवल एउटा र्‍याप गीत मात्र होइन। यो मेरो जीवनको एउटा यस्तो अध्याय हो जसमा मैले आफ्ना वास्तविक भावनाहरू पोखेको छु। त्यो एक वर्ष मेरो जीवनको यस्तो समय थियो, जहाँ म पूर्ण रूपमा उसको लतमा थिएँ। मेरो संसार उनी मात्र थिइन्। तर, हाम्रो कथाको अन्त्य हामीले सोचेजस्तो भएन। सायद भगवानको योजना हाम्रो लागि अर्कै थियो र परिस्थितिले गर्दा मैले उसलाई छोड्नुपर्‍यो। यो र्‍यापमा मैले उसलाई पहिलो पटक देख्दाको त्यो सुन्दर सुरुवातदेखि लिएर, उसलाई छोड्नुपर्दाको त्यो विवशतासम्मको सिंगो यात्रालाई एउटै ठाउँमा समेटेको छु। आज हामी सँगै नभए पनि मेरो मनमा उसको लागि कुनै रिस वा गुनासो छैन। उनी अहिले जहाँ छिन्, जे गर्दै छिन्, बस खुसी रहुन् भन्ने मेरो चाहना हो। यो र्‍याप मेरो तर्फबाट उसलाई एउटा मर्यादित बिदाइ र मेरो भावनाको "अन्तिम पत्र" हो।',
    src: 'Antim Patra.mp4',
    coverArt: 'Antim Patra.png'
  },
];

var aboutData = {
  bio1: "I'm Sabut Music, an independent rapper creating authentic hip-hop music directly for my audience. No labels, no filters — just real verses and meaningful lyrics that come straight from the heart.",
  bio2: 'My music reflects real life experiences, struggles, and triumphs. Every track is carefully crafted with messages that resonate with people who value honest storytelling in hip-hop.',
  bio3: 'On this platform, you can explore my complete discography, read the stories behind my lyrics, and track how my music is being appreciated by listeners worldwide.'
};

var projectsData = [
  {
    title: 'Sapana',
    date: 'Coming Soon',
    description: 'The Story Of Dreams.',
    status: 'In Production'
  },
  {
    title: 'Letter To Crush',
    date: 'Coming Soon',
    description: 'The Story Of Love At First Site In Family Function.',
    status: 'Pre-Production'
  },
  {
    title: 'Yektarfi',
    date: 'Coming Soon',
    description: 'The Story Of Always Being One Sided Lover.',
    status: 'Planned'
  }
];

var socialData = {
  email:     'sabut.music@email.com',
  instagram: 'https://instagram.com/sabut_music',
  twitter:   'https://twitter.com/sabut_music',
  tiktok:    'https://tiktok.com/@sabut_music'
};

/* ── PLAYER STATE ── */
var currentTrackIndex = 0;
var isPlaying = false;
var playCount = JSON.parse(localStorage.getItem('playCount')) || {};

var audioPlayer   = document.getElementById('audioPlayer');
var playBtn       = document.getElementById('playBtn');
var prevBtn       = document.getElementById('prevBtn');
var nextBtn       = document.getElementById('nextBtn');
var trackTitleEl  = document.getElementById('trackTitle');
var trackMetaEl   = document.getElementById('trackMeta');
var currentTimeEl = document.getElementById('currentTime');
var durationEl    = document.getElementById('duration');
var progressFill  = document.getElementById('progressFill');
var volumeSlider  = document.getElementById('volumeSlider');
var trackList     = document.getElementById('trackList');
var lyricsGrid    = document.getElementById('lyricsGrid');
var vinyl         = document.getElementById('vinylRecord');

/* ── INIT ── */
function init() {
  renderAbout(aboutData);
  renderProjects(projectsData);
  renderSocial(socialData);
  loadTrackList();
  loadLyrics();
  loadDurations();
  if (musicData.length) selectTrack(0, false);
}

/* ── About ── */
function renderAbout(data) {
  var el = document.getElementById('aboutText');
  if (!el) return;
  el.innerHTML =
    '<p>' + escHtml(data.bio1) + '</p>' +
    '<p>' + escHtml(data.bio2) + '</p>' +
    '<p>' + escHtml(data.bio3) + '</p>';
}

/* ── Projects ── */
function renderProjects(projects) {
  var el = document.getElementById('projectsGrid');
  if (!el) return;
  if (!projects.length) {
    el.innerHTML = '<p style="color:var(--muted)">No upcoming projects yet.</p>';
    return;
  }
  el.innerHTML = projects.map(function(p) {
    return '<div class="project-card">' +
      '<div class="project-date">' + escHtml(p.date) + '</div>' +
      '<h3>' + escHtml(p.title) + '</h3>' +
      '<p>' + escHtml(p.description) + '</p>' +
      '<span class="project-status">' + escHtml(p.status) + '</span>' +
    '</div>';
  }).join('');
}

/* ── Social ── */
function renderSocial(data) {
  var el = document.getElementById('contactLinks');
  if (!el) return;
  el.innerHTML =
    '<a href="mailto:' + escHtml(data.email) + '" class="link-btn">📧 Email</a>' +
    '<a href="' + escHtml(data.instagram) + '" target="_blank" class="link-btn">📸 Instagram</a>' +
    '<a href="' + escHtml(data.twitter) + '" target="_blank" class="link-btn">𝕏 Twitter</a>' +
    '<a href="' + escHtml(data.tiktok) + '" target="_blank" class="link-btn">🎵 TikTok</a>';
}

/* ── Track list ── */
function loadTrackList() {
  if (!trackList) return;
  var header = trackList.querySelector('.track-list-header');

  if (!musicData.length) {
    trackList.innerHTML = '<p style="color:#b3b3b3;text-align:center;padding:3rem">No tracks yet.</p>';
    return;
  }

  var items = musicData.map(function(track, index) {
    var plays = playCount[track.id] || 0;
    var active = index === currentTrackIndex ? ' playing' : '';
    return '<div class="track-item' + active + '" data-index="' + index + '">' +
      '<div class="playing-bars"><span></span><span></span><span></span></div>' +
      '<div class="track-num">' + (index + 1) + '</div>' +
      '<div class="track-info">' +
        '<h3>' + escHtml(track.title) + '</h3>' +
        '<p>' + escHtml(track.producer) + '</p>' +
      '</div>' +
      '<div class="track-plays">' + plays + ' plays</div>' +
      '<span class="duration">' + escHtml(track.duration) + '</span>' +
    '</div>';
  }).join('');

  trackList.innerHTML = items;

  trackList.querySelectorAll('.track-item').forEach(function(item) {
    item.addEventListener('click', function() {
      selectTrack(parseInt(this.getAttribute('data-index')), true);
    });
  });

  if (header) trackList.insertBefore(header, trackList.firstChild);
  else {
    var h = document.createElement('div');
    h.className = 'track-list-header';
    h.innerHTML = '<span class="th-num">#</span><span class="th-info">Title</span><span class="th-plays">Plays</span><span class="th-dur">⏱</span>';
    trackList.insertBefore(h, trackList.firstChild);
  }
}



/* ── Lyrics / Stories ── */
function loadLyrics() {
  if (!lyricsGrid) return;
  if (!musicData.length) {
    lyricsGrid.innerHTML = '<p style="color:var(--muted)">No tracks yet.</p>';
    return;
  }
  lyricsGrid.innerHTML = musicData.map(function(track) {
    return '<div class="lyrics-card">' +
      '<div class="lyrics-card-header">' +
        '<h3>' + escHtml(track.title) + '</h3>' +
        '<span class="duration">' + escHtml(track.duration) + '</span>' +
      '</div>' +
      '<div class="lyrics-explanation">' + escHtml(track.explanation) + '</div>' +
    '</div>';
  }).join('');
}

/* ── Auto-detect durations from audio files ── */
function loadDurations() {
  musicData.forEach(function(track) {
    if (!track.src) return;
    var tempAudio = new Audio();
    tempAudio.preload = 'metadata';
    tempAudio.addEventListener('loadedmetadata', function() {
      track.duration = formatTime(tempAudio.duration);
      loadTrackList();
      loadLyrics();
    });
    tempAudio.src = track.src;
  });
}

/* ── Select track ── */
function selectTrack(index, autoPlay) {
  currentTrackIndex = index;
  var track = musicData[index];
  if (!track) return;

  trackTitleEl.textContent = track.title;
  trackMetaEl.textContent  = track.producer;

  var artArea = document.getElementById('albumArt');
  var waveform = document.getElementById('playerWaveform');
  if (artArea) {
    if (track.coverArt) {
      var existingImg = artArea.querySelector('.player-cover-img');
      if (!existingImg) {
        existingImg = document.createElement('img');
        existingImg.className = 'player-cover-img';
        artArea.appendChild(existingImg);
      }
      existingImg.src = track.coverArt;
      existingImg.style.display = 'block';
      if (waveform) waveform.style.display = 'none';
    } else {
      var img = artArea.querySelector('.player-cover-img');
      if (img) img.style.display = 'none';
      if (waveform) waveform.style.display = 'flex';
    }
  }

  if (track.src) {
    audioPlayer.src = track.src;
    if (autoPlay) {
      audioPlayer.play().catch(function(){});
      setPlaying(true);
    }
  } else {
    audioPlayer.src = '';
    if (autoPlay) setPlaying(true);
  }

  playCount[track.id] = (playCount[track.id] || 0) + 1;
  localStorage.setItem('playCount', JSON.stringify(playCount));
  loadTrackList();
}

/* ── Play / Pause ── */
function setPlaying(state) {
  isPlaying = state;
  var playIcon  = document.getElementById('playIcon');
  var pauseIcon = document.getElementById('pauseIcon');
  var waveform  = document.getElementById('playerWaveform');
  if (playIcon)  playIcon.style.display  = state ? 'none'  : 'block';
  if (pauseIcon) pauseIcon.style.display = state ? 'block' : 'none';
  if (waveform)  waveform.classList.toggle('paused', !state);
  if (vinyl) vinyl.classList.toggle('spinning', state);
}

/* ── Controls ── */
playBtn.addEventListener('click', function() {
  if (isPlaying) { audioPlayer.pause(); setPlaying(false); }
  else { if (audioPlayer.src) audioPlayer.play().catch(function(){}); setPlaying(true); }
});
nextBtn.addEventListener('click', function() {
  selectTrack((currentTrackIndex + 1) % musicData.length, true);
});
prevBtn.addEventListener('click', function() {
  selectTrack((currentTrackIndex - 1 + musicData.length) % musicData.length, true);
});

audioPlayer.addEventListener('timeupdate', function() {
  if (audioPlayer.duration) {
    progressFill.style.width = (audioPlayer.currentTime / audioPlayer.duration * 100) + '%';
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    durationEl.textContent    = formatTime(audioPlayer.duration);
  }
});
audioPlayer.addEventListener('ended', function() {
  if (musicData.length > 1) selectTrack((currentTrackIndex + 1) % musicData.length, true);
  else setPlaying(false);
});

document.querySelector('.progress-bar').addEventListener('click', function(e) {
  var pct = (e.clientX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.offsetWidth;
  if (audioPlayer.duration) audioPlayer.currentTime = pct * audioPlayer.duration;
});
volumeSlider.addEventListener('input', function(e) {
  audioPlayer.volume = e.target.value / 100;
});

function formatTime(s) {
  if (!isFinite(s)) return '0:00';
  var m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return m + ':' + (sec < 10 ? '0' : '') + sec;
}

/* ── Smooth scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ── Fade-up on scroll ── */
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(function(el) { observer.observe(el); });

/* ── Nav active on scroll ── */
var sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', function() {
  var scrollY = window.scrollY + 100;
  sections.forEach(function(sec) {
    var link = document.querySelector('.nav-links a[href="#' + sec.getAttribute('id') + '"]');
    if (link) {
      if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight)
        link.classList.add('nav-active');
      else link.classList.remove('nav-active');
    }
  });
}, { passive: true });

/* ── Circular favicon ── */
(function() {
  var img = new Image();
  img.onload = function() {
    var c = document.createElement('canvas');
    c.width = c.height = 64;
    var ctx = c.getContext('2d');
    ctx.beginPath(); ctx.arc(32, 32, 32, 0, Math.PI * 2); ctx.clip();
    ctx.drawImage(img, 0, 0, 64, 64);
    var link = document.getElementById('faviconLink');
    if (link) link.href = c.toDataURL('image/png');
  };
  img.src = 'sabut.png';
})();

/* ── Escape HTML ── */
function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── Boot ── */
init();
