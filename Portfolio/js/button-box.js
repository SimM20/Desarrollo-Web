document.addEventListener('DOMContentLoaded', function () {
    const sounds = [new Audio('../audio/RogerRoger.wav'), new Audio('../audio/DarthVader.wav'), new Audio('../audio/HelloThere.wav'), new Audio('../audio/BadFeelling.wav'), new Audio('../audio/GeneralKenobi.wav')];
    const buttons = [document.getElementById('button0'), document.getElementById('button1'), document.getElementById('button2'), document.getElementById('button3'), document.getElementById('button4')];
    
    buttons.forEach((bttn, i) => {
        bttn.addEventListener('click', () => {
            sounds[i].currentTime = 0;
            sounds[i].play();
        });
    });
});