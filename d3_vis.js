d3.csv("https://raw.githubusercontent.com/6859-sp21/final-project-police-brutality/main/data/fatal-police-shootings-data.csv").then((data) => {
    fpsData = data;
    d3_test();
});

function d3_test() {
    testData = fpsData.slice(6200).filter(d => d.age !== "");

    var barHeight = 25,
        width = 1000,
        height = testData.length * barHeight;

    const container = d3.select("svg#d3_test")
        .attr("width", width)
        .attr("height", height);
    container.selectAll("rect")
        .data(testData)
        .join("rect")
            .attr("x", 0)
            .attr("y", (d, i) => i * barHeight)
            .attr("width", d => parseInt(d.age))
            .attr("height", barHeight)
    container.selectAll("text")
        .data(testData)
        .join("text")
            .attr("x", d => parseInt(d.age))
            .attr("y", (d, i) => i * barHeight)
            .attr("dx", "15")
            .attr("dy", "1.3em")
            .text(d => d.name + ", " + d.age)
};