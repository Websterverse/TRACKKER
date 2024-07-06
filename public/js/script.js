const socket = io(); // Initialize the socket.io

// Prompt user for their name when they click on the page
document.addEventListener('click', () => {
    if (!window.personName) {
        window.personName = prompt("Please enter your name:");
        if (!window.personName) {
            alert("Name is required to show your location on the map.");
        } else {
            initializeGeolocation();
        }
    }
}, { once: true });

function initializeGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude, name: window.personName });
        }, (error) => {
            console.error(error);
        }, {
            enableHighAccuracy: true,
            timeout: 60000,
            maximumAge: 0,
        });
    }
}

const map = L.map("map").setView([0, 0], 16); // Adjusted initial view to avoid errors

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "KING TOWN",
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
    const { id, latitude, longitude, name } = data;
    map.setView([latitude, longitude]);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
        markers[id].bindPopup(name).openPopup();
    } else {
        markers[id] = L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup(name)
            .openPopup();
    }
});

socket.on("user-disconnect", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
