$(document).ready(function () {

    req = new XMLHttpRequest();

    req.open("GET", './GDP-data.json', true);

    // req.open('GET', 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);

    req.send();

    req.onload = function () {

        json = JSON.parse(req.responseText);

        function newDate(date) {
            let arr = date.split('-')
            let shifted = arr.shift()
            let narr = [...arr, shifted]
            return new Date(narr.join('-'))
        }

        let dataset = json.data.map(obj => {
            let data = { date: newDate(obj[0]), value: obj[1] };
            return data;
        });

        const xDate = d => d.date;

        const yVal = d => d.value;

        const w = 1200;

        const h = 600;

        const padding = 50;

        const svg = d3.select('body')
            .append('svg')
            .attr('width', w)
            .attr('height', h)
        const tooltip = d3.select('.tooltip')
            .append('div')
            .attr('id', 'tooltip')
        const xScale = d3.scaleTime()
            .domain([d3.min(dataset, xDate), d3.max(dataset, xDate)])
            .range([padding, w - padding])

        const yScale = d3.scaleLinear()
            .domain([d3.min(dataset, yVal), d3.max(dataset, yVal)])
            .range([h - padding, padding])

        svg.selectAll('rect')
            .data(dataset)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d) => xScale(xDate(d)))
            .attr('y', (d) => yScale(yVal(d)))
            .attr('width', 5)
            .attr('height', (d) => yVal(d))
            .attr('data-date', (d)=>xDate(d))
            .attr('data-gdp', (d)=>yVal(d))
            .on('mouseover', (d) => {
                tooltip.text(`${d.date}` + ', ' + `${d.value}`)
                    .attr('id', 'tooltip')
                    .attr('data-date', d.date)
                    .style('opacity', '1') 
            })
            .on('mouseout', (d) => {
                tooltip.style('opacity', '0')
            })

        const xAxis = d3.axisBottom(xScale)

        const yAxis = d3.axisLeft(yScale)

        svg.append('g')
            .attr('transform', 'translate(0,' + (h - padding) + ')')
            .call(xAxis)
            .attr('id', 'x-axis')

        svg.append('g')
            .attr('transform', 'translate(' + padding + ',0)')
            .call(yAxis)
            .attr('id', 'y-axis')

    }

})