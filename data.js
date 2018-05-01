function getCSV () {
  return new Promise (function (resolve, reject) {
    d3.csv('Video_Games_Sales_as_at_22_Dec_2016.csv', function (data) {
      return {
        Name: data.Name,
        Platform: data.Platform,
        Year_of_Release: data.Year_of_Release,
        Genre: data.Genre,
        Publisher: data.Publisher,
        NA_Sales: data.NA_Sales,
        EU_Sales: data.EU_Sales,
        JP_Sales: data.JP_Sales,
        Global_Sales: data.Global_Sales,
        Critic_Score: data.Critic_Score
      }
    }).then(dataJSON => {
      let dataset = []
      dataJSON.forEach((data, index) => {
        // limit data to top10
        if (index >= 21) {
          return false
        }
        dataset.push(data)
      })
      resolve(dataset)
    }).catch(err => {
      reject(err)
    })
  })  
}

// without svg
getCSV()
  .then(dataset => {
    d3.select('#bar-chart').selectAll('div')
      .data(dataset)
      .enter()
      .append('div')
      .attr('class', 'bar')
      .style('width', function (d) {
        return (d.Global_Sales * 10) +'px'
      })
      .append('div')
      .attr('class', 'bar-txt')
      .append('text')
      .text(function (d, index) {
        return index+1 +'. '+ d.Name
      })
  })
  .catch(err => {
    console.log(err)
  })


// using SVG
getCSV()
  .then(dataset => {

    let svg = d3.select('#bar-svg')
                .append('svg')
                .attr('width', 1000)
                .attr('height', 550)
                .style('border', '1px solid black')
    
    let yScale = d3.scaleLinear()
                  .domain([0, 60])
                  .range([0, 200])

    let colorScale = d3.scaleLinear()
                       .domain([0, 100])
                       .range(['Chocolate', 'Maroon'])

    let bar_chart = svg.selectAll('rect')
      .data(dataset)
      .enter()

      bar_chart.append('rect')
      .attr('x', (d, i) => {
        return 3 + i * 45
      })
      .attr('y', (d) => {
        return 300 - yScale(+d.Global_Sales)
      })
      .attr('width', 40)
      .transition()
      .duration(750)
      .delay(function(d, i) { return i * 50; })
      .attr('height', (d) => {
        return yScale(+d.Global_Sales)
      })
      // .style('background', 'blue')
      .attr('fill', function (d) { 
        return colorScale(d.Global_Sales)
      })
      
      bar_chart.append('text')
        .attr('x', (d, i) => {
          return 3 + i * 45
        })
        .transition()
        .duration(750)
        .delay(function(d, i) { return i * 50; })
        .attr('y', (d) => {
          return 300 - yScale(+d.Global_Sales)
        })
        .attr('dy', -5)
        .text((d) => {
          return d.Global_Sales
        })

      bar_chart.append('text')
        .attr('transform', function (d, i) {
          return `translate(${20 + i * 45}, 310) rotate(90)` 
        })
        .transition()
        .duration(750)
        .delay(function(d, i) { return i * 50; })
        .text((d) => {
          return d.Name
        })
        .style('font-size', '12px'
  })
  .catch(err => {
    console.log(err)
  })