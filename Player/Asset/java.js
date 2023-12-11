document.addEventListener('DOMContentLoaded', function () {
  const videoPlayer = document.getElementById('videoPlayer');
  const subtitleOverlay = document.getElementById('subtitleOverlay');
  let cues = [];

  videoPlayer.addEventListener('timeupdate', function () {
    const currentTime = videoPlayer.currentTime;
    const currentSubtitle = findCurrentSubtitle(currentTime);
    displaySubtitle(currentSubtitle);
  });

  function findCurrentSubtitle(currentTime) {
    return cues.find(cue => currentTime >= cue.start && currentTime <= cue.end);
  }

  function displaySubtitle(subtitle) {
    subtitleOverlay.innerHTML = subtitle ? subtitle.text : '';
  }

  fetch('SUBTITLE.ass')
  .then(response => response.text())
  .then(data => {
    console.log(data); // Tampilkan isi file subtitle di konsol
    cues = parseAssSubtitle(data);
  })
  .catch(error => console.error('Error fetching or parsing subtitles:', error));

  function parseAssSubtitle(data) {
  const cues = [];
  const lines = data.split('\n');
  lines.forEach(line => {
    if (line.startsWith('Dialogue:')) {
      const parts = line.split(',');
      const start = parseAssTime(parts[1]);
      const end = parseAssTime(parts[2]);
      const text = parts.slice(9).join(',').trim();
      if (!isNaN(start) && !isNaN(end)) {
        cues.push({ start, end, text });
      }
    }
  });

  console.log(cues); // Tampilkan di konsol untuk memeriksa hasil parsing

  return cues;
}


  function parseAssTime(timeString) {
    const timeParts = timeString.split(':');
    if (timeParts.length === 3) {
      const hours = parseFloat(timeParts[0]);
      const minutes = parseFloat(timeParts[1]);
      const seconds = parseFloat(timeParts[2]);
      return hours * 3600 + minutes * 60 + seconds;
    }
    return NaN;
  }
});
