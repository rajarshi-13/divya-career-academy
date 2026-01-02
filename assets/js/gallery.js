fetch('../assets/data/gallery.json')
  .then(res => res.json())
  .then(data => {
    buildMarquee('coaching-track', data.coaching, '../assets/images/coaching/');
    buildMarquee('university-track', data.university, '../assets/images/university/');
  })
  .catch(err => console.error('Gallery error:', err));

function buildMarquee(trackId, images, basePath) {
  const track = document.getElementById(trackId);
  if (!track) return;

  // Duplicate images for seamless loop
  const fullList = images.concat(images);

  fullList.forEach(file => {
    const img = document.createElement('img');
    img.src = basePath + file;
    img.alt = '';
    track.appendChild(img);
  });
}
