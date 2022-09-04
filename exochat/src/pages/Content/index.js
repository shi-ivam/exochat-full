import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request, sender, sendResponse);
    printLine('Received message from background script');
    if (request.subject === 'getVideoTime') {
        const video = document.querySelector('video');
        const currentTime = video.currentTime;
        const duration = video.duration;
        const percentage = (currentTime / duration) * 100;
        sendResponse({ currentTime, duration, percentage });
    }
    if (request.subject === 'setVideoTime') {
        printLine('Setting Video TIme');
        const video = document.querySelector('video');
        video.currentTime = request.time;
        sendResponse({ currentTime: video.currentTime });
    }
});