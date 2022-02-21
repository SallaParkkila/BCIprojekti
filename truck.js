let vehicle = {
    type: "truck",
    tireCount: 6,
    capacity: 5
}

for (property in vehicle) {
    console.log(property + " - " + vehicle[property]);
}