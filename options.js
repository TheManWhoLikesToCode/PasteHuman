document.addEventListener('DOMContentLoaded', function () {
    // Load settings
    chrome.storage.sync.get({
        minDelay: 10,
        maxDelay: 75,
        extraDelayChance: 0.05,
        extraDelayMin: 20,
        extraDelayMax: 100,
    }, function (items) {
        document.getElementById('minDelay').value = items.minDelay;
        document.getElementById('maxDelay').value = items.maxDelay;
        document.getElementById('extraDelayChance').value = items.extraDelayChance;
        document.getElementById('extraDelayMin').value = items.extraDelayMin;
        document.getElementById('extraDelayMax').value = items.extraDelayMax;
    });

    // Save settings
    document.getElementById('settingsForm').addEventListener('submit', function (e) {
        e.preventDefault();
        chrome.storage.sync.set({
            minDelay: parseInt(document.getElementById('minDelay').value),
            maxDelay: parseInt(document.getElementById('maxDelay').value),
            extraDelayChance: parseFloat(document.getElementById('extraDelayChance').value),
            extraDelayMin: parseInt(document.getElementById('extraDelayMin').value),
            extraDelayMax: parseInt(document.getElementById('extraDelayMax').value),
        }, function () {
            alert('Settings saved');
        });
    });
});