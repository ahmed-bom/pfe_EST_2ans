
function addPulsingEffect() {
    const playerName = document.querySelector('.player-name');
    let intensity = 0.5;
    let increasing = true;
    
    setInterval(() => {
      if (increasing) {
        intensity += 0.02;
        if (intensity >= 1) increasing = false;
      } else {
        intensity -= 0.02;
        if (intensity <= 0.5) increasing = true;
      }
      
      playerName.style.textShadow = `0 0 ${5 * intensity}px rgba(255, 0, 0, ${intensity})`;
    }, 50);
  }
  
  function updateRecordingTime() {
    let seconds = 827; 
    const recordingTimeElement = document.getElementById('recordingTime');
    const timecodeElement = document.getElementById('timecodeDisplay');
    
    setInterval(() => {
      seconds++;
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      
      recordingTimeElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      
     
      const frames = Math.floor(Math.random() * 24);
      timecodeElement.textContent = `01:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
    }, 1000);
  }
  
  function updateBatteryLevel() {
    const batteryLevel = document.querySelector('.battery-level');
    let level = 29;
    let width = (level / 100) * 26;
    batteryLevel.style.width = `${width}px`;
    
  
    setInterval(() => {
      if (level > 0) {
        level -= 0.1;
        width = (level / 100) * 26;
        batteryLevel.style.width = `${width}px`;
        document.querySelector('.battery-indicator span').textContent = `${Math.floor(level)}%`;
        
        
        if (level < 10) {
          batteryLevel.style.animation = 'batteryPulse 0.5s infinite';
        }
      }
    }, 10000); 
  }
  
  function updateClock() {
    const dateElement = document.getElementById('currentDate');
    const timeElement = document.getElementById('currentTime');
    
    setInterval(() => {
      const now = new Date();
      
      
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      timeElement.textContent = `${hours}:${minutes}:${seconds}`;
      
     
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const year = now.getFullYear();
      dateElement.textContent = `${month}/${day}/${year}`;
    }, 1000);
  }
  
 
 
  window.onload = function() {
   
    addPulsingEffect();
    updateRecordingTime();
    updateBatteryLevel();
    updateClock();
  
    
    document.getElementById('leftButton').addEventListener('click', () => {
      game.spectate()
    });
    
    document.getElementById('rightButton').addEventListener('click', () => {
      game.spectate()
    });
  };











